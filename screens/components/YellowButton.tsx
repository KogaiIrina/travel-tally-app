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
    backgroundColor: "#FFB547",
    borderRadius: 50,
    width: 270,
    height: 50,
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
