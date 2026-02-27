import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { updateSubscriptionCache, triggerGlobalSubscriptionRefresh } from "./useSubscriptionStatus";

export const ENTITLEMENT_ID = "PRO";

/**
 * Present the RevenueCat paywall if the user doesn't have the PRO entitlement.
 * If the user already has the entitlement, the paywall won't be shown.
 *
 * @returns true if the user purchased or restored, false otherwise
 */
export async function presentPaywall(): Promise<boolean> {
  try {
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: ENTITLEMENT_ID,
    });

    if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
      updateSubscriptionCache(true);
      triggerGlobalSubscriptionRefresh();
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error presenting paywall:", error);
    return false;
  }
}
