// types.ts
export type Unit = "metric" | "imperial";

export interface WeatherCurrent {
  temp: number;
  feels_like?: number;
  weatherMain: string; // e.g. "Clear", "Clouds", "Rain"
  weatherDesc: string;
  humidity?: number;
}

export interface ForecastItem {
  date: string; // ISO
  temp: number;
  weatherMain: string;
  weatherDesc: string;
}

export interface Article {
  title: string;
  description?: string;
  url: string;
  sourceName?: string;
  publishedAt?: string;
}
