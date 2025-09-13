import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Linking,
  ActivityIndicator,
  View,
  Dimensions,
} from "react-native";
import { useApp } from "../state/AppProvider";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

export default function HomeScreen() {
  const { state } = useApp();

  return (
    <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardWrapper}>
          {/* Weather Card */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100, duration: 500 }}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>🌤 Current Weather</Text>
            {state.loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : state.weather ? (
              <>
                <Text style={styles.temp}>
                  {state.weather.temp}°{state.unit === "metric" ? "C" : "F"}
                </Text>
                <Text style={styles.weatherText}>
                  {state.weather.weatherMain} — {state.weather.weatherDesc}
                </Text>
                <Text style={styles.feelsLike}>
                  Feels like: {state.weather.feels_like}
                </Text>
              </>
            ) : (
              <Text>No weather data</Text>
            )}
          </MotiView>
        </View>

        <View style={styles.cardWrapper}>
          {/* Forecast Card */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 200, duration: 500 }}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>📅 5-Day Forecast</Text>
            {state.forecast && state.forecast.length > 0 ? (
              state.forecast.map((f, idx) => (
                <Text key={idx} style={styles.forecastText}>
                  {f.date}: {f.temp}° — {f.weatherMain}
                </Text>
              ))
            ) : (
              <Text>No forecast data</Text>
            )}
          </MotiView>
        </View>

        <View style={styles.cardWrapper}>
          {/* News Card */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300, duration: 600 }}
            style={[styles.card, styles.newsCard]}
          >
            <Text style={styles.cardTitle}>📰 Headlines</Text>
            {state.articles.length > 0 ? (
              state.articles.map((a, idx) => (
                <Text
                  key={idx}
                  style={styles.link}
                  onPress={() => Linking.openURL(a.url)}
                >
                  • {a.title} ({a.sourceName})
                </Text>
              ))
            ) : (
              <Text>No articles</Text>
            )}
          </MotiView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 15 },
  cardWrapper: {
    width: "100%",
    maxWidth: width > 800 ? 600 : 700, // smaller on wide screens
    alignSelf: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  temp: { fontSize: 36, fontWeight: "bold", color: "#2d1692ff" },
  weatherText: { fontSize: 16, marginVertical: 5, color: "#555" },
  feelsLike: { fontSize: 14, color: "#777" },
  forecastText: { fontSize: 15, marginVertical: 2 },
  newsCard: { backgroundColor: "white" },
  link: { color: "#2d1692ff", marginBottom: 5, fontSize: 15 },
});
