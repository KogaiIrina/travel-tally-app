import React, { useMemo, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import useCountries from "../../../db/hooks/useCountries";
import { CountryType } from "../../../utils/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: CountryType) => void;
  title?: string;
}

export default function CountrySearchModal({ isOpen, onClose, onSelect, title = "Select Country" }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: countries } = useCountries();

  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.toLowerCase();
    return countries.filter((c) => c.country.toLowerCase().includes(q));
  }, [countries, searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  const handleSelect = (country: CountryType) => {
    setSearchQuery("");
    onSelect(country);
  };

  const renderCountryRow = ({ item }: { item: CountryType }) => {
    return (
      <Pressable
        style={styles.countryRow}
        onPress={() => handleSelect(item)}
      >
        <Text style={styles.countryFlag}>{item.flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={styles.countryName}>
            {item.country}
          </Text>
          <Text style={styles.countryCurrency}>{item.currency}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </Pressable>
    );
  };

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
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={{ width: 70 }} />
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
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
  searchSection: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 16,
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
});
