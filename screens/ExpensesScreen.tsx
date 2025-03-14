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
import { LinearGradient } from "expo-linear-gradient";
import BlueButton from "./components/BlueButton";
import { expensesList } from "../utils/expensesList";
import { currencyList } from "../utils/currencyList";
import AppliedFilterIndicator from "../organisms/AppliedFilterIndicator";
import { useCountryById } from "../db/hooks/useCountries";
import StatisticButton from "./components/StatisticButton";
import { getCurrentMonth } from "../utils/getCurrentMonth";
import BottomActionBar from "./components/BottomActionBar";
import { useDisclose } from "native-base";
import EmptyExpensesState from "./components/expenses/EmptyExpensesState";

export default function ExpensesScreen() {
  const [expenseFilter, setExpenseFilter] = useState<UseExpensesFilter>({});
  const { data: homeCountry } = useHomeCountry();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { data: countryById } = useCountryById(expenseFilter.paymentCountryId);
  const { isOpen: isStatsOpen, onOpen: onStatsOpen, onClose: onStatsClose } = useDisclose();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclose();

  const isFilterEmpty = Object.keys(expenseFilter).length === 0;
  const currentMonth = getCurrentMonth();
  const { data: expenses } = useExpenses(
    isFilterEmpty ? { monthYear: currentMonth } : expenseFilter
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
        <LinearGradient
          start={{ x: 0.17, y: 0.17 }}
          end={{ x: 1.0, y: 1.0 }}
          colors={["#575759", "transparent"]}
          style={styles.linearGradient}
        >
          <View style={styles.items}>
            <View style={styles.itemBox}>
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
          />
        </LinearGradient>
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
      
      {/* Regular BlueButton with its UI hidden */}
      <BlueButton 
        hideUI={true} 
        isOpen={isAddOpen} 
        onClose={onAddClose} 
      />
      
      {/* Bottom action bar with add and stats buttons */}
      <BottomActionBar 
        onAddPress={onAddOpen}
        onStatsPress={onStatsOpen}
      />
      
      {/* Statistics modal */}
      <StatisticButton isOpen={isStatsOpen} onClose={onStatsClose} />
    </View>
  );
}

function stringToExpenseTypeSafe(str: string): keyof typeof expensesList {
  if (str in expensesList) {
    return str as keyof typeof expensesList;
  }
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
    height: 100,
    width: "98%",
    paddingTop: 25,
    justifyContent: "space-between",
  },
  itemBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  header: {
    backgroundColor: "#212224",
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
    alignSelf: "center",
    lineHeight: 23,
    paddingLeft: 10,
  },
  linearGradient: {
    flex: 1,
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  sectionListContent: {
    paddingBottom: 80,
  },
  emptyStateContainer: {
    flex: 1,
    position: 'relative',
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
