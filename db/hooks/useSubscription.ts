import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: [USE_SUBSCRIPTION],
    queryFn: async () => {
      const subscription = await dbRead<CountryType>(
        "SELECT subscription.* FROM subscription"
      );

      if (subscription.length > 1) {
        throw new Error("unexpected: more than 1 subscription");
      }

      return subscription[0] || null;
    },
  });
}

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: [SUBSCRIPTION_STATUS_QUERY_KEY],
    queryFn: async () => {
      const result = await checkSubscriptionStatus();
      return result?.hasSubscription ?? false;
    },
  });
}

export const usePurchasePackage = () => {
  const queryClient = useQueryClient();
  const { purchasePackage } = useRevenueCat();

  return useMutation({
    mutationFn: async (pack: PurchasesPackage) => {
      if (!purchasePackage) {
        console.error("RevenueCat context is not initialized");
        throw new Error("unexpected: revenue cat context is not initialized");
      }

      try {
        await purchasePackage(pack);

        queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_STATUS_QUERY_KEY] });

        const status = await checkSubscriptionStatus();

        return status;
      } catch (error) {
        console.error("Error during purchase process:", error);
        throw error;
      }
    },
  });
};
