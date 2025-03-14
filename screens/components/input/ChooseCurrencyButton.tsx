import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Pressable, Text, View, Dimensions } from "react-native";
import DownArrowIcon from "../expenses/icons/down-arrow";
import { currencyList } from "../../../utils/currencyList";
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
        <DownArrowIcon />
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
    color: "#2C65E1",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#F1F5FF",
    height: 64,
    width: 117,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 25,
    justifyContent: "space-between",
    paddingRight: 15,
  },
  iconText: {
    fontSize: 18,
  },
});
