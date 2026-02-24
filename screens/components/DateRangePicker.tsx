import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDatePress: () => void;
  onEndDatePress: () => void;
  onEditPress: () => boolean;
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateShort = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDatePress,
  onEndDatePress,
  onEditPress,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bgColor = isDark ? '#333333' : '#F5F5F5';
  const textColor = isDark ? '#E5E5E5' : '#333333';
  const labelColor = isDark ? '#AAAAAA' : '#666666';
  const iconColor = isDark ? '#4F8EFF' : '#2C65E1';
  const activePresetColor = isDark ? '#1c2c4d' : '#E8EEFF';

  const isOneWeek = () => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 7;
  };

  const handleChangePress = () => {
    if (onEditPress()) {
      setIsEditing(true);
    }
  };

  if (!isEditing) {
    return (
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryBadge, { backgroundColor: bgColor }]}>
          <Ionicons name="calendar-outline" size={18} color={labelColor} style={{ marginRight: 6 }} />
          <Text style={[styles.summaryBadgeText, { color: textColor }]}>
            {isOneWeek() ? "Last 7 Days" : `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.changeButton, { backgroundColor: activePresetColor }]}
          onPress={handleChangePress}
        >
          <Text style={[styles.changeButtonText, { color: iconColor }]}>Change Range</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      <TouchableOpacity
        style={styles.closeEditButton}
        onPress={() => setIsEditing(false)}
      >
        <Ionicons name="close-circle" size={24} color={labelColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  summaryBadgeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  changeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
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
    paddingHorizontal: 6,
  },
  closeEditButton: {
    marginLeft: 6,
    padding: 2,
  },
});

export default DateRangePicker; 
