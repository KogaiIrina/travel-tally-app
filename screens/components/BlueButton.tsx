import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
  Alert,
  StyleSheet,
  Pressable,
  View,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  InteractionManager,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDisclose } from "native-base";
import PlusIcon from "./expenses/icons/plus";
import ExpensesContainer from "./expenses/ExpensesContainer";
import BigBlueButton from "./BigBlueButton";
import { NewInputView } from "./input/InputFrame";
import { useAddExpense } from "../../db/hooks/useExpenses";
import useHomeCountry from "../../db/hooks/useHomeCountry";
import { useSetting } from "../../utils/settings";
import { useActiveTrip } from "../../db/hooks/useTrips";
import useExchangeRate from "../../db/hooks/useExchangeRate";

interface BlueButtonProps {
  hideUI?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  tripId?: number;
}

// Memoized expense form to prevent unnecessary re-renders
const ExpenseForm = memo(({
  sum,
  comment,
  handleAmountChange,
  handleAmountOfSpendingChange,
  setDate,
  setExpenseType,
  setComment,
  activeExpenseTypeKey,
  setActiveExpenseTypeKey
}: {
  sum: string;
  comment: string;
  handleAmountChange: (value: string) => void;
  handleAmountOfSpendingChange: (value: number) => void;
  setDate: (date: Date) => void;
  setExpenseType: (type: string) => void;
  setComment: (comment: string) => void;
  activeExpenseTypeKey?: string;
  setActiveExpenseTypeKey: (key: string) => void;
}) => {
  // Memoize the NewInputView to prevent unnecessary re-renders
  const InputComponent = useMemo(() => (
    <NewInputView
      onChange={handleAmountOfSpendingChange}
      setDate={setDate}
      amount={sum}
      changeAmount={handleAmountChange}
    />
  ), [sum, handleAmountChange, handleAmountOfSpendingChange, setDate]);

  // Form resets are handled explicitly in the parent BlueButton's onOpen handler.

  return (
    <>
      {InputComponent}
      <View style={{ flex: 1, paddingTop: 8 }}>
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#999', letterSpacing: 0.8 }}>OPTIONAL COMMENT</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>{comment.length}/45</Text>
          </View>
          <TextInput
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              padding: 12,
              fontSize: 16,
              color: '#1A1A1A',
            }}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            maxLength={45}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#999', letterSpacing: 0.8, marginBottom: 12 }}>CATEGORY</Text>
          <ExpensesContainer
            setExpenseType={setExpenseType}
            activeExpenseTypeKey={activeExpenseTypeKey}
            setActiveExpenseTypeKey={setActiveExpenseTypeKey}
          />
        </View>
      </View>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  // Only re-render if these specific props changed
  // We need to check all props that affect the rendering
  return (
    prevProps.sum === nextProps.sum &&
    prevProps.comment === nextProps.comment &&
    prevProps.activeExpenseTypeKey === nextProps.activeExpenseTypeKey &&
    // If sum is empty, we're in a reset state, so always re-render
    prevProps.sum !== ""
  );
});

