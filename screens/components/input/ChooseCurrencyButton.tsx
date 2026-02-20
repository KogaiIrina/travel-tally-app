import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Pressable, Text, View, } from "react-native";
import { currencyList } from "../../../utils/currencyList";
import { Ionicons } from "@expo/vector-icons";
import { useSetting } from "../../../utils/settings";
import useCountries from "../../../db/hooks/useCountries";
import CustomDropdown from "../CustomDropdown";

export default function ChooseCurrencyButton() {
  const [savedCurrency, setSavedCurrency] =
    useSetting<string>("selectedCurrency");
  const [savedCountry, setSavedCountry] = useSetting<string>("selectedCountry");
  const { data: countries } = useCountries();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const chosenCountryCurrency = useMemo(() => {
    return (
      countries?.find((country) => country.id === Number(savedCountry))
        ?.currency ?? ""
    );
  }, [countries, savedCountry]);

  const [chosenCurrency, setChosenCurrency] = useState<string>(
    savedCurrency || ""
  );

  useEffect(() => {
    if (savedCountry !== undefined && chosenCountryCurrency) {
      setChosenCurrency(chosenCountryCurrency);
      setSavedCurrency(chosenCountryCurrency);
    }
  }, [savedCountry, chosenCountryCurrency]);

  const currencyDropdownItems = useMemo(() => {
    return Object.keys(currencyList).map((key, index) => ({
      id: index,
      label: key,
      value: key,
    }));
  }, []);

  const handleButtonPress = () => {
    setIsDropdownOpen(true);
  };

  const handleValueChange = (value: string) => {
    setChosenCurrency(value);
    setSavedCurrency(value);
    setIsDropdownOpen(false);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={handleButtonPress}
      >
        <Text style={styles.currencySign}>{chosenCurrency || "💰"}</Text>
        <Ionicons name="chevron-down" size={16} color="#4169E1" />
      </Pressable>

      {/* Hidden dropdown that will be triggered by the button */}
      <View style={styles.hiddenDropdown}>
        <CustomDropdown
          items={currencyDropdownItems}
          selectedValue={chosenCurrency}
          onValueChange={handleValueChange}
          placeholder="Choose Currency"
          leftIcon={<Text style={styles.iconText}>💰</Text>}
          width={335}
          showIcons={false}
          isOpen={isDropdownOpen}
          onClose={handleDropdownClose}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
  },
  hiddenDropdown: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
    overflow: "hidden",
  },
  currencySign: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#F0F2F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
  },
  iconText: {
    fontSize: 18,
  },
});
