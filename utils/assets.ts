import { SQLiteDatabase } from "expo-sqlite";
import Countries from "../assets/countries-list.json";

export default async function fillTables(tx: any) {
  // Use the transaction object passed from App.tsx
  for (let i = 0; i < Countries.length; i++) {
    const { country, flag, currency } = Countries[i];
    await tx.executeSql(
      "INSERT INTO countries (country, flag, currency) values (?, ?, ?)",
      [country, flag, currency]
    );
  }
}

export function sqlRowsToArray<T>(rows: Array<any>): T[] {
  return rows as T[];
}
