import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  color?: string;
};

export const CustomButton: React.FC<Props> = ({ title, onPress, color = "#4c9bafff" }) => {
  return (
    <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "flex-start", // shrink to content
    marginVertical: 6,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
