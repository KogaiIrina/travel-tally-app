import React from "react";
import { NativeBaseProvider } from "native-base";
import { StyleSheet, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExpensesScreen from "./ExpensesScreen";
import TripsScreen from "./TripsScreen";
import StatisticScreen from "./StatisticScreen";
import TabBar, { TabType } from "./components/navigation/TabBar";
import { loadSettings, useSetting } from "../utils/settings";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";

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
  const [activeTab, setActiveTab] = React.useState<TabType>("expenses");
  const [selectedTripId, setSelectedTripId] = React.useState<number | null>(null);

  // When a trip is selected from TripsScreen, simply set the trip to view it fullscreen
  const handleSelectTrip = (id: number) => {
    setSelectedTripId(id);
  };

  const _onDone = () => {
    setShowRealApp(true);
  };
  loadSettings(queryClient).catch(console.error);
  if (showRealApp) {
    return (
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <View style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
            {selectedTripId ? (
              <ExpensesScreen
                tripId={selectedTripId}
                onBack={() => setSelectedTripId(null)}
              />
            ) : (
              <>
                <View style={{ flex: 1 }}>
                  {activeTab === "expenses" ? (
                    <ExpensesScreen />
                  ) : activeTab === "statistics" ? (
                    <StatisticScreen />
                  ) : (
                    <TripsScreen onSelectTrip={handleSelectTrip} />
                  )}
                </View>
                <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
              </>
            )}
          </View>
        </NativeBaseProvider>
      </QueryClientProvider>
    );
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <OnboardingFlow onComplete={_onDone} />
        </NativeBaseProvider>
      </QueryClientProvider>
    );
  }
}
