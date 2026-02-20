import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  SectionList,
} from "react-native";
import useExpenses, {
  ExpandedExpenseType,
  UseExpensesFilter,
} from "../db/hooks/useExpenses";
import useHomeCountry from "../db/hooks/useHomeCountry";
import ExpensePlate from "./components/expenses/ExpensePlate";
import ExpensesSumPlate from "./components/expenses/ExpensesSumPlate";
import ExpensesFilterButton from "./components/expenses/ExpensesFilterButton";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDeleteExpense } from "../db/hooks/useExpenses";
import { formatNumber } from "../utils/formatNumber";
import DataSettingsButton from "./components/expenses/DataSettingsButton";
import BlueButton from "./components/BlueButton";
import { expensesList, globalMergedExpensesList } from "../utils/expensesList";
import { currencyList } from "../utils/currencyList";
import AppliedFilterIndicator from "../organisms/AppliedFilterIndicator";
import { useCountryById } from "../db/hooks/useCountries";
import StatisticButton from "./components/StatisticButton";
import { getCurrentMonth } from "../utils/getCurrentMonth";
import { useDisclose } from "native-base";
import EmptyExpensesState from "./components/expenses/EmptyExpensesState";

import { Ionicons } from "@expo/vector-icons";

interface Props {
  tripId?: number;
  onBack?: () => void;
}

export default function ExpensesScreen({ tripId, onBack }: Props) {
  const [expenseFilter, setExpenseFilter] = useState<UseExpensesFilter>({});
  const { data: homeCountry } = useHomeCountry();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { data: countryById } = useCountryById(expenseFilter.paymentCountryId);
  const { isOpen: isStatsOpen, onOpen: onStatsOpen, onClose: onStatsClose } = useDisclose();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclose();

  const isFilterEmpty = Object.keys(expenseFilter).length === 0;
  const currentMonth = getCurrentMonth();
  const { data: expenses } = useExpenses(
    isFilterEmpty
      ? (tripId ? { tripId } : { monthYear: currentMonth })
      : { ...expenseFilter, tripId }
  );

  const handleClearFilter = () => {
    setExpenseFilter({});
  };

  const rightSwipeActions = (id: number) => (
    <Pressable
      onPress={() => {
        deleteExpense(id);
      }}
      style={{
        backgroundColor: "#D0312D",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontWeight: "600",
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        Delete
      </Text>
    </Pressable>
  );

  const sections = useMemo(() => {
    const groupedExpenses = groupExpensesByDate(expenses || []);
    return transformExpensesForSectionList(groupedExpenses);
  }, [expenses]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack && (
            <Pressable onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="#1A1A1A" />
            </Pressable>
          )}
          <View style={[styles.itemBox, onBack && { flex: 1 }]}>
            <DataSettingsButton />
            <ExpensesFilterButton
              onSave={setExpenseFilter}
              expensesFilter={expenseFilter}
            />
          </View>
          {Object.values(expenseFilter).filter(Boolean).length > 0 && (
            <AppliedFilterIndicator
              expenseFilter={expenseFilter}
              clearFilter={handleClearFilter}
              countryFlag={countryById?.flag}
            />
          )}
        </View>
        <ExpensesSumPlate
          currency={stringToCurrency({
            value: homeCountry?.currency,
            fallback: "USD",
          })}
          filter={expenseFilter}
          tripId={tripId}
        />
      </View>

      {expenses && expenses.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <EmptyExpensesState />
        </View>
      ) : (
        <SectionList
          sections={sections}
          renderItem={({ item: expense }) => (
            <GestureHandlerRootView key={expense.id}>
              <Swipeable renderRightActions={() => rightSwipeActions(expense.id)}>
                <ExpensePlate
                  key={expense.id}
                  amount={formatNumber(expense.amount / 100)}
                  amountInHomeCurrency={formatNumber(
                    Number((expense.amount_in_home_currency / 100).toFixed(2))
                  )}
                  currentCountryFlag={expense.flag}
                  currentCountryCurrency={expense.selected_currency}
                  homeCurrency={expense.home_currency}
                  expenseType={stringToExpenseTypeSafe(expense.expense_types)}
                  date={new Date(+expense.date * 1000).toDateString()}
                />
              </Swipeable>
            </GestureHandlerRootView>
          )}
          renderSectionHeader={({ section: { title, total } }) => (
            <Text style={styles.dateHeader}>
              {title} - Total Spent:{" "}
              {formatNumber(Number((total / 100).toFixed(2)))}{" "}
              {homeCountry?.currency}
            </Text>
          )}
          keyExtractor={(item) => item.id.toString()}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.sectionListContent}
        />
      )}

      {/* Regular BlueButton with its UI hidden (handles the Modal logic) */}
      <BlueButton
        hideUI={true}
        isOpen={isAddOpen}
        onClose={onAddClose}
        tripId={tripId}
      />

      {/* Floating Action Button (FAB) for adding an expense */}
      <Pressable style={styles.fab} onPress={onAddOpen}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>

      {/* Statistics modal */}
      <StatisticButton isOpen={isStatsOpen} onClose={onStatsClose} tripId={tripId} />
    </View>
  );
}

function stringToExpenseTypeSafe(str: string): keyof typeof expensesList {
  // First check in the global merged expenses list that includes custom categories
  if (str in globalMergedExpensesList) {
    return str as keyof typeof expensesList;
  }

  // Then check in the default expenses list
  if (str in expensesList) {
    return str as keyof typeof expensesList;
  }

  // Log a warning for debugging purposes
  console.warn(`Warning: Error: unexpected expense type: ${str}`);

  // Still return "other" as fallback
  return "other";
}

function stringToCurrency({
  value,
  fallback,
}: {
  value: string | undefined;
  fallback: keyof typeof currencyList;
}): keyof typeof currencyList {
  if (value && value in currencyList) {
    return value as keyof typeof currencyList;
  }
  return fallback;
}

const styles = StyleSheet.create({
  arrowBox: {
    flexDirection: "row",
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
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#F7F8FA",
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingTop: 10,
    color: "#A7ADB2",
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  items: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
  },
  itemBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 20,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  backButton: {
    marginRight: 15,
    paddingVertical: 10,
  },
  headerText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
    alignSelf: "center",
    lineHeight: 23,
    paddingLeft: 10,
  },
  sectionListContent: {
    paddingBottom: 100, // Enough padding to scroll past the FAB
  },
  emptyStateContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: "center",
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4169E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
});

const groupExpensesByDate = (expenses: ExpandedExpenseType[]) => {
  return expenses.reduce((groups, expense) => {
    const date = new Date(+expense.date * 1000).toDateString();
    if (!groups[date]) {
      groups[date] = { total: 0, expenses: [] };
    }
    groups[date].expenses.push(expense);
    groups[date].total += expense.amount_in_home_currency;
    return groups;
  }, {} as { [key: string]: { total: number; expenses: ExpandedExpenseType[] } });
};

const transformExpensesForSectionList = (groupedExpenses: {
  [key: string]: { total: number; expenses: ExpandedExpenseType[] };
}) => {
  return Object.keys(groupedExpenses).map((date) => ({
    title: date,
    total: groupedExpenses[date].total,
    data: groupedExpenses[date].expenses,
  }));
};
