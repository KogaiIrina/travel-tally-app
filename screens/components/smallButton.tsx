import React from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  PressableProps,
  View,
} from "react-native";

export function SmallYellowButton({
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
            ? [styles.yellowButton, { opacity: 0.7 }]
            : [styles.yellowButton]
        }
      >
        <Text style={styles.yellowButtonText}>{text}</Text>
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
    marginTop: 100,
    marginBottom: 15,
  },
  yellowButton: {
    backgroundColor: "#FFB547",
    borderRadius: 50,
    width: 190,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    alignSelf: "center",
  },
  yellowButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 22,
  },
  whiteButton: {
    backgroundColor: "transparent",
    borderRadius: 50,
    width: 150,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    alignSelf: "center",
  },
  whiteButtonText: {
    color: "#212224",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
  },
});
