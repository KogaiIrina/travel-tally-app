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
          opacity: active ? 0.6 : 1,
          shadowColor: active ? color : "#fff",
          shadowOffset: {
            width: 10,
            height: 12,
          },
          shadowOpacity: active ? 0.58 : 0,
          shadowRadius: active ? 16.0 : 0,
          elevation: active ? 24 : 0,
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
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    width: 80,
    borderRadius: 15,
  },
  caption: {
    fontSize: 12,
    alignSelf: "center",
    color: "rgba(255, 255, 255, 1)",
    lineHeight: 14,
    marginTop: 4,
    marginHorizontal: 4,
  },
});
