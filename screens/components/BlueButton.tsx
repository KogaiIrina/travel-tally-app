import React, { useState } from "react";
import { Alert, Dimensions, StyleSheet, Pressable, View } from "react-native";
import { Actionsheet, Box, useDisclose } from "native-base";
import PlusIcon from "./expenses/icons/plus";
import ExpensesContainer from "./expenses/ExpensesContainer";
import CountrySelector from "./selector/CountrySelector";
import BigBlueButton from "./BigBlueButton";
import { NewInputView } from "./input/InputFrame";
import { useAddExpense } from "../../db/hooks/useExpenses";
import useHomeCountry from "../../db/hooks/useHomeCountry";
import { useSetting } from "../../utils/settings";

export default function BlueButton() {
  const [amountOfSpending, setAmountOfSpending] = useState<number>();
  const [date, setDate] = useState(new Date());
  const [sum, changeSum] = useState("");
  const [expenseType, setExpenseType] = useState<string>();
  const { data: homeCountry } = useHomeCountry();
  const [currentCountry] = useSetting<number>("selectedCountry");
  const [selectedCurrency] = useSetting<string>("selectedCurrency");
  const { mutate: addExpense, isLoading: isSavingExpense } = useAddExpense();
  const [activeExpenseTypeKey, setActiveExpenseTypeKey] = useState<string>();

  const isoDate = date.toISOString().split("T")[0];

  const { isOpen, onOpen, onClose } = useDisclose();

  let isActive =
    homeCountry &&
    expenseType &&
    currentCountry &&
    amountOfSpending &&
    !isSavingExpense
      ? true
      : false;

  async function saveTransaction() {
    if (isSavingExpense) return;
    if (!homeCountry)
      return Alert.alert("you have to choose home currency in the settings");
    if (!expenseType) return Alert.alert("you have to choose expenses");
    if (!currentCountry)
      return Alert.alert("you have to choose current country");
    if (!amountOfSpending)
      return Alert.alert("you have to choose amount of spending");
    if (!selectedCurrency) return Alert.alert("you have to choose currency");

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
          changeSum("");
        },
        onError: () => {
          Alert.alert("something went wrong");
        },
      }
    );
    setActiveExpenseTypeKey("");
    onClose();
  }

  const onButtonPress = () => {
    onOpen();
  };

  const windowHeight = Dimensions.get("window").height;
  const marginTop = windowHeight * 0.1;

  return (
    <>
      <Pressable style={styles.button} onPress={onButtonPress}>
        <PlusIcon />
      </Pressable>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content maxHeight={"90%"} marginTop={marginTop}>
          <Box>
            <NewInputView
              onChange={setAmountOfSpending}
              setDate={setDate}
              amount={sum}
              changeAmount={changeSum}
            />
            <View style={{ flex: 1 }}>
              <CountrySelector />
              <Box marginTop={5} flex={1}>
                <ExpensesContainer
                  setExpenseType={setExpenseType}
                  activeExpenseTypeKey={activeExpenseTypeKey}
                  setActiveExpenseTypeKey={setActiveExpenseTypeKey}
                />
              </Box>
              <Box marginY={5}>
                <BigBlueButton
                  onPress={saveTransaction}
                  isActive={isActive}
                  text="SAVE"
                />
              </Box>
            </View>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2C65E1",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
    width: 64,
    height: 64,
    borderRadius: 40,
    padding: 8,
  },
});
