import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Actionsheet, Button, useDisclose } from "native-base";
import useCountries from "../../../db/hooks/useCountries";
import useHomeCountry, {
  useHomeCountryMutation,
} from "../../../db/hooks/useHomeCountry";
import YellowButton from "../YellowButton";
import CustomDropdown from "../CustomDropdown";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeCurrencyButton() {
  const { data: countries } = useCountries();
  const { data: homeCountry } = useHomeCountry();
  const {
    mutate: setHomeCountry,
    isLoading: updatingHomeCountry,
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

  const dropdownItems = useMemo(() => {
    return (countries || []).map(({ country, currency, id }) => ({
      id,
      label: `${country}, ${currency}`,
      value: id,
    }));
  }, [countries]);

  const selectedCountry = countries?.find(
    ({ id }) => id === (selectedCountryId || homeCountry?.id)
  );

  return (
    <>
      <View>
        <Button style={styles.buttonStyle} onPress={onButtonPress}>
          <Text style={styles.buttonText}>Home Country</Text>
        </Button>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content style={styles.actionsheetContent}>
            <Actionsheet.Item style={styles.actionsheetItem}>
              <View style={styles.container}>
                <Text style={styles.text}>Home Currency</Text>
                <View style={styles.dropdownWrapper}>
                  <CustomDropdown
                    items={dropdownItems}
                    selectedValue={selectedCountryId || homeCountry?.id}
                    onValueChange={(value) => setSelectedCountryId(value)}
                    placeholder="Choose Home Currency"
                    leftIcon={<Text style={styles.iconText}>{selectedCountry?.flag || "💰"}</Text>}
                    width={SCREEN_WIDTH * 0.85}
                    showIcons={false}
                  />
                </View>
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
    height: 50,
    width: 330,
    backgroundColor: "#F3F6FF",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: "#C3C5F3",
  },
  container: {
    alignItems: "center",
    width: 350,
    backgroundColor: "transparent",
    paddingVertical: 20,
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
  iconText: {
    fontSize: 18,
  },
  text: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 21,
    color: "#494EBF",
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
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 21,
    color: "#494EBF",
  },
});
