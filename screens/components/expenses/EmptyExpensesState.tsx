import React from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { useColorModeValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  hasTrips: boolean;
  onCreateTrip: () => void;
}

const EmptyExpensesState: React.FC<Props> = ({ hasTrips, onCreateTrip }) => {
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
          {hasTrips ? "No Expenses Yet" : "Welcome!"}
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          {hasTrips
            ? "Start tracking your spending for this month or trip by tapping the + button!"
            : "Let's create your first trip to start tracking expenses."}
        </Text>

        {!hasTrips && (
          <Pressable style={styles.createButton} onPress={onCreateTrip}>
            <Text style={styles.createButtonText}>+ Add Destination</Text>
          </Pressable>
        )}
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
  createButton: {
    backgroundColor: '#4169E1',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#4169E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmptyExpensesState; 
