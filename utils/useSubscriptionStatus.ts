import { useState, useEffect, useCallback } from 'react';
import { useRevenueCat, checkSubscriptionStatus } from './RevenueCatProvider';
import { Platform } from 'react-native';

// Simple cache to avoid unnecessary API calls
let cachedSubscriptionStatus = false;

/**
 * Hook to check if the user has an active subscription
 * @returns Object containing subscription status, loading state, and a function to force refresh
 */
export const useSubscriptionStatus = () => {
  if (Platform.OS === "ios") {
    const purchaseContext = useRevenueCat();
    const user = purchaseContext?.user || { cookies: 0, items: [], pro: false };
    const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(user.pro || cachedSubscriptionStatus);
    const [isLoading, setIsLoading] = useState<boolean>(!cachedSubscriptionStatus);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    // Function to force a refresh of the subscription status
    const forceRefresh = useCallback(() => {
      setRefreshTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
      return registerRefreshCallback(forceRefresh);
    }, [forceRefresh]);

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

          // If we have a cached status of true, use it immediately
          if (cachedSubscriptionStatus) {
            setHasActiveSubscription(true);
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
    }, [user.pro, refreshTrigger]);

    return {
      hasActiveSubscription,
      isLoading,
      forceRefresh
    };
  } else {
    // On Android, all features are available by default
    return {
      hasActiveSubscription: true,
      isLoading: false,
      forceRefresh: () => { } // No-op function for Android
    };
  }
};

// Function to update subscription status after purchase
export const updateSubscriptionCache = (status: boolean) => {
  cachedSubscriptionStatus = status;
};

// Global function to trigger a refresh of all subscription status hooks
let globalRefreshCallbacks: (() => void)[] = [];

export const registerRefreshCallback = (callback: () => void) => {
  globalRefreshCallbacks.push(callback);
  return () => {
    globalRefreshCallbacks = globalRefreshCallbacks.filter(cb => cb !== callback);
  };
};

export const triggerGlobalSubscriptionRefresh = () => {
  globalRefreshCallbacks.forEach(callback => callback());
};

export default useSubscriptionStatus; 
