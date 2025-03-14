import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ProBadge from './ProBadge';
import useSubscriptionStatus from '../../utils/useSubscriptionStatus';
import { openSubscriptionModal } from './input/Purchase';

interface ProFeatureProps {
  children: React.ReactNode;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  badgeSize?: 'small' | 'medium' | 'large';
  disableInteraction?: boolean;
  onProBadgePress?: () => void;
  style?: any;
  badgeOffset?: {
    x?: number;
    y?: number;
  };
}

/**
 * A wrapper component for PRO features
 * Shows the feature with a PRO badge if user doesn't have a subscription
 * Can optionally disable interaction with the feature for non-subscribers
 */
const ProFeature: React.FC<ProFeatureProps> = ({
  children,
  badgePosition = 'top-right',
  badgeSize = 'small',
  disableInteraction = false,
  onProBadgePress,
  style,
  badgeOffset = { x: -30, y: -5 }
}) => {
  const { hasActiveSubscription, isLoading } = useSubscriptionStatus();
  
  // If user has subscription or we're still loading, just show the children
  if (hasActiveSubscription || isLoading) {
    return <View style={style}>{children}</View>;
  }
  
  // Handle opening the subscription modal
  const handleProBadgePress = () => {
    if (onProBadgePress) {
      onProBadgePress();
    } else {
      // Default to opening the subscription modal
      openSubscriptionModal();
    }
  };
  
  // Position the badge based on the badgePosition prop and custom offsets
  const getBadgePosition = () => {
    const xOffset = badgeOffset?.x || 0;
    const yOffset = badgeOffset?.y || 0;
    
    switch (badgePosition) {
      case 'top-left':
        return { top: -5 + yOffset, left: -5 + xOffset };
      case 'bottom-right':
        return { bottom: -5 + yOffset, right: -5 + xOffset };
      case 'bottom-left':
        return { bottom: -5 + yOffset, left: -5 + xOffset };
      case 'top-right':
      default:
        return { top: -5 + yOffset, right: -5 + xOffset };
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      {/* If disableInteraction is true, wrap in a TouchableOpacity that opens subscription */}
      {disableInteraction ? (
        <TouchableOpacity 
          style={styles.disabledFeature}
          onPress={handleProBadgePress}
          activeOpacity={0.7}
        >
          <View style={styles.disabledContent}>
            {children}
          </View>
        </TouchableOpacity>
      ) : (
        <View>{children}</View>
      )}
      
      {/* PRO Badge */}
      <View 
        style={[
          styles.badgeContainer,
          getBadgePosition()
        ]}
      >
        <ProBadge 
          size={badgeSize} 
          onPress={handleProBadgePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  disabledFeature: {
    opacity: 0.7,
  },
  disabledContent: {
    position: 'relative',
  }
});

export default ProFeature; 
