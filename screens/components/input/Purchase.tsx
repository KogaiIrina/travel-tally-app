import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import { Toast, Box, VStack, Progress } from "native-base";
import { PurchasesPackage } from "react-native-purchases";
import { useRevenueCat } from "../../../utils/RevenueCatProvider";
import { updateSubscriptionCache, triggerGlobalSubscriptionRefresh } from "../../../utils/useSubscriptionStatus";
import BigBlueButton from "../BigBlueButton";
import CloseIcon from "../expenses/icons/close";
import { usePurchasePackage } from "../../../db/hooks/useSubscription";

interface PurchaseProps {
  isPromoOpened: boolean;
  setIsPromoOpened: (isOpen: boolean) => void;
  onPurchaseInitiated?: () => void;
}

const PURCHASE_TIMEOUT = 30000;

// Global state to manage subscription modal
let globalSetIsPromoOpened: ((isOpen: boolean) => void) | null = null;

/**
 * Static method to open the subscription modal from anywhere in the app
 * Must be used after the Purchase component has been mounted
 */
export const openSubscriptionModal = () => {
  if (globalSetIsPromoOpened) {
    globalSetIsPromoOpened(true);
    return true;
  }
  console.warn('Purchase component not mounted yet. Cannot open subscription modal.');
  return false;
};

