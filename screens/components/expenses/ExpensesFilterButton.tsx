import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Pressable, Text, View, Dimensions } from "react-native";
import { Actionsheet, Box, useDisclose } from "native-base";
import { useVisitedCountries } from "../../../db/hooks/useCountries";
import { Ionicons } from "@expo/vector-icons";
import FilterIcon from "./icons/filter";
import CalendarIcon from "./icons/calendar";
import ExpensesCategoryIcon from "./icons/expenses-type";
import { expensesArray, mergeCategories } from "../../../utils/expensesList";
import { SmallWhiteButton, SmallPrimaryButton } from "../smallButton";
import { UseExpensesFilter } from "../../../db/hooks/useExpenses";
import useMonths from "../../../db/hooks/useMonths";
import CustomDropdown from "../CustomDropdown";
import useCustomCategories from "../../../db/hooks/useCustomCategories";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FilterButtonProps {
  onSave: (expenseFilter: UseExpensesFilter) => void;
  expensesFilter: UseExpensesFilter;
}

export default function ExpensesFilterButton({
  onSave,
  expensesFilter,
}: FilterButtonProps) {
  const { data: countries } = useVisitedCountries();
  const { data: months } = useMonths();
  const { data: customCategories } = useCustomCategories();

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
        id: id,
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

    return months.map((text, index) => ({
      label: `${text}`,
      value: text,
      text: text,
      id: index,
      key: index,
    }));
  }, [months]);

  const expensesList = useMemo(() => {
    // Get the merged array that includes custom categories
    const { mergedExpensesArray } = customCategories
      ? mergeCategories(customCategories)
      : { mergedExpensesArray: expensesArray };

    return mergedExpensesArray.map(({ key, text }, index) => ({
      label: `${text}`,
      value: key,
      id: index,
      key: key,
    }));
  }, [customCategories]);

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
              <CustomDropdown
                items={countryList}
                selectedValue={selectedCountryId}
                placeholder="Choose Country"
                showIcons={false}
                leftIcon={<Ionicons name="location-outline" size={24} color="#4169E1" />}
                width={SCREEN_WIDTH * 0.85}
                onValueChange={(value) =>
                  setSelectedCountryId(value === "no-country" ? undefined : Number(value))
                }
              />
            </Actionsheet.Item>
            <Actionsheet.Item style={{ backgroundColor: "transparent" }}>
              <CustomDropdown
                items={expensesList}
                selectedValue={selectedCategory}
                placeholder="Choose Category"
                showIcons={false}
                leftIcon={<ExpensesCategoryIcon />}
                width={SCREEN_WIDTH * 0.85}
                onValueChange={(value) =>
                  setSelectedCategory(value === "no-category" ? "" : value)
                }
              />
            </Actionsheet.Item>
            <Actionsheet.Item style={{ backgroundColor: "transparent" }}>
              <CustomDropdown
                items={monthsList}
                selectedValue={selectedMonth}
                placeholder="Choose Month"
                showIcons={false}
                leftIcon={<CalendarIcon />}
                width={SCREEN_WIDTH * 0.85}
                onValueChange={(value) =>
                  setSelectedMonth(value === "no-month" ? "" : value)
                }
              />
            </Actionsheet.Item>
          </View>
          <View style={styles.buttonContainer}>
            <SmallPrimaryButton onPress={internalOnSave} text="Save" />
            <SmallWhiteButton onPress={internalOnClose} text="Back" />
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#4169E1",
    width: 40,
    height: 40,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  container: {
    alignItems: "center",
    height: "100%",
  },
  selectorGroup: {
    flexDirection: "row",
    alignSelf: "center",
    height: 60,
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#E8EEFF",
  },
  selectorsBox: {
    height: "auto",
    paddingBottom: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FFFFFF",
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  selectorButton: {
    height: "100%",
    width: "16%",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EEFF",
    borderWidth: 0.3,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  selector: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    width: "83%",
    height: "100%",
    borderRadius: 12,
    paddingLeft: 5,
    borderColor: "#E8EEFF",
  },
  text: {
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 24,
    color: "#1A1A1A",
  },
  icon: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  header: {
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 5,
  },
});
