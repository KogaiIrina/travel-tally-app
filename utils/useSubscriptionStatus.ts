import { useState, useEffect } from 'react';
import { useRevenueCat, checkSubscriptionStatus } from './RevenueCatProvider';
import { Platform } from 'react-native';

// Simple cache to avoid unnecessary API calls
let cachedSubscriptionStatus = false;

/**
 * Hook to check if the user has an active subscription
 * @returns Object containing subscription status and loading state
 */
export const useSubscriptionStatus = () => {
  if (Platform.OS === "ios") {
    const { user } = useRevenueCat();
    const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(user.pro || cachedSubscriptionStatus);
    const [isLoading, setIsLoading] = useState<boolean>(!cachedSubscriptionStatus);

    useEffect(() => {
      const checkStatus = async () => {
        try {
          // First, use the user.pro from context which is immediately available
          if (user.pro) {
            setHasActiveSubscription(true);
            cachedSubscriptionStatus = true;
            setIsLoading(false);
            return;
          }
          
          // Then double-check with the latest data from RevenueCat
          const { hasSubscription } = await checkSubscriptionStatus();
          setHasActiveSubscription(hasSubscription);
          cachedSubscriptionStatus = hasSubscription;
          setIsLoading(false);
        } catch (error) {
          console.error('Error checking subscription status:', error);
          setIsLoading(false);
        }
      };

      checkStatus();
    }, [user.pro]);

    return {
      hasActiveSubscription,
      isLoading
    };
  } else {
    return {
      hasActiveSubscription: false,
      isLoading: false
    };
  }
};

// Function to update subscription status after purchase
export const updateSubscriptionCache = (status: boolean) => {
  cachedSubscriptionStatus = status;
};

export default useSubscriptionStatus; 
