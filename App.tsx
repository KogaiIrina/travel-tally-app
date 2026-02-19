import React, { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import fillTables from "./utils/assets";
import db from "./db";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loadSettings } from "./utils/settings";
import MainScreen from "./screens/MainScreen";
import LoadingScreen from "./screens/LoadingScreen";
import {
  checkSubscriptionStatus,
  RevenueCatProvider,
} from "./utils/RevenueCatProvider";
import useSubscription from "./db/hooks/useSubscription";
import { updateSubscriptionCache } from "./utils/useSubscriptionStatus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO: Remove the config option once updated to RN 0.65 https://github.com/facebook/react-native/commit/480dabd66547a60522249eda203a3eb1934b02e5
      gcTime: 60 * 1000,
    },
  },
});

function Providers({ children }: { children: React.ReactNode }) {
  if (Platform.OS === "ios") {
    return (
      <RevenueCatProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </RevenueCatProvider>
    );
  } else {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
}

function Entrypoint() {
  const [loading, setLoading] = useState(true);
  const { data: dbSubscription, isLoading } = useSubscription();

  // Check subscription status on app start
  useEffect(() => {
    const checkStatus = async () => {
      if (Platform.OS === "ios") {
        try {
          const { hasSubscription } = await checkSubscriptionStatus();
          // Update the subscription cache
          updateSubscriptionCache(hasSubscription);
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      }
    };

    checkStatus();
  }, []);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Create tables
        await db.transaction(async (tx) => {
          await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS countries (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "country TEXT," +
            "flag TEXT," +
            "currency TEXT" +
            ")"
          );

          await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS country (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "current_country INTEGER REFERENCES countries(id)" +
            ")"
          );

          await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS home_country (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "home_country_id INTEGER REFERENCES countries(id)" +
            ")"
          );

          await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS expenses (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "amount INTEGER," +
            "amount_in_home_currency INTEGER," +
            "home_currency TEXT," +
            "selected_currency TEXT," +
            "country_id INTEGER REFERENCES countries(id)," +
            "expense_types TEXT," +
            "date DATETIME" +
            ")"
          );

          await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS custom_categories (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "key TEXT UNIQUE," +
            "text TEXT," +
            "color TEXT," +
            "icon TEXT" +
            ")"
          );

          await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS subscription (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "purchase_id TEXT NOT NULL," +
            "date DATETIME NOT NULL," +
            "is_active BOOLEAN NOT NULL" +
            ")"
          );

          // Check if countries table is empty
          const result = await db.getAllAsync("SELECT * FROM countries");
          if (result.length === 0) {
            // Fill tables with initial data
            await fillTables(tx);
          }
        });

        // Restore subscription for iOS
        if (Platform.OS === "ios") {
          const { hasSubscription, activeSubscription } = await checkSubscriptionStatus();

          if (hasSubscription && activeSubscription && !dbSubscription) {
            await db.transaction(async (tx) => {
              await tx.executeSql(
                "INSERT INTO subscription (id, purchase_id, is_active, date) VALUES (?, ?, ?, ?)" +
                " ON CONFLICT(id) DO UPDATE SET purchase_id = excluded.purchase_id, is_active = excluded.is_active, date = excluded.date",
                [1, activeSubscription, 1, new Date().toISOString()]
              );
            });
          }
        }

        // Load settings
        await loadSettings(queryClient);

        // Set loading to false
        setLoading(false);
      } catch (error) {
        console.error("Database initialization error:", error);
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      {loading ? <LoadingScreen /> : <MainScreen />}
    </>
  );
}
export default function App() {
  return (
    <Providers>
      <Entrypoint />
    </Providers>
  );
}

