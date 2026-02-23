import React from "react";
import { presentPaywall } from "../../../utils/presentPaywall";

interface PurchaseProps {
  isPromoOpened: boolean;
  setIsPromoOpened: (isOpen: boolean) => void;
  onPurchaseInitiated?: () => void;
}

// Global state to manage subscription modal
let globalSetIsPromoOpened: ((isOpen: boolean) => void) | null = null;

/**
 * Open the RevenueCat paywall from anywhere in the app.
 * This replaces the old custom modal with RevenueCat's built-in paywall.
 */
export const openSubscriptionModal = async () => {
  await presentPaywall();
};

/**
 * Purchase component — now a thin wrapper that triggers the RevenueCat paywall.
 * Renders nothing; the paywall is presented natively by RevenueCat.
 * Kept for backward compatibility with existing parent components.
 */
const Purchase: React.FC<PurchaseProps> = ({
  isPromoOpened,
  setIsPromoOpened,
  onPurchaseInitiated,
}) => {
  React.useEffect(() => {
    if (isPromoOpened) {
      setIsPromoOpened(false);
      presentPaywall().then((purchased) => {
        if (purchased && onPurchaseInitiated) {
          onPurchaseInitiated();
        }
      });
    }
  }, [isPromoOpened]);

  return null;
};

export default Purchase;
