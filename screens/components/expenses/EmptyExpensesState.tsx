import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useColorModeValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const EmptyExpensesState: React.FC = () => {
  const textColor = '#1A1A1A';
  const subtextColor = '#666666';
  const arrowColor = '#4169E1';

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Large icon instead of image */}
        <View style={styles.iconCircle}>
          <Ionicons name="receipt-outline" size={60} color="#4169E1" />
        </View>

        {/* Text content */}
        <Text style={[styles.title, { color: textColor }]}>
          No Expenses Yet
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          Start tracking your spending for this month or trip!
        </Text>
      </View>

      {/* Arrow pointing to add button */}
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrowText, { color: subtextColor }]}>
          Tap the + button below
        </Text>
        <Ionicons
          name="arrow-down"
          size={30}
          color={arrowColor}
          style={styles.arrowIcon}
        />
      </View>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#F7F8FA', // Matching screen background
    paddingBottom: 40,
    minHeight: height * 0.6, // Ensure it takes sufficient space
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.05,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8EDFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  arrowContainer: {
    alignItems: 'center',
    marginBottom: 60, // Give some space above the bottom bar
  },
  arrowIcon: {
    marginTop: 8,
  },
  arrowText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default EmptyExpensesState; 
