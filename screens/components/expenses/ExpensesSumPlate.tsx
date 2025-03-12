import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "native-base";
import { currencyList } from "../../../utils/currencyList";
import useTotalExpenses from "../../../db/hooks/useTotalExpenses";
import { UseExpensesFilter } from "../../../db/hooks/useExpenses";
import { formatNumber } from "../../../utils/formatNumber";
import { getCurrentMonth } from "../../../utils/getCurrentMonth";

interface ExpensesSumPlate {
  currency: keyof typeof currencyList;
  filter: UseExpensesFilter;
}

export default function ExpensesSumPlate({
  currency,
  filter,
}: ExpensesSumPlate) {
  const isFilterEmpty = Object.keys(filter).length === 0;
  const currentMonth = getCurrentMonth();

  const { data: totalSum } = useTotalExpenses(
    isFilterEmpty ? { monthYear: currentMonth } : filter
  );
  return (
    <View style={styles.plate}>
      <Text style={styles.total}>{`SPENT ${
        isFilterEmpty ? "IN CURRENT MONTH" : ""
      }`}</Text>
      <View>
        <Text style={styles.sumInfo}>
          {currencyList[currency]}{" "}
          {totalSum
            ? formatNumber(Number((totalSum[0].total / 100).toFixed(2)))
            : 0}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    justifyContent: "center",
    width: "100%",
    height: 150,
    marginBottom: 20,
  },

  sumInfo: {
    color: "#FFFFFF",
    fontSize: 50,
    fontWeight: "400",
    lineHeight: 70,
  },
  total: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    marginTop: 10,
    color: "#FFFFFF80",
  },
});
