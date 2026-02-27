import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, Dimensions, useColorScheme } from 'react-native';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  children
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bgColor = isDark ? '#1A1A1A' : 'white';
  const borderColor = isDark ? '#333333' : '#E5E5E5';
  const textColor = isDark ? '#E5E5E5' : '#333333';
  const subtitleColor = isDark ? '#AAAAAA' : '#666666';

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.chartContent}>
        {children}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    width: width - 40,
    alignSelf: 'center',
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  chartContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChartContainer; 
