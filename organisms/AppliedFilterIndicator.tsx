import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { UseExpensesFilter } from "../db/hooks/useExpenses";
import { expensesList, isExpenseCategory, globalMergedExpensesList } from "../utils/expensesList";
import { Ionicons } from "@expo/vector-icons";

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
        <Ionicons name="close" size={18} color="#4169E1" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  removeFilterButton: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    marginRight: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    backgroundColor: "#F4F7FF",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#4169E1",
    display: "flex",
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  filterText: {
    color: "#1A1A1A",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
    marginRight: 6,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
