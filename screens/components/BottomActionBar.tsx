import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { useColorModeValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import StatisticIcon from './expenses/icons/statistic';

interface BottomActionBarProps {
  onAddPress: () => void;
  onStatsPress: () => void;
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({
  onAddPress,
  onStatsPress,
}) => {
  const bgColor = useColorModeValue('#FFFFFF', '#1A1A1A');
  const borderColor = useColorModeValue('#E5E5E5', '#333333');
  const addButtonColor = '#4169E1';

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderTopColor: borderColor }]}>
      <View style={styles.content}>
        {/* Left side - empty for now */}
        <View style={styles.sideContainer} />
        
        {/* Center - Add button */}
        <View style={styles.centerContainer}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: addButtonColor }]}
            onPress={onAddPress}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={36} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Right side - Stats button */}
        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.statsButton}
            onPress={onStatsPress}
            activeOpacity={0.7}
          >
            <StatisticIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    borderTopWidth: 1,
    paddingBottom: 20, // Add padding for iOS home indicator
  },
  content: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20, // Lift it up a bit from the bottom
  },
  statsButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomActionBar; 
