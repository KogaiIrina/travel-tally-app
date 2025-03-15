import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from "react-native";
import ExpenseButton from "./ExpenseButton";
import { expensesArray, mergeCategories } from "../../../utils/expensesList";
import useCustomCategories from "../../../db/hooks/useCustomCategories";
import { Ionicons } from "@expo/vector-icons";
import AddCategoryModal from "./AddCategoryModal";

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
  const { data: customCategories } = useCustomCategories();
  const [allExpenseButtons, setAllExpenseButtons] = useState(expensesArray);
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    if (customCategories) {
      const { mergedExpensesArray } = mergeCategories(customCategories);
      setAllExpenseButtons(mergedExpensesArray);
    }
  }, [customCategories]);

  const onExpenseButtonPress = (expenseTypeKey: string) => {
    setExpenseType(expenseTypeKey);
    setActiveExpenseTypeKey(expenseTypeKey);
  };

  const onAddCategoryPress = () => {
    setShowAddCategory(true);
  };

  const onCloseAddCategory = () => {
    setShowAddCategory(false);
  };

  const buttons = allExpenseButtons.map((expense) => (
    <ExpenseButton
      key={expense.key}
      color={expense.color}
      text={expense.text}
      icon={expense.icon}
      active={expense.key === activeExpenseTypeKey}
      onPress={() => onExpenseButtonPress(expense.key)}
    />
  ));

  // Add the "Add Category" button
  const addCategoryButton = (
    <TouchableOpacity
      key="add-category"
      style={styles.addCategoryButton}
      onPress={onAddCategoryPress}
    >
      <Ionicons name="add-circle-outline" size={24} color="#2C65E1" />
      <Text style={styles.addCategoryText}>Add Category</Text>
    </TouchableOpacity>
  );

  // Calculate rows for the grid display
  const itemsPerRow = 4;
  const rows = [];
  for (let i = 0; i < buttons.length; i += itemsPerRow) {
    rows.push(buttons.slice(i, i + itemsPerRow));
  }

  // Add the "Add Category" button to the last row if there's space, or create a new row
  const lastRow = rows[rows.length - 1];
  if (lastRow && lastRow.length < itemsPerRow) {
    lastRow.push(addCategoryButton);
  } else {
    rows.push([addCategoryButton]);
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {rows.map((row, index) => (
          <View key={`row-${index}`} style={styles.expensesRow}>
            {row}
          </View>
        ))}
      </ScrollView>
      
      <AddCategoryModal 
        visible={showAddCategory} 
        onClose={onCloseAddCategory} 
      />
    </>
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
  addCategoryButton: {
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    width: 80,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#2C65E1",
    backgroundColor: "rgba(44, 101, 225, 0.1)",
  },
  addCategoryText: {
    fontSize: 12,
    color: "#2C65E1",
    marginTop: 4,
  },
});
