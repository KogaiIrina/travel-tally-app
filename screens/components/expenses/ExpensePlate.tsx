import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { expensesList, globalMergedExpensesList } from "../../../utils/expensesList";
import HomeIcon from "./icons/home";

interface ExpensePlateProps {
  amount: string;
  amountInHomeCurrency: string;
  homeCurrency: string;
  expenseType: keyof typeof expensesList;
  date: string;
  currentCountryFlag: string;
  currentCountryCurrency: string;
}

export default function ExpensePlate({
  amount,
  amountInHomeCurrency,
  homeCurrency,
  currentCountryFlag,
  currentCountryCurrency,
  expenseType,
  date,
}: ExpensePlateProps) {
  // Get expense details from the global merged list first, fallback to default list
  // If neither has the expense type, use "other" as a fallback
  const expenseDetails =
    globalMergedExpensesList[expenseType] ||
    expensesList[expenseType] ||
    globalMergedExpensesList["other"]; // Fallback to "other" for backward compatibility

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: expenseDetails?.color || "red" },
        ]}
      >
        <>{expenseDetails?.icon || <HomeIcon />}</>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.localAmountText} numberOfLines={1}>
          {amount} {currentCountryCurrency} {currentCountryFlag}
        </Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.homeCurrencyContainer}>
        <Text style={styles.homeAmountText} numberOfLines={1}>
          {amountInHomeCurrency} {homeCurrency}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 8,
  },
  localAmountText: {
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#666",
  },
  homeCurrencyContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexShrink: 0,
    minWidth: 80,
  },
  homeAmountText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "right",
  },
});
