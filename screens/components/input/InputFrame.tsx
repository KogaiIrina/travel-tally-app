import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Modal, View } from "native-base";
import ChooseCurrencyButton from "./ChooseCurrencyButton";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Purchase, { openSubscriptionModal } from "./Purchase";
import { useSubscriptionStatus } from "../../../db/hooks/useSubscription";
import ProFeature from "../ProFeature";

interface InputViewProps {
  onChange: (money: number) => void;
  changeAmount: (amount: string) => void;
  setDate: (date: Date) => void;
  amount: string;
}

export function NewInputView({
  onChange,
  setDate,
  changeAmount,
  amount,
}: InputViewProps) {
  const [numberSize, setNumberSize] = useState<number>(56);
  const [showPicker, setShowPicker] = useState(false);

  // the picker needs its own date that won't be in-sync with the date that the user
  // actually picked
  const [internalPickerDate, setInternalPickerDate] = useState(new Date());
  const [isPromoOpened, setIsPromoOpened] = useState(false);

  const getModalOrPaywall = () => {
    if (Platform.OS === "ios") {
      const { data: subscriptionStatus } = useSubscriptionStatus();

      if (isPromoOpened && subscriptionStatus === false) {
        return (
          <Purchase
            isPromoOpened={isPromoOpened}
            setIsPromoOpened={setIsPromoOpened}
          />
        );
      } else if (isPromoOpened && subscriptionStatus === true) {
        return (
          <Modal
            isOpen={showPicker}
            onClose={() => setShowPicker(false)}
            style={styles.pickerModal}
          >
            <View style={styles.pickerView}>
              <RNDateTimePicker
                value={internalPickerDate}
                mode="date"
                is24Hour={true}
                maximumDate={new Date()}
                display="spinner"
                style={styles.picker}
                onChange={(event: DateTimePickerEvent, date?: Date) => {
                  if (date) {
                    setInternalPickerDate(date);
                  }
                }}
              />
              <TouchableOpacity
                onPress={handleSetDate}
                style={styles.setButton}
              >
                <Text style={styles.buttonText}>Set</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        );
      }
    } else if (Platform.OS === "android") {
      return (
        <Modal
          isOpen={showPicker}
          onClose={() => setShowPicker(false)}
          style={styles.pickerModal}
        >
          <View style={styles.pickerView}>
            <RNDateTimePicker
              value={internalPickerDate}
              mode="date"
              is24Hour={true}
              maximumDate={new Date()}
              display="spinner"
              style={styles.picker}
              onChange={(event: DateTimePickerEvent, date?: Date) => {
                if (date) {
                  if (event.type === "set") {
                    setDate(date);
                    setShowPicker(false);
                  } else {
                    setInternalPickerDate(date);
                  }
                }
                if (event.type === "dismissed") {
                  setShowPicker(false);
                }
              }}
            />
          </View>
        </Modal>
      );
    }
  };

  const handleSetDate = () => {
    setDate(internalPickerDate);
    setInternalPickerDate(new Date());
    setShowPicker(false);
  };
  
  const handleProBadgePress = () => {
    openSubscriptionModal();
  };
  
  useEffect(() => {
    onChange(Number(amount.replace(/[,|-|*]/g, ".")));
    setNumberSize(amount.length > 6 ? 40 : 56);
  }, [amount]);

  return (
    <View style={styles.InputArea}>
      <View>
        <View>
          <View style={styles.dateSection}>
            <Text style={styles.greyText}>ADD TODAY OR</Text>
            <ProFeature
              onProBadgePress={handleProBadgePress}
            >
              <Pressable
                onPress={() => {
                  setShowPicker(true);
                  setIsPromoOpened(true);
                }}
              >
                <Text style={styles.pressableText}>PICK A DATE</Text>
              </Pressable>
              {getModalOrPaywall()}
            </ProFeature>
          </View>
          <View style={styles.expensesBox}>
            <TextInput
              style={styles.newText && { fontSize: numberSize }}
              keyboardType="numeric"
              returnKeyType="done"
              placeholder={"0.00"}
              onChangeText={changeAmount}
              value={amount}
              maxLength={10}
            />
            <ChooseCurrencyButton />
          </View>
          <View style={styles.lineStyle} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 22,
  },
  currencySign: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "400",
    lineHeight: 70,
    paddingLeft: 0,
  },
  dateSection: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  inputGroup: {
    height: "85%",
    justifyContent: "flex-end",
    marginBottom: 25,
    marginHorizontal: 18,
  },
  input: {
    height: "50%",
    backgroundColor: "#565BD7",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressableText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    color: "#2C65E1",
  },
  picker: {
    width: "100%",
    backgroundColor: "white",
  },
  pickerModal: {
    display: "flex",
    flexDirection: "column",
  },
  pickerView: {
    backgroundColor: "white",
    width: "100%",
  },
  setButton: {
    backgroundColor: "#FFB547",
    borderRadius: 50,
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    fontWeight: "800",
    marginBottom: 14,
  },
  text: {
    fontSize: 35,
    color: "#FFFFFF",
    textAlign: "right",
    textAlignVertical: "bottom",
    alignSelf: "center",
  },
  InputArea: {
    marginLeft: 20,
    marginBottom: Platform.OS === 'ios' ? 0 : 15,
    height: 150,
    width: 340,
  },
  newText: {
    color: "#000000",
    lineHeight: 64,
  },
  greyText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    color: "#00000080",
    paddingRight: 5,
  },
  expensesBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "#B8B9BC",
  },
});