const BlueButton: React.FC<BlueButtonProps> = ({
  hideUI = false,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  tripId
}) => {
  const [amountOfSpending, setAmountOfSpending] = useState<number>();
  const [date, setDate] = useState(new Date());
  const [sum, changeSum] = useState("");
  const [comment, setComment] = useState("");
  const [expenseType, setExpenseType] = useState<string>();
  const { data: homeCountry } = useHomeCountry();
  const [currentCountry, setCurrentCountry] = useSetting<number>("selectedCountry");
  const [selectedCurrency, setSelectedCurrency] = useSetting<string>("selectedCurrency");
  const { mutate: addExpense, isPending: isSavingExpense } = useAddExpense();
  const [activeExpenseTypeKey, setActiveExpenseTypeKey] = useState<string>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { data: activeTrip } = useActiveTrip();

  const isoDate = date.toISOString().split("T")[0];

  // Prefetch the exchange rate in the background while the user fills the form
  const { data: exchangeRate, isFetching: isFetchingRate } = useExchangeRate({
    selectedCurrency: selectedCurrency,
    homeCurrency: homeCountry?.currency,
    isoDate: isoDate,
  });

  // Use internal state if external props are not provided
  const { isOpen: internalIsOpen, onOpen: internalOnOpen, onClose: internalOnClose } = useDisclose();

  // Determine which values to use
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Track if we were previously open to detect open events
  const [wasOpen, setWasOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !wasOpen) {
      // Form was just opened (either internally or externally)
      // Reset all form values to ensure we don't remember previous expense data
      setAmountOfSpending(undefined);
      changeSum("");
      setComment("");
      setExpenseType(undefined);
      setActiveExpenseTypeKey("");
      setDate(new Date());

      // Auto-fill active trip config if available
      if (activeTrip) {
        if (setCurrentCountry) setCurrentCountry(activeTrip.country_id);
        if (setSelectedCurrency) setSelectedCurrency(activeTrip.target_currency);
      }
    }
    setWasOpen(isOpen);
  }, [isOpen, wasOpen, activeTrip, setCurrentCountry, setSelectedCurrency]);

  // Reset all form values when closing the form
  const onClose = useCallback(() => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      internalOnClose();
    }

    // Reset form state when closing
    setActiveExpenseTypeKey("");
  }, [externalOnClose, internalOnClose]);

  // Reset all form values when opening the form (Internal trigger)
  const onOpen = useCallback(() => {
    setAmountOfSpending(undefined);
    changeSum("");
    setComment("");
    setExpenseType(undefined);
    setActiveExpenseTypeKey("");
    setDate(new Date());

    if (activeTrip) {
      if (setCurrentCountry) setCurrentCountry(activeTrip.country_id);
      if (setSelectedCurrency) setSelectedCurrency(activeTrip.target_currency);
    }

    internalOnOpen();
  }, [internalOnOpen, activeTrip, setCurrentCountry, setSelectedCurrency]);

  // Optimized amount change handler with debounce for iOS
  const handleAmountChange = useCallback((value: string) => {
    // Only allow valid numeric input with at most one decimal point
    const sanitizedValue = value.replace(/[^0-9.,]/g, '').replace(/,/g, '.');

    // Ensure only one decimal point
    const parts = sanitizedValue.split('.');
    const finalValue = parts.length > 2
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : sanitizedValue;

    // Use InteractionManager to defer the state update on iOS
    if (Platform.OS === 'ios') {
      InteractionManager.runAfterInteractions(() => {
        changeSum(finalValue);
      });
    } else {
      changeSum(finalValue);
    }
  }, []);

  // Handle amount of spending update with debounce for iOS
  const handleAmountOfSpendingChange = useCallback((value: number) => {
    // Use requestAnimationFrame to defer the state update on iOS
    if (Platform.OS === 'ios') {
      requestAnimationFrame(() => {
        setAmountOfSpending(value);
      });
    } else {
      setAmountOfSpending(value);
    }
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Dismiss keyboard when closing the actionsheet
  useEffect(() => {
    if (!isOpen) {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  // Strictly check if all required fields are filled and the exchange rate is ready
  const isActive = useMemo(() => {
    return Boolean(
      homeCountry &&
      expenseType &&
      currentCountry &&
      amountOfSpending &&
      amountOfSpending > 0 &&
      sum.trim() !== "" &&
      !isSavingExpense &&
      !isFetchingRate &&
      exchangeRate !== undefined
    );
  }, [homeCountry, expenseType, currentCountry, amountOfSpending, sum, isSavingExpense, isFetchingRate, exchangeRate]);

  async function saveTransaction() {
    if (isSavingExpense || isFetchingRate || exchangeRate === undefined) return;

    // Double-check all required fields are filled
    if (!homeCountry)
      return Alert.alert("you have to choose home currency in the settings");
    if (!expenseType)
      return Alert.alert("you have to choose expenses");
    if (!currentCountry)
      return Alert.alert("you have to choose current country");
    if (!amountOfSpending || amountOfSpending <= 0)
      return Alert.alert("you have to choose amount of spending");
    if (!selectedCurrency)
      return Alert.alert("you have to choose currency");

    const homeCurrencyValue = exchangeRate;

    addExpense(
      {
        amount: Number(amountOfSpending) * 100,
        amount_in_home_currency:
          Number(amountOfSpending) * homeCurrencyValue * 100,
        home_currency: homeCountry.currency,
        selected_currency: String(selectedCurrency),
        country_id: Number(currentCountry),
        expense_types: expenseType,
        comment: comment.trim() !== "" ? comment.trim() : undefined,
        date: date,
        trip_id: tripId || activeTrip?.id || undefined,
      },
      {
        onSuccess: () => {
          // Reset all form values after successful save
          setAmountOfSpending(undefined);
          changeSum("");
          setComment("");
          setExpenseType("");
          setActiveExpenseTypeKey("");
          setDate(new Date());
          onClose();
        },
        onError: () => {
          Alert.alert("something went wrong");
        },
      }
    );
  }

  const onButtonPress = () => {
    onOpen();
  };

  return (
    <>
      {!hideUI && (
        <Pressable style={styles.button} onPress={onButtonPress}>
          <PlusIcon />
        </Pressable>
      )}
      <Modal visible={isOpen} animationType="slide" transparent={false} onRequestClose={onClose}>
        <SafeAreaView style={styles.modalSafeArea}>
          {/* Header: drag handle centered, close button right-aligned */}
          <View style={styles.modalHeader}>
            <View style={{ width: 32 }} />
            <View style={styles.dragHandle} />
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Ionicons name="close" size={16} color="#666" />
            </Pressable>
          </View>

          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ paddingHorizontal: 16, paddingTop: 20, flex: 1 }}>
              <ExpenseForm
                sum={sum}
                comment={comment}
                handleAmountChange={handleAmountChange}
                handleAmountOfSpendingChange={handleAmountOfSpendingChange}
                setDate={setDate}
                setExpenseType={setExpenseType}
                setComment={setComment}
                activeExpenseTypeKey={activeExpenseTypeKey}
                setActiveExpenseTypeKey={setActiveExpenseTypeKey}
              />
            </View>

            {!keyboardVisible && (
              <View style={styles.saveButtonContainer}>
                <BigBlueButton
                  onPress={saveTransaction}
                  isActive={isActive}
                  text="SAVE"
                />
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2C65E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    width: 64,
    height: 64,
    borderRadius: 40,
    alignSelf: "center",
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F7F8FA",
  },
  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D0D0D0",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8E8ED",
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default BlueButton;
