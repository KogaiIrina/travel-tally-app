import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useColorModeValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const EmptyExpensesState: React.FC = () => {
  const textColor = useColorModeValue('#333333', '#FFFFFF');
  const subtextColor = useColorModeValue('#666666', '#AAAAAA');
  const arrowColor = '#4169E1';

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Text content */}
        <Text style={[styles.title, { color: textColor }]}>
          Add Your First Expense
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          It looks like you don't have any expenses in this month yet.
        </Text>
      </View>

      {/* Arrow pointing to add button */}
      <View style={styles.arrowContainer}>
        <Ionicons 
          name="arrow-down" 
          size={40} 
          color={arrowColor} 
          style={styles.arrowIcon}
        />
        <Text style={[styles.arrowText, { color: arrowColor }]}>
          Tap the + button below
        </Text>
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
    paddingBottom: 120, // Space for the bottom action bar
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -height * 0.05, // Adjust to position it nicely in the screen
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
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  arrowContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  arrowIcon: {
    marginBottom: 5,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyExpensesState; 
