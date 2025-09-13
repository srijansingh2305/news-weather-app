// utils/filtering.ts
export function mapWeatherToKeywords(tempC: number): string[] {
  const keywords: string[] = [];

  if (tempC <= 10) {
    // Cold → depressing news
    keywords.push("depression", "tragedy", "loss", "sadness", "crisis");
  } else if (tempC > 10 && tempC <= 20) {
    // Cool → winning & happiness
    keywords.push("win", "victory", "celebration", "happiness", "success");
  } else {
    // Hot → fear
    keywords.push("fear", "panic", "danger", "threat", "terror");
  }

  return keywords;
}

export function keywordsToQuery(keywords: string[]): string {
  // Join keywords with OR for NewsAPI query
  return keywords.map(k => `"${k}"`).join(" OR ");
}
