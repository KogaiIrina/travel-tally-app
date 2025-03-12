import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Checkbox, Modal, Spinner, HStack, Heading } from "native-base";
import { PurchasesPackage } from "react-native-purchases";
import { useRevenueCat } from "../../../utils/RevenueCatProvider";
import BigBlueButton from "../BigBlueButton";
import CloseIcon from "../expenses/icons/close";
import { usePurchasePackage } from "../../../db/hooks/useSubscription";

interface PurchaseProps {
  isPromoOpened: boolean;
  setIsPromoOpened: (isOpen: boolean) => void;
}

const Purchase: React.FC<PurchaseProps> = ({
  isPromoOpened,
  setIsPromoOpened,
}) => {
  const { packages } = useRevenueCat();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: onPurchase } = usePurchasePackage();

  const handlePurchase = (pack: PurchasesPackage) => {
    setIsLoading(true);
    onPurchase(pack, {
      onSuccess() {
        setIsPromoOpened(false);
      },
    });
  };

  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  return (
    <Modal isOpen={isPromoOpened} style={styles.paywallModal}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setIsPromoOpened(false)}
          style={styles.closeIcon}
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
              style={styles.button}
            >
              <View style={styles.promoDescription}>
                <Checkbox
                  value={pack.product.title}
                  isChecked={selectedPackage?.identifier === pack.identifier}
                  accessibilityLabel="This is a checkbox"
                  colorScheme="blue"
                  aria-label="This is a checkbox"
                />
                <View style={styles.text}>
                  <Text>{pack.product.title}</Text>
                  <Text>{pack.product.priceString}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <BigBlueButton
          text="Subscribe"
          onPress={() => {
            if (selectedPackage) {
              handlePurchase(selectedPackage);
            } else {
              alert("Please select a package first.");
            }
          }}
          isActive={selectedPackage ? true : false}
        />
      </View>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HStack space={8} justifyContent="center" alignItems="center">
            <Spinner size="lg" color="#2C65E1" />
            <Heading color="#2C65E1" fontSize="3xl">
              Processing
            </Heading>
          </HStack>
        </View>
      )}
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
  },
  closeIcon: {
    position: "absolute",
    top: 50,
    left: 30,
    width: 70,
    height: 70,
    backgroundColor: "#red",
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
});

export default Purchase;
