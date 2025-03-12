import React from "react";
import { Image, StyleSheet, View } from "react-native";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/splash.png")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default LoadingScreen;
