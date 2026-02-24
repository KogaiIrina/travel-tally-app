import React from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  PressableProps,
  View,
} from "react-native";

export function SmallPrimaryButton({
  onPress,
  text,
  ...props
}: Omit<PressableProps, "style"> & { text: string }) {
  return (
    <View style={styles.container}>
      <Pressable
        {...props}
        onPress={onPress}
        style={({ pressed }) =>
          pressed
            ? [styles.primaryButton, { opacity: 0.7 }]
            : [styles.primaryButton]
        }
      >
        <Text style={styles.primaryButtonText}>{text}</Text>
      </Pressable>
    </View>
  );
}

export function SmallWhiteButton({
  onPress,
  text,
  ...props
}: Omit<PressableProps, "style"> & { text: string }) {
  return (
    <View style={styles.container}>
      <Pressable
        {...props}
        onPress={onPress}
        style={({ pressed }) =>
          pressed
            ? [styles.whiteButton, { opacity: 0.7 }]
            : [styles.whiteButton]
        }
      >
        <Text style={styles.whiteButtonText}>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  primaryButton: {
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
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  whiteButton: {
    backgroundColor: "#F4F7FF",
    borderRadius: 30,
    width: "100%",
    minWidth: 120,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  whiteButtonText: {
    color: "#4169E1",
    fontSize: 18,
    fontWeight: "700",
  },
});
