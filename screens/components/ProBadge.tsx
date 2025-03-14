import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Box } from 'native-base';

interface ProBadgeProps {
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: any;
}

/**
 * A reusable badge component to indicate premium features
 * Can be used across the app to consistently mark PRO features
 */
const ProBadge: React.FC<ProBadgeProps> = ({ 
  size = 'medium', 
  onPress,
  style
}) => {
  const isClickable = !!onPress;
  
  const Container = isClickable ? TouchableOpacity : View;
  
  // Determine size-based styles
  const badgeSize = {
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 10,
    },
    medium: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      fontSize: 12,
    },
    large: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      fontSize: 14,
    }
  };
  
  return (
    <Container 
      style={[
        styles.badge, 
        badgeSize[size],
        isClickable && styles.clickable,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { fontSize: badgeSize[size].fontSize }]}>PRO</Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFD700', // Gold color for PRO badge
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6C200',
  },
  clickable: {
    transform: [{ scale: 1 }],
  },
  text: {
    color: '#000',
    fontWeight: '800',
    letterSpacing: 0.5,
  }
});

export default ProBadge; 
