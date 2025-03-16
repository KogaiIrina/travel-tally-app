import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { 
  Alert, 
  Dimensions, 
  StyleSheet, 
  Pressable, 
  View, 
  Platform, 
  Keyboard, 
  ScrollView,
  KeyboardAvoidingView,
  InteractionManager
} from "react-native";
import { Actionsheet, Box, useDisclose } from "native-base";
import PlusIcon from "./expenses/icons/plus";
import ExpensesContainer from "./expenses/ExpensesContainer";
import CountrySelector from "./selector/CountrySelector";
import BigBlueButton from "./BigBlueButton";
import { NewInputView } from "./input/InputFrame";
import { useAddExpense } from "../../db/hooks/useExpenses";
import useHomeCountry from "../../db/hooks/useHomeCountry";
import { useSetting } from "../../utils/settings";

interface BlueButtonProps {
  hideUI?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

// Memoized expense form to prevent unnecessary re-renders
const ExpenseForm = memo(({ 
  sum, 
  handleAmountChange, 
  handleAmountOfSpendingChange, 
  setDate, 
  setExpenseType, 
  activeExpenseTypeKey, 
  setActiveExpenseTypeKey 
}: { 
  sum: string;
  handleAmountChange: (value: string) => void;
  handleAmountOfSpendingChange: (value: number) => void;
  setDate: (date: Date) => void;
  setExpenseType: (type: string) => void;
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

  // Reset expense type when sum changes to empty (form reset)
  useEffect(() => {
    if (sum === "" && activeExpenseTypeKey) {
      setActiveExpenseTypeKey("");
      setExpenseType("");
    }
  }, [sum, activeExpenseTypeKey, setActiveExpenseTypeKey, setExpenseType]);

  return (
    <>
      {InputComponent}
      <View style={{ flex: 1 }}>
        <CountrySelector />
        <Box marginTop={5} flex={1}>
          <ExpensesContainer
            setExpenseType={setExpenseType}
            activeExpenseTypeKey={activeExpenseTypeKey}
            setActiveExpenseTypeKey={setActiveExpenseTypeKey}
          />
        </Box>
      </View>
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  // Only re-render if these specific props changed
  // We need to check all props that affect the rendering
  return (
    prevProps.sum === nextProps.sum &&
    prevProps.activeExpenseTypeKey === nextProps.activeExpenseTypeKey &&
    // If sum is empty, we're in a reset state, so always re-render
    prevProps.sum !== ""
  );
});

const BlueButton: React.FC<BlueButtonProps> = ({ 
  hideUI = false,
  isOpen: externalIsOpen,
  onClose: externalOnClose
}) => {
  const [amountOfSpending, setAmountOfSpending] = useState<number>();
  const [date, setDate] = useState(new Date());
  const [sum, changeSum] = useState("");
  const [expenseType, setExpenseType] = useState<string>();
  const { data: homeCountry } = useHomeCountry();
  const [currentCountry] = useSetting<number>("selectedCountry");
  const [selectedCurrency] = useSetting<string>("selectedCurrency");
  const { mutate: addExpense, isLoading: isSavingExpense } = useAddExpense();
  const [activeExpenseTypeKey, setActiveExpenseTypeKey] = useState<string>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const isoDate = date.toISOString().split("T")[0];

  // Use internal state if external props are not provided
  const { isOpen: internalIsOpen, onOpen: internalOnOpen, onClose: internalOnClose } = useDisclose();
  
  // Determine which values to use
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
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

  // Reset all form values when opening the form
  const onOpen = useCallback(() => {
    // Reset all form values to ensure we don't remember previous expense data
    setAmountOfSpending(undefined);
    changeSum("");
    setExpenseType(undefined);
    setActiveExpenseTypeKey("");
    setDate(new Date());
    
    // Then open the form
    internalOnOpen();
  }, [internalOnOpen]);

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

  // Strictly check if all required fields are filled
  const isActive = useMemo(() => {
    return Boolean(
      homeCountry &&
      expenseType &&
      currentCountry &&
      amountOfSpending &&
      amountOfSpending > 0 &&
      sum.trim() !== "" &&
      !isSavingExpense
    );
  }, [homeCountry, expenseType, currentCountry, amountOfSpending, sum, isSavingExpense]);

  async function saveTransaction() {
    if (isSavingExpense) return;
    
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

    const convertRate = async (
      selectedCurrency: string | undefined,
      homeCurrency: string
    ) => {
      const homeCurrencyLowerCase = homeCurrency?.toLowerCase();
      const selectedCurrencyLowerCase = selectedCurrency?.toLowerCase();
      let currentRateInfo;

      currentRateInfo = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${isoDate}/v1/currencies/${selectedCurrencyLowerCase}.json`
      );

      if (!currentRateInfo.ok) {
        const fallbackUrl = `https://${isoDate}.currency-api.pages.dev/v1/currencies/${selectedCurrencyLowerCase}.json`;
        currentRateInfo = await fetch(fallbackUrl);
      }

      if (!currentRateInfo.ok) {
        throw new Error("Both primary and fallback fetch failed");
      }

      const currentRate = await currentRateInfo.json();
      if (selectedCurrencyLowerCase && homeCurrencyLowerCase) {
        return currentRate[selectedCurrencyLowerCase][homeCurrencyLowerCase];
      }
      return undefined;
    };

    const homeCurrencyValue = await convertRate(
      selectedCurrency,
      homeCountry.currency
    );

    addExpense(
      {
        amount: Number(amountOfSpending) * 100,
        amount_in_home_currency:
          Number(amountOfSpending) * homeCurrencyValue * 100,
        home_currency: homeCountry.currency,
        selected_currency: selectedCurrency,
        country_id: Number(currentCountry),
        expense_types: expenseType,
        date: date,
      },
      {
        onSuccess: () => {
          // Reset all form values after successful save
          setAmountOfSpending(undefined);
          changeSum("");
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

  const windowHeight = Dimensions.get("window").height;
  const marginTop = windowHeight * 0.1;

  return (
    <>
      {!hideUI && (
        <Pressable style={styles.button} onPress={onButtonPress}>
          <PlusIcon />
        </Pressable>
      )}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content maxHeight={"100%"} marginTop={marginTop}>
          <KeyboardAvoidingView 
            style={{ width: "100%", height: "100%" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          >
            <ScrollView 
              style={{ width: "100%" }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: keyboardVisible ? 20 : 80 }}
            >
              <ExpenseForm
                sum={sum}
                handleAmountChange={handleAmountChange}
                handleAmountOfSpendingChange={handleAmountOfSpendingChange}
                setDate={setDate}
                setExpenseType={setExpenseType}
                activeExpenseTypeKey={activeExpenseTypeKey}
                setActiveExpenseTypeKey={setActiveExpenseTypeKey}
              />
            </ScrollView>   
            {!keyboardVisible && (
              <Box marginY={5}>
                <BigBlueButton
                  onPress={saveTransaction}
                  isActive={isActive}
                  text="SAVE"
                />
              </Box>
            )}
          </KeyboardAvoidingView>
        </Actionsheet.Content>
      </Actionsheet>
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
});

export default BlueButton;