const Purchase: React.FC<PurchaseProps> = ({
  isPromoOpened,
  setIsPromoOpened,
  onPurchaseInitiated,
}) => {
  const purchaseContext = useRevenueCat();
  const packages = purchaseContext?.packages || [];
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const { mutate: onPurchase } = usePurchasePackage();

  // Store the setIsPromoOpened function in the global variable
  useEffect(() => {
    globalSetIsPromoOpened = setIsPromoOpened;
    return () => {
      // Clean up when component unmounts
      if (globalSetIsPromoOpened === setIsPromoOpened) {
        globalSetIsPromoOpened = null;
      }
    };
  }, [setIsPromoOpened]);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Auto-close modal after successful purchase
  useEffect(() => {
    if (purchaseStatus === 'success') {
      const successTimer = setTimeout(() => {
        setIsPromoOpened(false);
        setPurchaseStatus('idle');
      }, 1500);

      return () => clearTimeout(successTimer);
    }
  }, [purchaseStatus, setIsPromoOpened]);

  const handlePurchase = (pack: PurchasesPackage) => {
    setIsLoading(true);
    setPurchaseStatus('processing');
    setStatusMessage('Processing your purchase...');

    // Set timeout to prevent indefinite loading
    const id = setTimeout(() => {
      setIsLoading(false);
      setPurchaseStatus('error');
      setStatusMessage('Purchase is taking longer than expected. Please try again.');

      Toast.show({
        title: "Purchase timeout",
        description: "The purchase is taking longer than expected. The transaction may still be processing. Please check your subscriptions later.",
        placement: "top",
        duration: 5000,
      });
    }, PURCHASE_TIMEOUT);

    setTimeoutId(id);

    onPurchase(pack, {
      onSuccess() {
        if (timeoutId) clearTimeout(timeoutId);
        setIsLoading(false);
        setPurchaseStatus('success');
        setStatusMessage('Purchase successful!');

        // Update subscription cache to immediately reflect purchase
        updateSubscriptionCache(true);

        // Trigger global refresh to update all Pro badges
        triggerGlobalSubscriptionRefresh();

        // Immediately close the paywall on successful purchase
        setIsPromoOpened(false);

        // Show success toast
        Toast.show({
          title: "Purchase completed",
          description: "Your purchase was successful! All premium features are now available.",
          placement: "top",
          duration: 3000,
        });

        // Call the optional callback to notify parent components
        if (onPurchaseInitiated) {
          onPurchaseInitiated();
        }
      },
      onError(error: any) {
        if (timeoutId) clearTimeout(timeoutId);
        setIsLoading(false);
        setPurchaseStatus('error');
        setStatusMessage(error.message || 'Purchase failed. Please try again.');

        Toast.show({
          title: "Purchase failed",
          description: error.message || "An error occurred during purchase. Please try again.",
          placement: "top",
          duration: 5000,
        });
      },
      onSettled() {
        // Ensure loading state is reset regardless of success or failure
        if (timeoutId) clearTimeout(timeoutId);
      }
    });
  };

  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  const renderPurchaseStatus = () => {
    switch (purchaseStatus) {
      case 'processing':
        return (
          <Box position="absolute" bottom={0} left={0} right={0} bg="white" p={4} borderTopRadius="xl" shadow={2}>
            <VStack space={2} alignItems="center">
              <Progress value={65} size="xs" w="90%" colorScheme="blue" />
              <Text style={styles.statusText}>{statusMessage}</Text>
            </VStack>
          </Box>
        );
      case 'success':
        return (
          <Box position="absolute" bottom={0} left={0} right={0} bg="#E7F3E8" p={4} borderTopRadius="xl" shadow={2}>
            <VStack space={2} alignItems="center">
              <Text style={[styles.statusText, { color: '#2E7D32' }]}>✓ {statusMessage}</Text>
            </VStack>
          </Box>
        );
      case 'error':
        return (
          <Box position="absolute" bottom={0} left={0} right={0} bg="#FFEBEE" p={4} borderTopRadius="xl" shadow={2}>
            <VStack space={2} alignItems="center">
              <Text style={[styles.statusText, { color: '#C62828' }]}>✗ {statusMessage}</Text>
            </VStack>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={isPromoOpened} animationType="slide" transparent={false} onRequestClose={() => { if (!isLoading) setIsPromoOpened(false); }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              if (!isLoading) {
                setIsPromoOpened(false);
              }
            }}
            style={styles.closeIcon}
            disabled={isLoading}
          >
            <CloseIcon />
          </TouchableOpacity>
          <View style={styles.promo}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              Unlock Unlimited Experience
            </Text>
          </View>
          <View style={styles.subscriptionOptions}>
            {packages.map((pack) => (
              <TouchableOpacity
                key={pack.identifier}
                onPress={() => setSelectedPackage(pack)}
                style={[
                  styles.button,
                  selectedPackage?.identifier === pack.identifier && styles.selectedButton
                ]}
                disabled={isLoading}
              >
                <View style={styles.promoDescription}>
                  <View style={styles.text}>
                    <Text style={styles.packageTitle}>{pack.product.title}</Text>
                    <Text style={styles.packagePrice}>{pack.product.priceString}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <BigBlueButton
            text={isLoading ? "Processing..." : "Subscribe"}
            onPress={() => {
              if (selectedPackage) {
                handlePurchase(selectedPackage);
              } else {
                Toast.show({
                  title: "Selection required",
                  description: "Please select a subscription package first.",
                  placement: "top",
                  duration: 3000,
                });
              }
            }}
            isActive={selectedPackage ? true : false}
            disabled={isLoading}
          />

          {renderPurchaseStatus()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "40%",
    marginVertical: 6,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 50,
    left: 30,
    width: 70,
    height: 70,
    zIndex: 10,
  },
  button: {
    padding: 14,
    borderRadius: 16,
    margin: 6,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "80%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#2C65E1",
  },
  selectedButton: {
    backgroundColor: "#F0F5FF",
    borderWidth: 2,
  },
  paywallModal: {
    display: "flex",
    flexDirection: "column",
  },
  promo: {
    padding: 12,
    margin: 4,
    backgroundColor: "#fff",
  },
  promoDescription: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  subscriptionOptions: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "2%",
  },
  text: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  packageTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  packagePrice: {
    color: "#2C65E1",
    fontWeight: "500",
  },
  desc: {
    color: "#B6B7C0",
    paddingVertical: 4,
  },
  price: {
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    borderColor: "#EA3C4A",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Purchase;
