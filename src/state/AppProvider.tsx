
import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { Platform } from "react-native";
import { Unit, Article, WeatherCurrent, ForecastItem } from "../types";
import * as Location from "expo-location";
import { fetchCurrentWeather, fetch5DayForecast } from "../services/weatherService";
import { fetchNewsByQuery } from "../services/newsService";
import { mapWeatherToKeywords, keywordsToQuery } from "../utils/filtering";
import { OPENWEATHER_KEY } from "../../env";

type State = {
  unit: Unit;
  categories: string[];
  city?: string;
  location?: { lat: number; lon: number };
  weather?: WeatherCurrent;
  forecast?: ForecastItem[];
  articles: Article[];
  loading: boolean;
  error?: string;
};

const initialState: State = {
  unit: "metric",
  categories: [],
  city: "Delhi", // 
  articles: [],
  loading: false,
};

type Action =
  | { type: "SET_UNIT"; unit: Unit }
  | { type: "SET_CATEGORIES"; categories: string[] }
  | { type: "SET_CITY"; city: string }
  | { type: "SET_LOCATION"; location: { lat: number; lon: number } }
  | { type: "SET_WEATHER"; weather: WeatherCurrent }
  | { type: "SET_FORECAST"; forecast: ForecastItem[] }
  | { type: "SET_ARTICLES"; articles: Article[] }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error?: string };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "SET_UNIT": return { ...s, unit: a.unit };
    case "SET_CATEGORIES": return { ...s, categories: a.categories };
    case "SET_CITY": return { ...s, city: a.city };
    case "SET_LOCATION": return { ...s, location: a.location };
    case "SET_WEATHER": return { ...s, weather: a.weather };
    case "SET_FORECAST": return { ...s, forecast: a.forecast };
    case "SET_ARTICLES": return { ...s, articles: a.articles };
    case "SET_LOADING": return { ...s, loading: a.loading };
    case "SET_ERROR": return { ...s, error: a.error };
    default: return s;
  }
}

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  refreshAll: () => Promise<void>;
}>(null as any);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshAll = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", loading: true });

      let lat = 28.6139; // fallback: Delhi
      let lon = 77.2090;

      if (state.city) {
    
        const city = encodeURIComponent(state.city);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${state.unit}&appid=${OPENWEATHER_KEY}`
        );
        const data = await res.json();
        if (data.coord) {
          lat = data.coord.lat;
          lon = data.coord.lon;
        } else {
          console.warn(`Could not find coords for city: ${state.city}, falling back to Delhi`);
        }
      } else if (Platform.OS !== "web") {
        //fallback to GPS
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          lat = loc.coords.latitude;
          lon = loc.coords.longitude;
        } else {
          dispatch({ type: "SET_ERROR", error: "Location permission denied" });
        }
      }

      dispatch({ type: "SET_LOCATION", location: { lat, lon } });

      // Weather + forecast
      const weather = await fetchCurrentWeather(lat, lon, state.unit);
      dispatch({ type: "SET_WEATHER", weather });

      const forecast = await fetch5DayForecast(lat, lon, state.unit);
      dispatch({ type: "SET_FORECAST", forecast });

      // Weather-based news filtering
      const tempC = state.unit === "imperial" ? (weather.temp - 32) * (5 / 9) : weather.temp;
      const kws = mapWeatherToKeywords(Number(tempC.toFixed(1)), weather.weatherMain);
      const query = keywordsToQuery(kws);

      const fullQuery = state.categories.length
        ? `${query} (${state.categories.join(" OR ")})`
        : query;

      let articles = await fetchNewsByQuery(fullQuery);

      // fallback if no news
      if (!articles || articles.length === 0) {
        console.warn("⚠️ No filtered news found → fallback to generic weather news");
        articles = await fetchNewsByQuery("weather");
      }

      dispatch({ type: "SET_ARTICLES", articles });
      dispatch({ type: "SET_LOADING", loading: false });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", error: err.message || "Unknown error" });
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, [state.unit, state.categories, state.city]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <AppContext.Provider value={{ state, dispatch, refreshAll }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
