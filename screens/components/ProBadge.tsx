import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
      borderRadius: 6,
      fontSize: 9,
    },
    medium: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      fontSize: 11,
    },
    large: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      fontSize: 13,
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
    backgroundColor: '#4169E1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4169E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  clickable: {
    transform: [{ scale: 1 }],
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.8,
  }
});

export default ProBadge; 
