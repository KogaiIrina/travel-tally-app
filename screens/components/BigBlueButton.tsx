import React from "react";
import { StyleSheet, Text, Pressable, PressableProps } from "react-native";

export default function BigBlueButton({
  onPress,
  isActive,
  text,
  ...props
}: Omit<PressableProps, "style"> & { text: string } & { isActive: boolean }) {
  return (
    <Pressable
      {...props}
      onPress={onPress}
      style={() =>
        isActive
          ? [styles.button]
          : [styles.button, { backgroundColor: "rgba(0, 0, 0, 0.2)" }]
      }
    >
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2C65E1",
    borderRadius: 16,
    width: 340,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 22,
  },
});
