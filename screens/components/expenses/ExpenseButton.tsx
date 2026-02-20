import React, { ReactElement } from "react";
import { Text, StyleSheet, Pressable } from "react-native";

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
          backgroundColor: color,
          borderWidth: active ? 3 : 0,
          borderColor: active ? "#1A1A1A" : "transparent",
          transform: [{ scale: active ? 0.95 : 1 }],
        },
      ]}
      onPress={onPress}
    >
      {icon}
      <Text style={styles.caption} numberOfLines={1}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 90,
    borderRadius: 18,
  },
  caption: {
    fontSize: 12,
    alignSelf: "center",
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 15,
    marginTop: 6,
    marginHorizontal: 4,
  },
});
