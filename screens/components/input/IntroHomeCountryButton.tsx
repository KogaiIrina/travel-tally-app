import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Actionsheet, Button, useDisclose } from "native-base";
import useCountries from "../../../db/hooks/useCountries";
import useHomeCountry, {
  useHomeCountryMutation,
} from "../../../db/hooks/useHomeCountry";
import RNPickerSelect from "react-native-picker-select";
import YellowButton from "../YellowButton";

export default function InputButton() {
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

  const currencyList = useMemo(() => {
    return (countries || []).map(({ country, currency, id }) => ({
      label: `${country}, ${currency}`,
      value: id,
      key: id,
    }));
  }, [countries]);

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
          <Actionsheet.Content>
            <Actionsheet.Item
              style={{ backgroundColor: "transparent", alignItems: "center" }}
            >
              <View style={styles.container}>
                <Text style={styles.text}>Home Currency</Text>
                <View style={styles.selectorGroup}>
                  <Button style={styles.button}>{"💰"}</Button>
                  <View style={styles.selector}>
                    <RNPickerSelect
                      placeholder={{ label: "Choose Home Currency" }}
                      onValueChange={setSelectedCountryId}
                      value={selectedCountryId || homeCountry?.id}
                      items={currencyList}
                    />
                  </View>
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
    height: 200,
    width: 350,
  },
  selectorGroup: {
    flexDirection: "row",
    alignSelf: "center",
    height: "25%",
    width: "100%",
    marginTop: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#C3C5F3",
  },
  button: {
    height: "100%",
    width: 56,
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
    width: "81%",
    borderRadius: 10,
    borderColor: "transparent",
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
});
