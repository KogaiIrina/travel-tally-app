import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "native-base";
import { currencyList } from "../../../utils/currencyList";
import useTotalExpenses from "../../../db/hooks/useTotalExpenses";
import { UseExpensesFilter } from "../../../db/hooks/useExpenses";
import { formatNumber } from "../../../utils/formatNumber";
import { getCurrentMonth } from "../../../utils/getCurrentMonth";

interface ExpensesSumPlateProps {
  currency: keyof typeof currencyList;
  filter: UseExpensesFilter;
  tripId?: number;
}

export default function ExpensesSumPlate({
  currency,
  filter,
  tripId,
}: ExpensesSumPlateProps) {
  const isFilterEmpty = Object.keys(filter).length === 0;
  const currentMonth = getCurrentMonth();

  const { data: totalSum } = useTotalExpenses(
    isFilterEmpty
      ? (tripId ? { tripId } : { monthYear: currentMonth })
      : { ...filter, tripId }
  );

  const label = isFilterEmpty
    ? (tripId ? "TOTAL TRIP SPENDING" : "SPENT THIS MONTH")
    : "FILTERED SPENDING";

  return (
    <View style={styles.plate}>
      <Text style={styles.total}>{label}</Text>
      <Text style={styles.sumInfo}>
        {currencyList[currency]}{" "}
        {totalSum
          ? formatNumber(Number((totalSum[0].total / 100).toFixed(2)))
          : 0}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sumInfo: {
    color: "#1A1A1A",
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 44,
  },
  total: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#888888",
    marginBottom: 4,
  },
});
