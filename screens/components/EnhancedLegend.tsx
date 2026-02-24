import React from 'react';
import { StyleSheet, View, Text, FlatList, useColorScheme } from 'react-native';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

interface StatisticData {
  value: number;
  text: string;
  color: string;
  type: string;
  money: string;
}

interface EnhancedLegendProps {
  data: StatisticData[];
  showPercentage?: boolean;
}

const EnhancedLegend: React.FC<EnhancedLegendProps> = ({
  data,
  showPercentage = true,
}) => {
  const textColor = '#333333';

  const renderItem = ({ item }: { item: StatisticData }) => {
    const percentage = parseFloat(item.text.replace('%', ''));

    return (
      <View style={styles.legendItem}>
        <View style={styles.legendLeft}>
          <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
          <Text style={[styles.categoryText, { color: textColor }]}>
            {capitalizeFirstLetter(item.type)}
          </Text>
        </View>
        <View style={styles.legendRight}>
          <Text style={[styles.valueText, { color: textColor }]}>
            {Math.round(Number(item.money)) / 100}
          </Text>
          {showPercentage && (
            <View style={[styles.percentageContainer, { backgroundColor: item.color + '20' }]}>
              <Text style={[styles.percentageText, { color: item.color }]}>
                {percentage}%
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.type}-${Math.random()}`}
      style={styles.container}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  percentageContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 48,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    opacity: 0.5,
    marginVertical: 2,
  },
});

export default EnhancedLegend; 
