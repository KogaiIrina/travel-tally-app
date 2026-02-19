import React from "react";
import { NativeBaseProvider } from "native-base";
import { StyleSheet, View, Image } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExpensesScreen from "./ExpensesScreen";
import { loadSettings, useSetting } from "../utils/settings";
import AppIntroSlider from "react-native-app-intro-slider";
import { Slide, slides } from "../utils/slides";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO: Remove the config option once updated to RN 0.65 https://github.com/facebook/react-native/commit/480dabd66547a60522249eda203a3eb1934b02e5
      gcTime: 60 * 1000,
    },
  },
});

export default function MainScreen() {
  const [showRealApp, setShowRealApp] = useSetting<boolean>("showRealApp");

  const _renderItem = ({ item }: { item: Slide }) => {
    if ("component" in item) {
      const CustomComponent = item.component;
      return <CustomComponent />;
    } else {
      return (
        <View style={styles.slide}>
          <Image source={item.image} style={styles.image} />
        </View>
      );
    }
  };

  const _onDone = () => {
    setShowRealApp(true);
  };
  loadSettings(queryClient).catch(console.error);
  if (showRealApp) {
    return (
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <ExpensesScreen />
        </NativeBaseProvider>
      </QueryClientProvider>
    );
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <AppIntroSlider
            renderItem={_renderItem}
            data={slides}
            onDone={_onDone}
          />
        </NativeBaseProvider>
      </QueryClientProvider>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7d253",
  },
  image: {
    width: 350,
    height: 600,
    borderRadius: 10,
  },
});
