import React, { useState } from "react";
import { Text, TextInput, FlatList, Pressable, StyleSheet, View, Dimensions } from "react-native";
import { useApp } from "../state/AppProvider";
import { Unit } from "../types";
import { OPENWEATHER_KEY } from "../../env";
import { LinearGradient } from "expo-linear-gradient";
import { CustomButton } from "../components/CustomButton";

export const SettingsScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const [tempUnit, setTempUnit] = useState<Unit>(state.unit);
  const [categoryInput, setCategoryInput] = useState("");
  const [cityInput, setCityInput] = useState(state.city || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  async function fetchCitySuggestions(query: string) {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=6&appid=${OPENWEATHER_KEY}`
      );
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setSuggestions([]);
    }
  }

  function saveUnit() {
    dispatch({ type: "SET_UNIT", unit: tempUnit });
  }

  function saveCity(cityName?: string) {
    const chosenCity = cityName || cityInput;
    if (!chosenCity.trim()) return;
    dispatch({ type: "SET_CITY", city: chosenCity.trim() });
    setCityInput(chosenCity.trim());
    setSuggestions([]);
  }

  function addCategory() {
    if (!categoryInput.trim()) return;
    dispatch({
      type: "SET_CATEGORIES",
      categories: [...state.categories, categoryInput.trim()],
    });
    setCategoryInput("");
  }

  function resetCategories() {
    dispatch({ type: "SET_CATEGORIES", categories: [] });
  }

  return (
    <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>⚙️ Settings</Text>

        {/* City */}
        <Text style={styles.label}>City</Text>
        <TextInput
          placeholder="e.g. Delhi"
          value={cityInput}
          onChangeText={(text) => {
            setCityInput(text);
            fetchCitySuggestions(text);
          }}
          style={styles.input}
        />
        <CustomButton title="Save City" onPress={() => saveCity()} />

        {suggestions.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={suggestions}
              keyExtractor={(item, idx) => `${item.name}-${idx}`}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    saveCity(
                      item.state ? `${item.name}, ${item.state}, ${item.country}` : `${item.name}, ${item.country}`
                    )
                  }
                  style={styles.suggestion}
                >
                  <Text>
                    {item.name}
                    {item.state ? `, ${item.state}` : ""}, {item.country}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Unit */}
        <Text style={styles.label}>Temperature Unit</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <CustomButton title="Celsius" onPress={() => setTempUnit("metric")} color="#4c9bafff" />
          <CustomButton title="Fahrenheit" onPress={() => setTempUnit("imperial")} color="#4c9bafff" />
        </View>
        <CustomButton title="Save Unit" onPress={saveUnit} color="#4c9bafff" />

        {/* Categories */}
        <Text style={styles.label}>News Categories</Text>
        <TextInput
          placeholder="e.g. technology"
          value={categoryInput}
          onChangeText={setCategoryInput}
          style={styles.input}
        />
        <CustomButton title="Add Category" onPress={addCategory} color="#4c9bafff" />
        <CustomButton title="Reset Categories" onPress={resetCategories} color="#4c9bafff" />
        <Text style={{ marginTop: 8 }}>Selected: {state.categories.join(", ") || "None"}</Text>
      </View>
    </LinearGradient>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: width > 600 ? "60%" : "90%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", marginVertical: 8 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  dropdown: {
    position: "absolute",
    top: 145, // adjust to match TextInput position
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
    zIndex: 9999,
    elevation: 5,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
