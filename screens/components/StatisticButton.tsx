import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Actionsheet, ScrollView, useColorModeValue } from "native-base";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { PieChart } from "react-native-gifted-charts";
import { useGroupedExpenses } from "../../db/hooks/useExpenses";
import { expensesList, isExpenseCategory } from "../../utils/expensesList";
import ChartContainer from "./ChartContainer";
import EnhancedLegend from "./EnhancedLegend";
import DateRangePicker from "./DateRangePicker";
import { Ionicons } from "@expo/vector-icons";

const getPreviousMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
};

interface StatisticButtonProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const StatisticButton: React.FC<StatisticButtonProps> = ({
  isOpen = false,
  onClose = () => {},
}) => {
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
      return [];
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

  const bgColor = useColorModeValue("white", "#1A1A1A");
  const textColor = useColorModeValue("#333333", "#E5E5E5");
  const accentColor = "#FFB547";

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

  const formatDateRange = () => {
    const startDay = dateStart.getDate();
    const startMonth = dateStart.toLocaleString('default', { month: 'short' });
    const endDay = dateEnd.getDate();
    const endMonth = dateEnd.toLocaleString('default', { month: 'short' });
    const endYear = dateEnd.getFullYear();
    
    if (dateStart.getFullYear() === endYear) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${endYear}`;
    } else {
      const startYear = dateStart.getFullYear();
      return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`;
    }
  };

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
        <Actionsheet.Content style={[styles.actionsheetContent, { backgroundColor: bgColor }]}>
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: textColor }]}>Expense Statistics</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          
          <DateRangePicker
            startDate={dateStart}
            endDate={dateEnd}
            onStartDatePress={() => {
              setTempDate(dateStart);
              setShowPicker("startDate");
            }}
            onEndDatePress={() => {
              setTempDate(dateEnd);
              setShowPicker("endDate");
            }}
          />
          
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={accentColor} />
                <Text style={[styles.loadingText, { color: textColor }]}>Loading data...</Text>
              </View>
            ) : statisticData.length > 0 ? (
              <ChartContainer 
                title="Expense Distribution" 
                subtitle={formatDateRange()}
              >
                <View style={styles.chartWrapper}>
                  <PieChart
                    data={statisticData}
                    donut
                    showText
                    textColor={textColor}
                    radius={120}
                    textSize={14}
                    showValuesAsLabels
                    innerRadius={60}
                    innerCircleColor={bgColor}
                    centerLabelComponent={() => (
                      <View style={styles.centerLabel}>
                        <Text style={[styles.centerLabelText, { color: textColor }]}>
                          {statisticData.length}
                        </Text>
                        <Text style={[styles.centerLabelSubtext, { color: textColor }]}>
                          Categories
                        </Text>
                      </View>
                    )}
                  />
                </View>
                <EnhancedLegend data={statisticData} />
              </ChartContainer>
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="bar-chart-outline" size={60} color={textColor} />
                <Text style={[styles.noDataText, { color: textColor }]}>No data available</Text>
                <Text style={[styles.noDataSubtext, { color: textColor }]}>
                  Try selecting a different date range
                </Text>
              </View>
            )}
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
            <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: textColor }]}>
                  {showPicker === "startDate" ? "Select Start Date" : "Select End Date"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowPicker("none");
                  }}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color={textColor} />
                </TouchableOpacity>
              </View>
              
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
                style={[styles.setButton, { backgroundColor: accentColor }]}
              >
                <Text style={styles.buttonText}>Apply</Text>
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
            />
          )}
        </>
      )}
    </>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  actionsheetContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  chartWrapper: {
    marginVertical: 16,
    alignItems: "center",
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabelText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  centerLabelSubtext: {
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  noDataText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
  },
  noDataSubtext: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width - 40,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCloseButton: {
    padding: 4,
  },
  picker: {
    width: "100%",
  },
  setButton: {
    borderRadius: 50,
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StatisticButton;
