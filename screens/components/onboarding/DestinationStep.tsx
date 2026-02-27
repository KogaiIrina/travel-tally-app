import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet, Text, View, Animated, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity, ActivityIndicator } from "react-native";
import useCountries from "../../../db/hooks/useCountries";
import { useAddTrip } from "../../../db/hooks/useTrips";
import useHomeCountry from "../../../db/hooks/useHomeCountry";
import CountrySearchModal from "../selector/CountrySearchModal";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onComplete: () => void;
}

export default function DestinationStep({ onComplete }: Props) {
  const { data: countries } = useCountries();
  const { data: homeCountry } = useHomeCountry();
  const { mutate: addTrip, isPending } = useAddTrip();

  const [name, setName] = useState("");
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

  const selectedCountry = useMemo(() => {
    if (!selectedCountryId || !countries) return null;
    return countries.find((c) => c.id === selectedCountryId);
  }, [selectedCountryId, countries]);

  const onSave = () => {
    if (!name.trim() || !selectedCountryId || !homeCountry?.currency || !selectedCountry) {
      return;
    }

    addTrip(
      {
        name: name.trim(),
        country_id: selectedCountryId,
        base_currency: homeCountry.currency,
        target_currency: selectedCountry.currency,
      },
      {
        onSuccess: () => {
          onComplete();
        },
      }
    );
  };

  const isFormValid = name.trim().length > 0 && selectedCountryId !== undefined;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Text style={styles.title}>Your First Destination</Text>
          <Text style={styles.subtitle}>
            Where are you heading to? Let's setup your first trip to start tracking expenses.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Trip Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Summer in Paris"
            placeholderTextColor="#B0B0B0"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <Text style={styles.label}>Destination Country</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setIsModalOpen(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.country}` : "Select Country"}
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
                Currency: {selectedCountry?.currency}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid || isPending) && styles.buttonDisabled
            ]}
            onPress={onSave}
            disabled={!isFormValid || isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, (!isFormValid) && styles.buttonTextDisabled]}>
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 80,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EEFF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 20,
    textAlign: "center",
  },
  selectButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EEFF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
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
    textAlign: "center",
  },
  buttonTextDisabled: {
    color: "#94a3b8",
  },
});
