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
import Purchase from "./Purchase";
import { useSubscriptionStatus } from "../../../utils/useSubscriptionStatus";
import ProFeature from "../ProFeature";
import { Ionicons } from "@expo/vector-icons";

interface InputViewProps {
  onChange: (money: number) => void;
  changeAmount: (amount: string) => void;
  setDate: (date: Date) => void;
  amount: string;
}

// Memoized TextInput component to prevent unnecessary re-renders
const AmountInput = memo(({ amount, changeAmount }: { amount: string, changeAmount: (text: string) => void }) => {
  // Calculate font size directly without state
  const fontSize = amount.length > 6 ? 36 : 48;

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

  return (
    <TextInput
      style={[
        styles.amountInput,
        { fontSize },
        Platform.OS === 'ios' ? styles.iosTextInput : {}
      ]}
      keyboardType="numeric"
      returnKeyType="done"
      placeholder={"0.00"}
      placeholderTextColor="#C0C0C0"
      onChangeText={handleTextChange}
      value={Platform.OS === 'ios' ? localValue : amount}
      maxLength={10}
      caretHidden={false}
      autoComplete="off"
      autoCorrect={false}
      spellCheck={false}
      autoCapitalize="none"
      underlineColorAndroid="transparent"
      enablesReturnKeyAutomatically={false}
      contextMenuHidden={true}
      disableFullscreenUI={true}
    />
  );
}, (prevProps, nextProps) => {
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
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  // Use subscription status at top level (not inside conditional function)
  const { hasActiveSubscription } = useSubscriptionStatus();
  const hasProAccess = Platform.OS === 'android' || hasActiveSubscription;

  // Process amount changes with useCallback to prevent unnecessary re-renders
  const handleAmountChange = useCallback((text: string) => {
    changeAmount(text);
    const parsedAmount = Number(text.replace(/[,|-|*]/g, "."));
    requestAnimationFrame(() => {
      onChange(parsedAmount);
    });
  }, [onChange, changeAmount]);

  const handleDatePress = () => {
    if (hasProAccess) {
      // PRO user or Android: open the date picker
      setShowPicker(true);
    } else {
      // Non-PRO on iOS: show the paywall
      setIsPromoOpened(true);
    }
  };

  const handleSetDate = () => {
    setDate(internalPickerDate);
    setSelectedDate(internalPickerDate);
    setInternalPickerDate(new Date());
    setShowPicker(false);
  };

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Today';

  return (
    <View style={styles.inputArea}>
      {/* Date chip - top right */}
      <View style={styles.dateRow}>
        <ProFeature
          onProBadgePress={handleDatePress}
          badgeOffset={{ x: -5, y: -8 }}
        >
          <Pressable
            style={styles.dateChip}
            onPress={handleDatePress}
          >
            <Ionicons name="calendar-outline" size={14} color="#4169E1" />
            <Text style={styles.dateChipText}>{dateLabel}</Text>
          </Pressable>
        </ProFeature>
      </View>

      {/* Amount + Currency on same line */}
      <View style={styles.amountRow}>
        <AmountInput amount={amount} changeAmount={handleAmountChange} />
        <ChooseCurrencyButton />
      </View>

      {/* Date picker for PRO users (iOS) */}
      {Platform.OS === "ios" && hasProAccess && (
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
      )}

      {/* Date picker for Android */}
      {Platform.OS === "android" && (
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
                    setSelectedDate(date);
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
      )}

      {/* Paywall for iOS users (Purchase self-manages visibility via isPromoOpened) */}
      {Platform.OS === "ios" && (
        <Purchase
          isPromoOpened={isPromoOpened}
          setIsPromoOpened={setIsPromoOpened}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 2,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4169E1',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    color: '#1A1A1A',
    lineHeight: 56,
    minHeight: 56,
    flex: 1,
    textAlign: 'left',
    fontWeight: '600',
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  iosTextInput: {
    opacity: 0.99,
    transform: [{ translateX: 0 }],
    backfaceVisibility: 'hidden',
    borderWidth: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 22,
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
    alignItems: "center",
    width: "100%",
  },
  setButton: {
    backgroundColor: "#4169E1",
    borderRadius: 50,
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 14,
  },
});
