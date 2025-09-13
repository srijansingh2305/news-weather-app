
import { ScrollView, Text, StyleSheet, Linking } from "react-native";
import { Article } from "../types";
import { NEWSAPI_KEY } from "../../env";


export async function fetchNewsByQuery(
  query: string = "weather",
  pageSize = 20
): Promise<Article[]> {
  try {
    const q = encodeURIComponent(query.trim() || "weather");
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${q}&pageSize=${pageSize}&language=en&sortBy=publishedAt&apiKey=${NEWSAPI_KEY}`
    );

    if (!res.ok) {
      console.error("News API error:", res.status, res.statusText);
      throw new Error("News fetch failed");
    }

    const data = await res.json();
    if (!data.articles || data.articles.length === 0) {
      return [];
    }

    const articles = data.articles.map((a: any) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      sourceName: a.source?.name,
      publishedAt: a.publishedAt,
    })) as Article[];

    return articles;
  } catch (err) {
    console.error("fetchNewsByQuery error:", err);
    return [];
  }
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f9fa" },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#1a73e8", marginBottom: 6 },
  source: { fontSize: 13, color: "#555" },
  date: { fontSize: 12, color: "#999", marginTop: 4 },
  empty: { fontSize: 16, textAlign: "center", marginTop: 40, color: "#666" },
});
