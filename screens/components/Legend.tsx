import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

interface StatisticData {
  value: number;
  text: string;
  color: string;
  type: string;
  money: string;
}

const Legend: React.FC<{ statisticData: StatisticData[] }> = ({
  statisticData,
}) => (
  <View style={styles.legend}>
    {statisticData.map((category) => (
      <View key={`${Math.random()}${category.type}`} style={styles.legendRows}>
        <View style={[styles.dot, { backgroundColor: category.color }]} />
        <Text style={styles.legendText}>
          {capitalizeFirstLetter(category.type)} —{" "}
          {Math.round(Number(category.money)) / 100}
        </Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  legend: {
    marginTop: 30,
  },
  legendText: {
    color: "black",
    fontSize: 20,
  },
  legendRows: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 4,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default Legend;
