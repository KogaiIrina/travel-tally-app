import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { expensesList } from "../../../utils/expensesList";
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
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.icon,
          { backgroundColor: expensesList[expenseType]?.color || "red" },
        ]}
      >
        <>{expensesList[expenseType]?.icon || <HomeIcon />}</>
      </View>
      <View style={styles.plate}>
        <View style={styles.expensesInfo}>
          <Text style={styles.sumInfo}>
            {amount} {currentCountryCurrency} {currentCountryFlag}
          </Text>
          <Text>{date}</Text>
        </View>
        <View style={styles.homeCurrencyInfo}>
          <Text style={styles.homeCurrencySum}>
            {" "}
            {amountInHomeCurrency} {homeCurrency}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    width: "95%",
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 10,
  },
  expensesInfo: {
    marginLeft: 10,
    marginTop: 15,
  },
  icon: {
    width: "20%",
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  homeCurrencyInfo: {
    justifyContent: "center",
    marginRight: 10,
  },
  homeCurrencySum: {
    fontWeight: "600",
    fontSize: 20,
    paddingLeft: 20,
  },
  plate: {
    backgroundColor: "#F3F6FF",
    width: "80%",
    height: "100%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sumInfo: {
    fontSize: 18,
    marginBottom: 5,
  },
});
