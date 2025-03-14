import { useQuery, useQueryClient, useMutation } from "react-query";
import dbRead from "../utils/read";
import { CountryType } from "../../utils/types";
import {
  checkSubscriptionStatus,
  useRevenueCat,
} from "../../utils/RevenueCatProvider";
import { PurchasesPackage } from "react-native-purchases";

const USE_SUBSCRIPTION = "useSubscription";
export const SUBSCRIPTION_STATUS_QUERY_KEY = "useSubscriptionStatus";

export default function useSubscription() {
  return useQuery(USE_SUBSCRIPTION, async () => {
    const subscription = await dbRead<CountryType>(
      "SELECT subscription.* FROM subscription"
    );

    if (subscription.length > 1) {
      throw new Error("unexpected: more than 1 subscription");
    }

    return subscription[0];
  });
}

export function useSubscriptionStatus() {
  return useQuery(SUBSCRIPTION_STATUS_QUERY_KEY, async () => {
    const result = await checkSubscriptionStatus();
    return result?.hasSubscription;
  });
}

export const usePurchasePackage = () => {
  const queryClient = useQueryClient();
  const { purchasePackage } = useRevenueCat();

  return useMutation(async (pack: PurchasesPackage) => {
    if (!purchasePackage) {
      console.error("RevenueCat context is not initialized");
      throw new Error("unexpected: revenue cat context is not initialized");
    }
    
    try {
      await purchasePackage(pack);
      
      queryClient.invalidateQueries(SUBSCRIPTION_STATUS_QUERY_KEY);
      
      const status = await checkSubscriptionStatus();
      
      return status;
    } catch (error) {
      console.error("Error during purchase process:", error);
      throw error;
    }
  });
};
