import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { Actionsheet, Box, Button, useDisclose } from "native-base";
import RNPickerSelect from "react-native-picker-select";
import DownArrowIcon from "../expenses/icons/down-arrow";
import { SmallWhiteButton, SmallYellowButton } from "../smallButton";
import { currencyList } from "../../../utils/currencyList";
import { useSetting } from "../../../utils/settings";
import useCountries from "../../../db/hooks/useCountries";

export default function ChooseCurrencyButton() {
  const [savedCurrency, setSavedCurrency] =
    useSetting<string>("selectedCurrency");
  const [savedCountry, setSavedCountry] = useSetting<string>("selectedCountry");
  const { data: countries } = useCountries();

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

  const newCurrencyList = useMemo(() => {
    return Object.keys(currencyList).map((key) => ({
      label: key,
      value: key,
      key: key,
    }));
  }, []);

  const { isOpen, onOpen, onClose } = useDisclose();

  const onButtonPress = () => {
    onOpen();
  };

  const internalOnSave = () => {
    setSavedCurrency(chosenCurrency);
    onClose();
  };

  return (
    <>
      <Pressable style={styles.button} onPress={onButtonPress}>
        <Text style={styles.currencySign}>{chosenCurrency || "💰"}</Text>
        <DownArrowIcon />
      </Pressable>
      <Actionsheet
        style={styles.container}
        isOpen={isOpen}
        onClose={onClose}
        hideDragIndicator
      >
        <Actionsheet.Content>
          <Box style={styles.header}>
            <Text style={styles.text}>Currency</Text>
          </Box>
          <View style={styles.selectorsBox}>
            <Actionsheet.Item style={{ backgroundColor: "transparent" }}>
              <View style={styles.selectorGroup}>
                <Button style={styles.selectorButton}>{"💰"}</Button>
                <View style={styles.selector}>
                  <RNPickerSelect
                    placeholder={{ label: "Choose Currency" }}
                    value={chosenCurrency}
                    onValueChange={(value) => setChosenCurrency(value)}
                    items={newCurrencyList}
                  />
                </View>
              </View>
            </Actionsheet.Item>
          </View>
          <View style={styles.buttonContainer}>
            <SmallYellowButton onPress={internalOnSave} text="Save" />
            <SmallWhiteButton onPress={onClose} text="Back" />
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    marginTop: -160,
  },
  container: {
    alignItems: "center",
    height: "100%",
    paddingTop: 20,
  },
  selectorGroup: {
    flexDirection: "row",
    alignSelf: "center",
    height: 60,
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#C3C5F3",
  },
  selectorsBox: {
    height: 220,
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
  },
  selectorButton: {
    height: "100%",
    width: "16%",
    backgroundColor: "#F3F6FF",
    borderColor: "#C3C5F3",
    borderWidth: 0.3,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  selector: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    width: "83%",
    height: "100%",
    borderRadius: 10,
    paddingLeft: 5,
    borderColor: "#C3C5F3",
  },
  text: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 21,
    color: "#494EBF",
  },
  icon: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  header: {
    justifyContent: "center",
    paddingTop: 20,
  },
});
