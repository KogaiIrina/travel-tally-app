import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Platform, Keyboard } from "react-native";
import ExpenseButton from "./ExpenseButton";
import { expensesArray, mergeCategories } from "../../../utils/expensesList";
import useCustomCategories from "../../../db/hooks/useCustomCategories";
import { Ionicons } from "@expo/vector-icons";
import AddCategoryModal from "./AddCategoryModal";
import ProFeature from "../../components/ProFeature";
import { useSubscriptionStatus } from "../../../utils/useSubscriptionStatus";
import { presentPaywall } from "../../../utils/presentPaywall";

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

  const { hasActiveSubscription } = useSubscriptionStatus();

  // Check if user has access to Pro features (iOS with subscription or any Android user)
  const hasProAccess = Platform.OS === 'android' || hasActiveSubscription;

  useEffect(() => {
    if (customCategories) {
      // This will also update the globalMergedExpensesList internally
      const { mergedExpensesArray } = mergeCategories(customCategories);
      setAllExpenseButtons(mergedExpensesArray);
    }
  }, [customCategories]);

  const onExpenseButtonPress = (expenseTypeKey: string) => {
    Keyboard.dismiss();
    setExpenseType(expenseTypeKey);
    setActiveExpenseTypeKey(expenseTypeKey);
  };

  const onAddCategoryPress = () => {
    if (hasProAccess) {
      setShowAddCategory(true);
    } else {
      presentPaywall();
    }
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

  // Create the Add Category button
  const addCategoryButtonContent = (
    <TouchableOpacity
      key="add-category"
      style={styles.addCategoryButton}
      onPress={onAddCategoryPress}
      activeOpacity={0.7}
    >
      <View style={styles.addCategoryIconContainer}>
        <Ionicons name="add" size={32} color="#4169E1" />
      </View>
      <Text style={styles.addCategoryText}>New</Text>
    </TouchableOpacity>
  );

  // Wrap the Add Category button with ProFeature for non-subscribers on iOS only
  const addCategoryButton = Platform.OS === 'ios' && !hasActiveSubscription ? (
    <ProFeature
      key="add-category-pro-feature"
      badgeSize="small"
      badgePosition="top-right"
      badgeOffset={{ x: -5, y: -2 }}
      disableInteraction={false}
      style={{ flex: 1 }}
    >
      {addCategoryButtonContent}
    </ProFeature>
  ) : (
    addCategoryButtonContent
  );

  // Calculate rows for the grid display
  const itemsPerRow = 3;
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

  // Fill the last row with invisible spacers to maintain consistent tile widths
  const finalRow = rows[rows.length - 1];
  while (finalRow.length < itemsPerRow) {
    finalRow.push(<View key={`spacer-${finalRow.length}`} style={{ flex: 1 }} />);
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
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
    width: '100%',
    paddingHorizontal: 16,
  },
  expensesRow: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  addCategoryButton: {
    flex: 1,
    height: 105,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    paddingTop: 8,
    paddingBottom: 4,
  },
  addCategoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  addCategoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4169E1",
    marginHorizontal: 4,
  },
});
