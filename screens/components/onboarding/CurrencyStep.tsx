import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity, ActivityIndicator } from "react-native";
import useCountries from "../../../db/hooks/useCountries";
import { useHomeCountryMutation } from "../../../db/hooks/useHomeCountry";
import CountrySearchModal from "../selector/CountrySearchModal";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onComplete: () => void;
}

export default function CurrencyStep({ onComplete }: Props) {
  const { data: countries } = useCountries();
  const {
    mutate: setHomeCountry,
    isPending: updatingHomeCountry,
    isSuccess: homeCountryUpdated,
  } = useHomeCountryMutation();
  const [selectedCountryId, setSelectedCountryId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (homeCountryUpdated) {
      onComplete();
    }
  }, [homeCountryUpdated, onComplete]);

  const onSave = () => {
    if (countries && selectedCountryId !== undefined) {
      setHomeCountry(selectedCountryId);
    }
  };



  const selectedCountry = useMemo(() => {
    if (!selectedCountryId || !countries) return null;
    return countries.find((c) => c.id === selectedCountryId);
  }, [selectedCountryId, countries]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f8f9fa", "#e9ecef"]}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Home Country and Currency</Text>
          <Text style={styles.subtitle}>
            Please select the country you are from. This is mandatory, as all your future expenses will be converted to the home currency for your statistics.
          </Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setIsModalOpen(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.country}` : "Select Home Country"}
            </Text>
          </TouchableOpacity>

          <CountrySearchModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={(country) => {
              setSelectedCountryId(country.id);
              setIsModalOpen(false);
            }}
          />

          {selectedCountryId && (
            <View style={styles.selectedRow}>
              <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
              <Text style={styles.selectedText}>
                Selected: {selectedCountry?.country} ({selectedCountry?.currency})
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (!selectedCountryId || updatingHomeCountry) && styles.buttonDisabled
            ]}
            onPress={onSave}
            disabled={!selectedCountryId || updatingHomeCountry}
          >
            {updatingHomeCountry ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, (!selectedCountryId) && styles.buttonTextDisabled]}>
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#565BD7",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  selectButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EEFF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  selectButtonText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
  },
  selectedText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#166534",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#565BD7",
    width: "100%",
    height: 56,
    borderRadius: 16,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#e2e8f0",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextDisabled: {
    color: "#94a3b8",
  },
});
