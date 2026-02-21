import React, { ReactElement } from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";

interface ExpenseButtonProps {
  color: string;
  text: string;
  icon: ReactElement;
  active?: boolean;
  onPress: () => void;
}

export default function ExpenseButton({
  color,
  text,
  icon,
  active,
  onPress,
}: ExpenseButtonProps) {
  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: active ? "#F4F7FF" : "#FFFFFF",
          borderWidth: 2,
          borderColor: active ? "#4169E1" : "transparent",
          transform: [{ scale: active ? 0.98 : 1 }],
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={[styles.caption, { color: active ? "#4169E1" : "#1A1A1A" }]} numberOfLines={1}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 105,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    paddingTop: 8,
    paddingBottom: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  caption: {
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 4,
  },
});
