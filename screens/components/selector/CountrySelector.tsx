import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import useCountries from "../../../db/hooks/useCountries";
import { useSetting } from "../../../utils/settings";
import CustomDropdown from "../CustomDropdown";

export default function CountrySelector() {
  const { data: countries } = useCountries();
  const [currentCountryId, setCurrentCountryId] =
    useSetting<number>("selectedCountry");

  const dropdownItems = useMemo(
    () =>
      (countries || []).map(({ country, id }) => ({
        id,
        label: `${country}`,
        value: id,
      })),
    [countries]
  );

  const selectedCountry = countries?.find(
    ({ id }) => id === Number(currentCountryId)
  );

  return (
    <View style={styles.container}>
      <CustomDropdown
        items={dropdownItems}
        selectedValue={currentCountryId}
        onValueChange={(value) => setCurrentCountryId(value)}
        placeholder="Choose country"
        leftIcon={<Text style={styles.iconText}>{selectedCountry?.flag || "🧭"}</Text>}
        width={335}
        showIcons={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 335,
    alignSelf: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 18,
  }
});
