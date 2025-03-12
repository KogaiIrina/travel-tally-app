import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useColorModeValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDatePress: () => void;
  onEndDatePress: () => void;
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDatePress,
  onEndDatePress,
}) => {
  const bgColor = useColorModeValue('#F5F5F5', '#333333');
  const textColor = useColorModeValue('#333333', '#E5E5E5');
  const labelColor = useColorModeValue('#666666', '#AAAAAA');
  const iconColor = useColorModeValue('#2C65E1', '#4F8EFF');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: bgColor }]}
        onPress={onStartDatePress}
      >
        <View style={styles.dateContent}>
          <Text style={[styles.dateLabel, { color: labelColor }]}>From</Text>
          <Text style={[styles.dateText, { color: textColor }]}>{formatDate(startDate)}</Text>
        </View>
        <Ionicons name="calendar-outline" size={20} color={iconColor} />
      </TouchableOpacity>
      
      <View style={styles.separator}>
        <Ionicons name="arrow-forward" size={16} color={labelColor} />
      </View>
      
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: bgColor }]}
        onPress={onEndDatePress}
      >
        <View style={styles.dateContent}>
          <Text style={[styles.dateLabel, { color: labelColor }]}>To</Text>
          <Text style={[styles.dateText, { color: textColor }]}>{formatDate(endDate)}</Text>
        </View>
        <Ionicons name="calendar-outline" size={20} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  dateContent: {
    flexDirection: 'column',
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    paddingHorizontal: 8,
  },
});

export default DateRangePicker; 
