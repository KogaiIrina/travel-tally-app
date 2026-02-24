import React from "react";
import { View } from "react-native";
import ExpensesScreen from "./ExpensesScreen";
import TripsScreen from "./TripsScreen";
import StatisticScreen from "./StatisticScreen";
import TabBar, { TabType } from "./components/navigation/TabBar";
import { useSetting } from "../utils/settings";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";

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

  if (showRealApp) {
    return (
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
    );
  } else {
    return (
      <OnboardingFlow onComplete={_onDone} />
    );
  }
}
