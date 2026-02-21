import React, { useState, useMemo } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  SafeAreaView,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import useCountries from "../../../db/hooks/useCountries";
import { useAddTrip } from "../../../db/hooks/useTrips";
import useHomeCountry from "../../../db/hooks/useHomeCountry";
import { Ionicons } from "@expo/vector-icons";
import { CountryType } from "../../../utils/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTripModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: countries } = useCountries();
  const { data: homeCountry } = useHomeCountry();
  const { mutate: addTrip, isPending } = useAddTrip();

  const selectedCountry = useMemo(
    () => countries?.find((c) => c.id === countryId),
    [countries, countryId]
  );

  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.toLowerCase();
    return countries.filter((c) => c.country.toLowerCase().includes(q));
  }, [countries, searchQuery]);

  const handleSave = () => {
    if (!name || !countryId || !homeCountry?.currency || !selectedCountry) {
      alert("Please fill in a trip name and select a country.");
      return;
    }

    addTrip(
      {
        name,
        country_id: countryId,
        base_currency: homeCountry.currency,
        target_currency: selectedCountry.currency,
      },
      {
        onSuccess: () => {
          setName("");
          setCountryId(undefined);
          setSearchQuery("");
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setName("");
    setCountryId(undefined);
    setSearchQuery("");
    onClose();
  };

  const renderCountryRow = ({ item }: { item: CountryType }) => {
    const isSelected = item.id === countryId;
    return (
      <Pressable
        style={[styles.countryRow, isSelected && styles.countryRowSelected]}
        onPress={() => setCountryId(item.id)}
      >
        <Text style={styles.countryFlag}>{item.flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={[styles.countryName, isSelected && styles.countryNameSelected]}>
            {item.country}
          </Text>
          <Text style={styles.countryCurrency}>{item.currency}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color="#4169E1" />
        )}
      </Pressable>
    );
  };

  const canSave = name.trim().length > 0 && countryId !== undefined;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#F7F8FA" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={handleClose} style={styles.headerButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>New Trip</Text>
            <View style={{ width: 70 }} />
          </View>

          {/* Trip Name */}
          <View style={styles.nameSection}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Trip name, e.g. Summer in Paris"
              placeholderTextColor="#B0B0B0"
              autoFocus={true}
              returnKeyType="next"
            />
          </View>

          {/* Country Selection */}
          <View style={styles.countrySection}>
            <Text style={styles.sectionLabel}>DESTINATION COUNTRY</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                placeholderTextColor="#B0B0B0"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#CCC" />
                </Pressable>
              )}
            </View>

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              renderItem={renderCountryRow}
              keyExtractor={(item) => item.id.toString()}
              style={styles.countryList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyText}>No countries found</Text>
                </View>
              }
            />
          </View>

          {/* Bottom save button */}
          <View style={styles.footer}>
            {selectedCountry && (
              <View style={styles.footerInfo}>
                <Text style={styles.footerLabel}>Currency</Text>
                <Text style={styles.footerValue}>
                  {selectedCountry.flag} {selectedCountry.currency}
                </Text>
              </View>
            )}
            <Pressable
              style={[
                styles.saveButton,
                (!canSave || isPending) && { opacity: 0.4 },
              ]}
              onPress={handleSave}
              disabled={!canSave || isPending}
            >
              <Text style={styles.saveButtonText}>
                {isPending ? "Creating..." : "Create Trip"}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  headerButton: {
    width: 70,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cancelText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  createButtonText: {
    fontSize: 16,
    color: "#4169E1",
    fontWeight: "700",
  },
  nameSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  nameInput: {
    fontSize: 17,
    color: "#1A1A1A",
    paddingVertical: 16,
  },
  countrySection: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 4,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    paddingVertical: 0,
  },
  countryList: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
  },
  countryRowSelected: {
    backgroundColor: "#F0F4FF",
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  countryNameSelected: {
    color: "#4169E1",
    fontWeight: "600",
  },
  countryCurrency: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  emptyList: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  footerValue: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4169E1",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
