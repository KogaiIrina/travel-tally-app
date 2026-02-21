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
            "comment TEXT DEFAULT NULL," +
            "date DATETIME" +
            ")"
          );

          await tx.executeSql(
            "CREATE TABLE IF NOT EXISTS trips (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "name TEXT NOT NULL," +
            "country_id INTEGER REFERENCES countries(id)," +
            "base_currency TEXT," +
            "target_currency TEXT," +
            "start_date DATETIME," +
            "end_date DATETIME," +
            "is_active BOOLEAN DEFAULT 0" +
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

          // Check if trip_id exists in expenses table
          const expensesInfo = await db.getAllAsync<{ name: string }>("PRAGMA table_info(expenses)");
          const hasTripId = expensesInfo.some(col => col.name === "trip_id");
          const hasComment = expensesInfo.some(col => col.name === "comment");

          if (!hasComment && expensesInfo.length > 0) {
            await tx.executeSql("ALTER TABLE expenses ADD COLUMN comment TEXT DEFAULT NULL");
          }

          if (!hasTripId && expensesInfo.length > 0) {
            // Alter expenses table to add trip_id
            await tx.executeSql("ALTER TABLE expenses ADD COLUMN trip_id INTEGER REFERENCES trips(id) DEFAULT NULL");

            // Migrate existing expenses to automatically generated trips
            // Group expenses strictly by country_id, taking the most recent or arbitrary currency for the trip base
            const existingExpenses = await db.getAllAsync<{ country_id: number, selected_currency: string, home_currency: string }>(
              "SELECT country_id, MAX(selected_currency) as selected_currency, MAX(home_currency) as home_currency FROM expenses WHERE country_id IS NOT NULL GROUP BY country_id"
            );

            for (const exp of existingExpenses) {
              // Find country name
              const countryInfo = await db.getAllAsync<{ country: string }>("SELECT country FROM countries WHERE id = ?", [exp.country_id]);
              const countryName = countryInfo.length > 0 ? countryInfo[0].country : "Unknown Country";

              // Create a single legacy trip for this country
              await tx.executeSql(
                "INSERT INTO trips (name, country_id, base_currency, target_currency, is_active) VALUES (?, ?, ?, ?, 0)",
                [`Trip to ${countryName}`, exp.country_id, exp.home_currency, exp.selected_currency]
              );

              // Get the trip id
              const trips = await db.getAllAsync<{ id: number }>("SELECT id FROM trips ORDER BY id DESC LIMIT 1");
              if (trips.length > 0) {
                const tripId = trips[0].id;
                // Update ALL expenses for this country to use this single trip_id
                await tx.executeSql("UPDATE expenses SET trip_id = ? WHERE country_id = ?", [tripId, exp.country_id]);
              }
            }
          }

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

