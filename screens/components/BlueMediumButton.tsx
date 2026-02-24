import React from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  PressableProps,
  View,
} from "react-native";

export default function YellowButton({
  onPress,
  text,
  ...props
}: Omit<PressableProps, "style"> & { text: string }) {
  return (
    <View>
      <Pressable
        {...props}
        onPress={onPress}
        style={({ pressed }) =>
          pressed ? [styles.button, { opacity: 0.7 }] : [styles.button]
        }
      >
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4169E1",
    borderRadius: 30,
    width: "100%",
    minWidth: 150,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#4169E1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
