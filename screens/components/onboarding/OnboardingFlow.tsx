import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import WelcomeStep from "./WelcomeStep";
import CurrencyStep from "./CurrencyStep";
import DestinationStep from "./DestinationStep";

interface Props {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState<"welcome" | "currency" | "destination">("welcome");

  return (
    <View style={styles.container}>
      {step === "welcome" && (
        <WelcomeStep onNext={() => setStep("currency")} />
      )}
      {step === "currency" && (
        <CurrencyStep onComplete={() => setStep("destination")} />
      )}
      {step === "destination" && (
        <DestinationStep onComplete={onComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
