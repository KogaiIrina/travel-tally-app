import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Button, View } from "native-base";
import useCountries from "../../../db/hooks/useCountries";
import RNPickerSelect from "react-native-picker-select";
import { useSetting } from "../../../utils/settings";

export default function CountrySelector() {
  const { data: countries } = useCountries();
  const [currentCountryId, setCurrentCountryId] =
    useSetting<number>("selectedCountry");

  const countryList = useMemo(
    () =>
      (countries || []).map(({ country, id }) => ({
        label: `${country}`,
        value: id,
        key: id,
      })),
    [countries]
  );

  const selectedCountry = countries?.find(
    ({ id }) => id === Number(currentCountryId)
  );

  return (
    <View style={styles.selectorGroup}>
      <Button style={styles.button}>{selectedCountry?.flag || "🧭"}</Button>
      <View style={styles.selector}>
        <RNPickerSelect
          value={selectedCountry?.id}
          placeholder={{ label: "Choose country", value: null }}
          onValueChange={setCurrentCountryId}
          items={countryList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorGroup: {
    flexDirection: "row",
    alignSelf: "center",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#C3C5F3",
    width: 335,
  },
  button: {
    height: 48,
    width: 48,
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderColor: "#C3C5F3",
    borderStyle: "solid",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  selector: {
    alignItems: "center",
    justifyContent: "center",
    width: 270,
    borderRadius: 10,
    borderColor: "#B8B9BC",
    marginLeft: 10,
  },
});
