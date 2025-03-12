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
    
    console.log(`Starting purchase for package: ${pack.identifier}`);
    
    try {
      console.log("Calling RevenueCat purchasePackage");
      await purchasePackage(pack);
      console.log("Purchase completed successfully");
      
      console.log("Invalidating subscription status queries");
      queryClient.invalidateQueries(SUBSCRIPTION_STATUS_QUERY_KEY);
      
      console.log("Checking subscription status");
      const status = await checkSubscriptionStatus();
      console.log(`Subscription status: ${JSON.stringify(status)}`);
      
      return status;
    } catch (error) {
      console.error("Error during purchase process:", error);
      throw error;
    }
  });
};
