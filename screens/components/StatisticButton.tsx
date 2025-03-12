import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Modal,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button, Actionsheet, useDisclose, ScrollView } from "native-base";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { PieChart } from "react-native-gifted-charts";
import StatisticIcon from "./expenses/icons/statistic";
import { useGroupedExpenses } from "../../db/hooks/useExpenses";
import { expensesList, isExpenseCategory } from "../../utils/expensesList";
import CloseIcon from "./expenses/icons/close";
import Legend from "./Legend";

const getPreviousMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
};

const StatisticButton: React.FC = () => {
  const [dateStart, setDateStart] = useState(getPreviousMonth());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [showPicker, setShowPicker] = useState<
    "none" | "endDate" | "startDate"
  >("none");
  const {
    data: expenses,
    refetch,
    isLoading: loading,
  } = useGroupedExpenses({
    dateStart,
    dateEnd,
  });
  const [tempDate, setTempDate] = useState(new Date());

  const statisticData = useMemo(() => {
    if (!expenses) {
      return;
    }
    return expenses.map((expense) => {
      if (!isExpenseCategory(expense.expense_types)) {
        throw new Error(`unexpected expense type: ${expense.expense_types}`);
      }
      return {
        value: expense.total_home_currency_amount,
        text: `${Math.round(expense.percentage)}%`,
        color: expensesList[expense.expense_types].color,
        type: expense.expense_types,
        money: Math.round(expense.total_home_currency_amount).toString(),
      };
    });
  }, [expenses]);

  const { isOpen, onOpen, onClose } = useDisclose();

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        if (showPicker === "startDate") {
          setDateStart(selectedDate);
          setShowPicker("none");
        } else if (showPicker === "endDate") {
          setDateEnd(selectedDate);
          setShowPicker("none");
        }
        refetch();
      } else if (event.type === "dismissed") {
        setShowPicker("none");
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleSetDate = () => {
    if (showPicker === "startDate") {
      setDateStart(tempDate);
      setShowPicker("none");
    } else if (showPicker === "endDate") {
      setDateEnd(tempDate);
      setShowPicker("none");
    }
    refetch();
  };

  return (
    <>
      <Pressable style={styles.stats} onPress={onOpen}>
        <StatisticIcon />
      </Pressable>
      <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
        <Actionsheet.Content>
          <View style={styles.header}>
            <Text style={styles.headerText}>Statistic for the period</Text>
            <View style={styles.datePickerContainer}>
              <DatePickerButton
                label="Start"
                onPress={() => {
                  setTempDate(dateStart);
                  setShowPicker("startDate");
                }}
                date={dateStart}
              />
              <DatePickerButton
                label="End"
                onPress={() => {
                  setTempDate(dateEnd);
                  setShowPicker("endDate");
                }}
                date={dateEnd}
              />
            </View>
          </View>
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (statisticData ?? []).length > 0 ? (
              <PieChart
                data={statisticData ?? []}
                donut
                showText
                textColor="black"
                radius={150}
                textSize={16}
                showValuesAsLabels
              />
            ) : (
              <Text>No data available</Text>
            )}
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            <Legend statisticData={statisticData ?? []} />
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
      {Platform.OS === "ios" ? (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showPicker !== "none"}
          onRequestClose={() => {
            setShowPicker("none");
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable
                onPress={() => {
                  setShowPicker("none");
                }}
                style={styles.closeButton}
              >
                <CloseIcon />
              </Pressable>
              {showPicker === "startDate" && (
                <RNDateTimePicker
                  value={tempDate}
                  mode="date"
                  is24Hour={true}
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  style={styles.picker}
                />
              )}
              {showPicker === "endDate" && (
                <RNDateTimePicker
                  value={tempDate}
                  mode="date"
                  is24Hour={true}
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  style={styles.picker}
                />
              )}
              <TouchableOpacity
                onPress={handleSetDate}
                style={styles.setButton}
              >
                <Text style={styles.buttonText}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        <>
          {showPicker === "startDate" && (
            <RNDateTimePicker
              value={tempDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
              style={styles.picker}
            />
          )}
          {showPicker === "endDate" && (
            <RNDateTimePicker
              value={tempDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
              style={styles.picker}
            />
          )}
        </>
      )}
    </>
  );
};

interface DatePickerButtonProps {
  label: string;
  onPress: () => void;
  date: Date;
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DatePickerButton: React.FC<DatePickerButtonProps> = ({
  label,
  onPress,
  date,
}) => (
  <Button onPress={onPress} style={styles.datePickerButton}>
    <Text>{label}</Text>
    <Text>{formatDate(date)}</Text>
  </Button>
);

const styles = StyleSheet.create({
  actionsheetItem: {
    height: "80%",
    borderRadius: 20,
    alignItems: "center",
  },
  setButton: {
    backgroundColor: "#FFB547",
    borderRadius: 50,
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "800",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 22,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  stats: {
    position: "absolute",
    right: 20,
    height: 60,
    width: 60,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    width: "80%",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  datePickerButton: {
    width: 120,
    height: 50,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  pickerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  picker: {
    width: "100%",
    backgroundColor: "white",
  },
  closeButton: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
});

export default StatisticButton;
