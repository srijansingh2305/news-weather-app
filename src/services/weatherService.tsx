// weatherService.ts
import { WeatherCurrent, ForecastItem, Unit } from "../types";
import { OPENWEATHER_KEY } from "../../env";


export async function fetchCurrentWeather(lat: number, lon: number, units: Unit = "metric"): Promise<WeatherCurrent> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_KEY}`
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();
  const main = data.main || {};
  const w = (data.weather && data.weather[0]) || {};
  return {
    temp: main.temp,
    feels_like: main.feels_like,
    weatherMain: w.main || "",
    weatherDesc: w.description || "",
    humidity: main.humidity,
  };
}

export async function fetch5DayForecast(lat: number, lon: number, units: Unit = "metric"): Promise<ForecastItem[]> {
  // OpenWeatherMap 5 day / 3 hour data -- convert to daily averages (simple approach)
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_KEY}`
  );
  if (!res.ok) throw new Error("Forecast fetch failed");
  const data = await res.json();
  // group by date (YYYY-MM-DD) take midday or average
  const buckets: Record<string, any[]> = {};
  for (const item of data.list || []) {
    const date = item.dt_txt.split(" ")[0];
    buckets[date] = buckets[date] || [];
    buckets[date].push(item);
  }
  const results: ForecastItem[] = Object.keys(buckets).slice(0, 5).map(date => {
    const items = buckets[date];
    const avgTemp = items.reduce((s:any, it:any)=> s + it.main.temp, 0) / items.length;
    const w = items[Math.floor(items.length/2)].weather[0] || {};
    return {
      date,
      temp: Math.round(avgTemp * 10) / 10,
      weatherMain: w.main,
      weatherDesc: w.description,
    };
  });
  return results;
}

export async function fetchWeatherByCity(
  city: string,
  units: Unit = "metric"
): Promise<WeatherCurrent> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${OPENWEATHER_KEY}`
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();
  const main = data.main || {};
  const w = (data.weather && data.weather[0]) || {};
  return {
    temp: main.temp,
    feels_like: main.feels_like,
    weatherMain: w.main || "",
    weatherDesc: w.description || "",
    humidity: main.humidity,
  };
}

export async function fetchForecastByCity(
  city: string,
  units: Unit = "metric"
): Promise<ForecastItem[]> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${OPENWEATHER_KEY}`
  );
  if (!res.ok) throw new Error("Forecast fetch failed");
  const data = await res.json();

  const buckets: Record<string, any[]> = {};
  for (const item of data.list || []) {
    const date = item.dt_txt.split(" ")[0];
    buckets[date] = buckets[date] || [];
    buckets[date].push(item);
  }
  return Object.keys(buckets).slice(0, 5).map(date => {
    const items = buckets[date];
    const avgTemp = items.reduce((s:any, it:any)=> s + it.main.temp, 0) / items.length;
    const w = items[Math.floor(items.length/2)].weather[0] || {};
    return {
      date,
      temp: Math.round(avgTemp * 10) / 10,
      weatherMain: w.main,
      weatherDesc: w.description,
    };
  });
}

