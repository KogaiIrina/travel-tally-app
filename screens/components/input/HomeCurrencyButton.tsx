import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Modal, TouchableWithoutFeedback, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import { useDisclose } from "../../../utils/useDisclose";
import useCountries from "../../../db/hooks/useCountries";
import useHomeCountry, {
  useHomeCountryMutation,
} from "../../../db/hooks/useHomeCountry";
import YellowButton from "../BlueMediumButton";
import CustomDropdown from "../CustomDropdown";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeCurrencyButton() {
  const { data: countries } = useCountries();
  const { data: homeCountry } = useHomeCountry();
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
        <TouchableOpacity style={styles.buttonStyle} onPress={onButtonPress}>
          <Text style={styles.buttonText}>Home Country</Text>
        </TouchableOpacity>
        <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.bottomSheet}>
            <SafeAreaView>
              <View style={styles.dragHandle} />
              <View style={styles.actionsheetItem}>
                <View style={styles.contentContainer}>
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
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    height: 56,
    width: "100%",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
  },
  contentContainer: {
    alignItems: "center",
    width: 350,
    backgroundColor: "transparent",
    paddingVertical: 20,
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
    fontWeight: "700",
    fontSize: 18,
    color: "#1A1A1A",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "90%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#D0D0D0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
});
