import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import WelcomeStep from "./WelcomeStep";
import CurrencyStep from "./CurrencyStep";

interface Props {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState<"welcome" | "currency">("welcome");

  return (
    <View style={styles.container}>
      {step === "welcome" && (
        <WelcomeStep onNext={() => setStep("currency")} />
      )}
      {step === "currency" && (
        <CurrencyStep onComplete={onComplete} />
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
