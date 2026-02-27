import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function createDatabase() {
  if (Platform.OS === "web") {
    throw new Error("I don't do web");
  }

  // Use the new SQLite API
  db = await SQLite.openDatabaseAsync("db.db");

  // Enable WAL mode for better performance
  await db.execAsync("PRAGMA journal_mode = WAL");
  await db.execAsync("PRAGMA foreign_keys = ON");

  return db;
}

async function getDb() {
  if (db) return db;
  if (!initPromise) {
    initPromise = createDatabase();
  }
  return await initPromise;
}

// Export a wrapper object that provides transaction-like functionality
export default {
  async runAsync(query: string, params: (string | number | null)[] = []): Promise<void> {
    const database = await getDb();

    // Safety check map to sanitize undefined to null to prevent NPE in expo-sqlite Java bridge
    const safeParams = params.map(p => p === undefined ? null : p);
    await database.runAsync(query, safeParams);
  },

  async getAllAsync<T>(query: string, params: (string | number | null)[] = []): Promise<T[]> {
    const database = await getDb();

    const safeParams = params.map(p => p === undefined ? null : p);
    return await database.getAllAsync<T>(query, safeParams);
  },

  async transaction(callback: (tx: { executeSql: (query: string, params?: any[]) => Promise<any> }) => void): Promise<void> {
    const database = await getDb();

    // Create a transaction-like object that mimics the old API
    const tx = {
      executeSql: async (query: string, params: any[] = []) => {
        const safeParams = params.map(p => p === undefined ? null : p);
        return await database.runAsync(query, safeParams);
      }
    };

    await callback(tx);
  },

  async withTransactionSync(callback: () => void): Promise<void> {
    const database = await getDb();

    try {
      await database.execAsync('BEGIN TRANSACTION');
      callback();
      await database.execAsync('COMMIT');
    } catch (error) {
      await database.execAsync('ROLLBACK');
      throw error;
    }
  }
};
