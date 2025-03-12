import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { Actionsheet, Box, Button, IconButton, useDisclose } from "native-base";
import useCountries from "../../../db/hooks/useCountries";
import FilterIcon from "./icons/filter";
import CalendarIcon from "./icons/calendar";
import ExpensesCategoryIcon from "./icons/expenses-type";
import { expensesArray } from "../../../utils/expensesList";
import { SmallWhiteButton, SmallYellowButton } from "../smallButton";
import { UseExpensesFilter } from "../../../db/hooks/useExpenses";
import useMonths from "../../../db/hooks/useMonths";
import { BetterPickerSelect } from "../BetterPickerSelect";

interface FilterButtonProps {
  onSave: (expenseFilter: UseExpensesFilter) => void;
  expensesFilter: UseExpensesFilter;
}

export default function ExpensesFilterButton({
  onSave,
  expensesFilter,
}: FilterButtonProps) {
  const { data: countries } = useCountries();
  const { data: months } = useMonths();

  const [selectedCountryId, setSelectedCountryId] = useState<
    number | undefined
  >(
    expensesFilter.paymentCountryId
      ? expensesFilter.paymentCountryId
      : undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    expensesFilter?.category || ""
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    expensesFilter.monthYear ? expensesFilter.monthYear : ""
  );

  useEffect(() => {
    setSelectedCountryId(
      expensesFilter.paymentCountryId
        ? expensesFilter.paymentCountryId
        : undefined
    );
    setSelectedCategory(expensesFilter?.category || "");
    setSelectedMonth(expensesFilter.monthYear || "");
  }, [expensesFilter]);

  const countryList = useMemo(
    () =>
      (countries || []).map(({ country, id }) => ({
        label: `${country}`,
        value: id.toString(),
        key: id,
      })),
    [countries]
  );

  const { isOpen, onOpen, onClose } = useDisclose();

  const onButtonPress = () => {
    onOpen();
  };

  const internalOnSave = () => {
    onSave({
      paymentCountryId: selectedCountryId,
      category: selectedCategory,
      monthYear: selectedMonth,
    });
    onClose();
  };

  const internalOnClose = () => {
    setSelectedCountryId(undefined);
    setSelectedCategory("");
    setSelectedMonth("");
    onSave({});
    onClose();
  };

  const monthsList = useMemo(() => {
    if (!months) {
      return [];
    }

    return months.map((text) => ({
      label: `${text}`,
      value: text,
      text: text,
    }));
  }, [months]);

  const expensesList = useMemo(() => {
    return (expensesArray || []).map(({ key, text }) => ({
      label: `${text}`,
      value: key,
      key: key,
    }));
  }, [expensesArray]);

  return (
    <>
      <Pressable style={styles.button} onPress={onButtonPress}>
        <FilterIcon />
      </Pressable>
      <Actionsheet
        style={styles.container}
        isOpen={isOpen}
        onClose={onClose}
        hideDragIndicator
      >
        <Actionsheet.Content>
          <Box style={styles.header}>
            <Text style={styles.text}>Filter</Text>
          </Box>
          <View style={styles.selectorsBox}>
            <Actionsheet.Item style={{ backgroundColor: "transparent" }}>
              <View style={styles.selectorGroup}>
                <Button style={styles.selectorButton}>{"🧭"}</Button>
                <View style={styles.selector}>
                  <BetterPickerSelect
                    placeholder={{
                      label: "Choose Country",
                      value: "no-country",
                    }}
                    value={
                      selectedCountryId
                        ? selectedCountryId.toString()
                        : "no-country"
                    }
                    onValueChange={(value) =>
                      setSelectedCountryId(
                        value === "no-country" ? undefined : Number(value)
                      )
                    }
                    items={countryList}
                  />
                </View>
              </View>
            </Actionsheet.Item>
            <Actionsheet.Item style={{ backgroundColor: "transparent" }}>
              <View style={styles.selectorGroup}>
                <IconButton style={styles.selectorButton}>
                  <ExpensesCategoryIcon />
                </IconButton>
                <View style={styles.selector}>
                  <BetterPickerSelect
                    placeholder={{
                      label: "Choose Category",
                      value: "no-category",
                    }}
                    onValueChange={(value) =>
                      setSelectedCategory(value === "no-category" ? "" : value)
                    }
                    value={selectedCategory}
                    items={expensesList}
                  />
                </View>
              </View>
            </Actionsheet.Item>
            <Actionsheet.Item style={{ backgroundColor: "transparent" }}>
              <View style={styles.selectorGroup}>
                <IconButton style={styles.selectorButton}>
                  <CalendarIcon />
                </IconButton>
                <View style={styles.selector}>
                  <BetterPickerSelect
                    placeholder={{ label: "Choose Month", value: "no-country" }}
                    onValueChange={(value) =>
                      setSelectedMonth(value === "no-country" ? "" : value)
                    }
                    value={selectedMonth}
                    items={monthsList}
                  />
                </View>
              </View>
            </Actionsheet.Item>
          </View>
          <View style={styles.buttonContainer}>
            <SmallYellowButton onPress={internalOnSave} text="Save" />
            <SmallWhiteButton onPress={internalOnClose} text="Back" />
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#565BD7",
    width: 40,
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: -160,
  },
  container: {
    alignItems: "center",
    height: "100%",
    paddingTop: 20,
  },
  selectorGroup: {
    flexDirection: "row",
    alignSelf: "center",
    height: 60,
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#C3C5F3",
  },
  selectorsBox: {
    height: 400,
  },
  button: {
    backgroundColor: "#1C1D1F",
    height: 40,
    width: 40,
    color: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#EDEAEA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 5,
    marginLeft: 5,
  },
  selectorButton: {
    height: "100%",
    width: "16%",
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
    width: "83%",
    height: "100%",
    borderRadius: 10,
    paddingLeft: 5,
    borderColor: "#C3C5F3",
  },
  text: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 21,
    color: "#494EBF",
  },
  icon: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  header: {
    justifyContent: "center",
    paddingTop: 20,
  },
});
