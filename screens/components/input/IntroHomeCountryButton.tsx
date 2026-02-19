import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Actionsheet, Button, useDisclose } from "native-base";
import useCountries from "../../../db/hooks/useCountries";
import {
  useHomeCountryMutation,
} from "../../../db/hooks/useHomeCountry";
import YellowButton from "../YellowButton";
import CustomDropdown from "../CustomDropdown";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function InputButton() {
  const { data: countries } = useCountries();
  const {
    mutate: setHomeCountry,
    isPending: updatingHomeCountry,
    isError: homeCountryUpdateFailed,
    isSuccess: homeCountryUpdated,
  } = useHomeCountryMutation();
  const [selectedCountryId, setSelectedCountryId] = useState<number>();

  const { isOpen, onOpen, onClose } = useDisclose();

  const onButtonPress = () => {
    setSelectedCountryId(undefined);
    onOpen();
  };

  const onSave = () => {
    if (countries && selectedCountryId !== undefined) {
      setHomeCountry(selectedCountryId);
    }
  };

  useEffect(() => {
    const homeCountryUpdateDone = homeCountryUpdateFailed || homeCountryUpdated;
    if (!homeCountryUpdateDone) {
      return;
    }
    // TODO(ira): if updated failed, display an error
    onClose();
  }, [homeCountryUpdateFailed, homeCountryUpdated]);

  // Format countries for the dropdown
  const dropdownItems = useMemo(() => {
    if (!countries) return [];
    return countries.map(country => ({
      id: country.id,
      value: country.id,
      label: `${country.country}, ${country.currency}`,
    }));
  }, [countries]);

  // Get the selected country name and currency
  const selectedCountry = useMemo(() => {
    if (!selectedCountryId || !countries) return null;
    return countries.find(c => c.id === selectedCountryId);
  }, [selectedCountryId, countries]);

  return (
    <>
      <View style={styles.wrapper}>
        <Text style={styles.mainText}>
          Hi 👋🏾 it's time to choose your home currency. Please select the
          currency into which you wish to convert all your expenses. You can
          skip this step for now and make the selection later in the settings.
          Please note that once chosen, you won't be able to change it later.
        </Text>
        <Button style={styles.buttonStyle} onPress={onButtonPress}>
          <Text style={styles.buttonText}>Home Country</Text>
        </Button>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content style={styles.actionsheetContent}>
            <Actionsheet.Item
              style={styles.actionsheetItem}
            >
              <View style={styles.container}>
                <Text style={styles.text}>Home Currency</Text>

                {/* Using our new CustomDropdown component */}
                <View style={styles.dropdownWrapper}>
                  <CustomDropdown
                    items={dropdownItems}
                    selectedValue={selectedCountryId}
                    onValueChange={(value) => setSelectedCountryId(value)}
                    placeholder="Choose Home Currency"
                    leftIcon={<Text style={styles.iconText}>{selectedCountry?.flag || "💰"}</Text>}
                    width={SCREEN_WIDTH * 0.85}
                    showIcons={false}
                  />
                </View>

                {/* Show the selected country */}
                {selectedCountryId && (
                  <Text style={styles.selectedText}>
                    Selected: {selectedCountry?.country || 'Unknown'}
                  </Text>
                )}

                <YellowButton
                  disabled={updatingHomeCountry}
                  onPress={onSave}
                  text="Save"
                />
              </View>
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#565BD7",
    width: 200,
    height: 55,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  container: {
    alignItems: "center",
    width: 350,
    paddingBottom: 20,
  },
  actionsheetContent: {
    width: "100%",
    alignItems: "center",
  },
  actionsheetItem: {
    backgroundColor: "transparent",
    width: "100%",
    alignItems: "center",
  },
  dropdownWrapper: {
    width: "100%",
    marginVertical: 20,
    alignItems: "center",
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  iconText: {
    fontSize: 18,
  },
  text: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 21,
    color: "#494EBF",
    marginBottom: 10,
  },
  mainText: {
    fontWeight: "600",
    fontSize: 21,
    lineHeight: 24,
    color: "#494EBF",
    width: 320,
    paddingBottom: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    lineHeight: 21,
  },
  wrapper: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#f7d253",
    alignItems: "center",
  },
  selectedText: {
    marginBottom: 15,
    color: "#494EBF",
    fontWeight: "600",
  },
});
