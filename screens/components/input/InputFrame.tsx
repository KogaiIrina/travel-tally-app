import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  TouchableOpacity,
  Platform,
  InteractionManager
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

// Memoized TextInput component to prevent unnecessary re-renders
const AmountInput = memo(({ amount, changeAmount }: { amount: string, changeAmount: (text: string) => void }) => {
  // Calculate font size directly without state
  const fontSize = amount.length > 6 ? 40 : 56;
  
  // Create a local state copy for iOS to prevent UI lag
  const [localValue, setLocalValue] = useState(amount);
  
  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(amount);
  }, [amount]);
  
  // Handle text changes with optimized rendering for iOS
  const handleTextChange = useCallback((text: string) => {
    if (Platform.OS === 'ios') {
      // Update local value immediately for responsive UI
      setLocalValue(text);
      // Defer the actual change to parent component
      InteractionManager.runAfterInteractions(() => {
        changeAmount(text);
      });
    } else {
      // On Android, directly update the parent
      changeAmount(text);
    }
  }, [changeAmount]);
  
  // Use a more performant approach for the TextInput with iOS-specific optimizations
  return (
    <TextInput
      style={[
        styles.newText, 
        { fontSize },
        Platform.OS === 'ios' ? styles.iosTextInput : {}
      ]}
      keyboardType="numeric"
      returnKeyType="done"
      placeholder={"0.00"}
      onChangeText={handleTextChange}
      value={Platform.OS === 'ios' ? localValue : amount}
      maxLength={10}
      caretHidden={false}
      autoComplete="off"
      autoCorrect={false}
      spellCheck={false}
      autoCapitalize="none"
      underlineColorAndroid="transparent"
      // iOS-specific props to improve performance
      enablesReturnKeyAutomatically={false}
      contextMenuHidden={true}
      // Disable auto-adjustments that can cause re-renders
      disableFullscreenUI={true}
    />
  );
}, (prevProps, nextProps) => {
  // Only re-render if the amount actually changed
  return prevProps.amount === nextProps.amount;
});

export function NewInputView({
  onChange,
  setDate,
  changeAmount,
  amount,
}: InputViewProps) {
  const [showPicker, setShowPicker] = React.useState(false);
  const [internalPickerDate, setInternalPickerDate] = React.useState(new Date());
  const [isPromoOpened, setIsPromoOpened] = React.useState(false);

  // Process amount changes with useCallback to prevent unnecessary re-renders
  const handleAmountChange = useCallback((text: string) => {
    // Directly call changeAmount without any processing to minimize work
    changeAmount(text);
    
    // Debounce the onChange call to prevent excessive updates
    // Only process the amount change for the parent component after a small delay
    const parsedAmount = Number(text.replace(/[,|-|*]/g, "."));
    requestAnimationFrame(() => {
      onChange(parsedAmount);
    });
  }, [onChange, changeAmount]);

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
            <AmountInput amount={amount} changeAmount={handleAmountChange} />
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
    minHeight: 64,
    flex: 1,
    textAlign: 'left',
    fontWeight: '400',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
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
  iosTextInput: {
    // iOS-specific styles to improve performance
    opacity: 0.99, // Trick to force hardware acceleration
    transform: [{ translateX: 0 }], // Force GPU rendering
    backfaceVisibility: 'hidden', // Reduce composite layers
    borderWidth: 0, // Remove border which can cause repaints
  },
});
