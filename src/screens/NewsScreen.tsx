import React from "react";
import {
  Text,
  FlatList,
  Linking,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { useApp } from "../state/AppProvider";
import { Article } from "../types";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

export default function NewsScreen() {
  const { state } = useApp();

  function openArticle(url: string) {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  }

  const renderItem = ({ item }: { item: Article }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity style={styles.card} onPress={() => openArticle(item.url)}>
        <Text style={styles.title}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.desc}>{item.description}</Text>
        ) : null}
        <Text style={styles.meta}>
          {item.sourceName}
          {item.publishedAt
            ? ` • ${new Date(item.publishedAt).toLocaleDateString()}`
            : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100, duration: 500 }}
      >
        <Text style={styles.heading}>📰 Latest News</Text>
      </MotiView>

      {state.articles.length > 0 ? (
        <FlatList
          data={state.articles}
          renderItem={renderItem}
          keyExtractor={(item, idx) => idx.toString()}
          contentContainerStyle={{ padding: 15 }}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No articles available
        </Text>
      )}
    </LinearGradient>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    width: "100%",
    maxWidth: width > 800 ? 650 : 700, // shrink on desktop
    alignSelf: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 6, color: "#111" },
  desc: { fontSize: 14, color: "#555", marginBottom: 6 },
  meta: { fontSize: 12, color: "#888" },
});
