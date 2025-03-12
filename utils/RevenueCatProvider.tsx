import { createContext, useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  PurchasesPackage,
  CustomerInfo,
} from "react-native-purchases";
import dbWrite from "../db/utils/write";
import { REVENUE_CAT_API_KEYS } from "../config";

interface RevenueCatProps {
  purchasePackage?: (pack: PurchasesPackage) => Promise<any>;
  restorePermissions?: () => Promise<CustomerInfo>;
  user: UserState;
  packages: PurchasesPackage[];
}

export interface UserState {
  cookies: number;
  items: string[];
  pro: boolean;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps;
};

export const RevenueCatProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserState>({
    cookies: 0,
    items: [],
    pro: false,
  });
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    const init = async () => {
      if (Platform.OS === "ios") {
        await Purchases.configure({
          apiKey: REVENUE_CAT_API_KEYS.apple,
        });
      }
      setIsReady(true);

      //   Listen for customer updates
      Purchases.addCustomerInfoUpdateListener(async (info) => {
        await updateCustomerInformation(info);
      });

      // Load all offerings and the user object with entitlements
      await loadOfferings();
    };

    init().catch((error) => console.error("Error in init function:", error));
  }, []);

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();

      if (offerings.all) {
        setPackages(offerings.all.PRO.availablePackages);
      }
      return offerings;
    } catch (error) {
      console.error("Error loading offerings:", error);
      throw error;
    }
  };

  // Update user state based on previous purchases
  const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
    const newUser: UserState = { cookies: user.cookies, items: [], pro: false };
    if (customerInfo?.entitlements.active["TEST"] !== undefined) {
      newUser.items.push(customerInfo?.entitlements.active["TEST"].identifier);
    }
    setUser(newUser);
  };

  // Purchase a package
  const purchasePackage = async (pack: PurchasesPackage) => {
    try {
      console.log(`Starting RevenueCat purchase for package: ${pack.product.identifier}`);
      
      // First complete the purchase with RevenueCat
      const purchaseResult = await Purchases.purchasePackage(pack);
      console.log("RevenueCat purchase completed successfully", purchaseResult);
      
      // Update local state immediately to provide feedback to the user
      setUser((prevUser) => ({ ...prevUser, cookies: prevUser.cookies + 5 }));
      
      // Then save to database (don't block UI on this)
      try {
        console.log("Saving subscription to database");
        await dbWrite(
          "INSERT INTO subscription (id, purchase_id, is_active, date) VALUES (?, ?, ?, ?)" +
            " ON CONFLICT(id) DO UPDATE SET purchase_id = excluded.purchase_id, is_active = excluded.is_active, date = excluded.date",
          [1, pack.product.identifier, 1, new Date().toISOString()]
        );
        console.log("Subscription saved to database successfully");
      } catch (dbError) {
        // Log database error but don't fail the purchase
        console.error("Error saving subscription to database:", dbError);
      }
      
      return purchaseResult;
    } catch (e: any) {
      console.error("Error during RevenueCat purchase:", e);
      if (!e.userCancelled) {
        alert(`ERROR: ${e.message}`);
      }
      throw e;
    }
  };

  // Restore previous purchases
  const restorePermissions = async () => {
    const customer = await Purchases.restorePurchases();
    return customer;
  };

  const value = {
    restorePermissions,
    user,
    packages,
    purchasePackage,
  };

  if (!isReady) return <Text>Please, check your internet connection</Text>;

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const checkSubscriptionStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return {
      hasSubscription: customerInfo.activeSubscriptions.length > 0,
      activeSubscription:
        customerInfo.activeSubscriptions.length > 0
          ? customerInfo.activeSubscriptions[0]
          : undefined,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return { hasSubscription: false };
  }
};
