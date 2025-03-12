import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase;

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

// Initialize the database
createDatabase();

// Export a wrapper object that provides transaction-like functionality
export default {
  async runAsync(query: string, params: (string | number | null)[] = []): Promise<void> {
    if (!db) await createDatabase();
    await db.runAsync(query, params);
  },
  
  async getAllAsync<T>(query: string, params: (string | number | null)[] = []): Promise<T[]> {
    if (!db) await createDatabase();
    return await db.getAllAsync<T>(query, params);
  },
  
  async transaction(callback: (tx: { executeSql: (query: string, params?: any[]) => Promise<any> }) => void): Promise<void> {
    if (!db) await createDatabase();
    
    // Create a transaction-like object that mimics the old API
    const tx = {
      executeSql: async (query: string, params: any[] = []) => {
        return await db.runAsync(query, params);
      }
    };
    
    await callback(tx);
  },
  
  async withTransactionSync(callback: () => void): Promise<void> {
    if (!db) await createDatabase();
    
    try {
      await db.execAsync('BEGIN TRANSACTION');
      callback();
      await db.execAsync('COMMIT');
    } catch (error) {
      await db.execAsync('ROLLBACK');
      throw error;
    }
  }
};
