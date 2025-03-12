import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import ExpenseButton from "./ExpenseButton";
import { expensesArray } from "../../../utils/expensesList";

interface AddExpensesProps {
  setExpenseType: (text: string) => void;
  activeExpenseTypeKey: string | undefined;
  setActiveExpenseTypeKey: (text: string) => void;
}

export default function ExpensesContainer({
  setExpenseType,
  activeExpenseTypeKey,
  setActiveExpenseTypeKey,
}: AddExpensesProps) {
  const onExpenseButtonPress = (expenseTypeKey: string) => {
    setExpenseType(expenseTypeKey);
    setActiveExpenseTypeKey(expenseTypeKey);
  };

  const buttons = expensesArray.map((expense) => (
    <ExpenseButton
      key={expense.key}
      color={expense.color}
      text={expense.text}
      icon={expense.icon}
      active={expense.key === activeExpenseTypeKey}
      onPress={() => onExpenseButtonPress(expense.key)}
    />
  ));

  const firstButtonsRow = buttons.slice(0, 4);
  const secondButtonsRow = buttons.slice(4, 8);
  const thirdButtonsRow = buttons.slice(8, 12);
  const fourthButtonsRow = buttons.slice(12, 16);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.expensesRow}>{firstButtonsRow}</View>
      <View style={styles.expensesRow}>{secondButtonsRow}</View>
      <View style={styles.expensesRow}>{thirdButtonsRow}</View>
      <View style={styles.expensesRow}>{fourthButtonsRow}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "90%",
    left: "5%",
  },
  expensesRow: {
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
