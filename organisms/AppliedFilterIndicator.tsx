import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { UseExpensesFilter } from "../db/hooks/useExpenses";
import { expensesList, isExpenseCategory, globalMergedExpensesList } from "../utils/expensesList";
import CloseIcon from "../screens/components/expenses/icons/close";

type FilterParams = {
  expenseFilter: UseExpensesFilter;
  clearFilter: () => void;
  countryFlag?: string;
};

export default function AppliedFilterIndicator({
  expenseFilter,
  clearFilter,
  countryFlag,
}: FilterParams) {
  const category =
    expenseFilter.category && isExpenseCategory(expenseFilter.category)
      ? expenseFilter.category
      : "other";

  // Get expense details from the global merged list first, fallback to default list
  const expenseDetails = globalMergedExpensesList[category] || expensesList[category];

  return (
    <View style={styles.filters}>
      <Text style={styles.filterText}>
        Spent{expenseFilter.monthYear ? ` in ${expenseFilter.monthYear}` : ""}
        {expenseFilter.paymentCountryId ? ` in ${countryFlag}` : ""}
        {expenseFilter.category ? " on" : ""}
      </Text>
      {expenseFilter.category && (
        <View
          style={[
            styles.icon,
            { backgroundColor: expenseDetails?.color },
          ]}
        >
          {expenseDetails?.icon}
        </View>
      )}
      <Pressable
        onPress={() => {
          clearFilter();
        }}
        style={styles.removeFilterButton}
      >
        <CloseIcon />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  removeFilterButton: {
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    shadowColor: "#ffffff",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    elevation: 0,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "#FFFFFF",
    height: 40,
    backgroundColor: "#1C1D1F",
    borderRadius: 10,
    marginTop: 12,
    display: "flex",
    alignSelf: "flex-end",
    shadowColor: "#EDEAEA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 5,
  },
  filterText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 23,
    marginLeft: 10,
    marginRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
