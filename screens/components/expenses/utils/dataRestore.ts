import db from "../../../../db";

interface Expense {
  id: number;
  amount: number;
  amount_in_home_currency: number;
  home_currency: string;
  selected_currency: string;
  country_id: number;
  expense_types: string;
  date: string;
}

export function createExpenseTable() {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER,
        amount_in_home_currency INTEGER,
        home_currency TEXT,
        selected_currency TEXT,
        country_id INTEGER REFERENCES countries(id),
        expense_types TEXT,
        date DATETIME
      )`
    );
  });
}

export function dumpDb(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM expenses`,
        [],
        (_, result) => resolve(JSON.stringify(result.rows._array, null, 2)),
        (_, error) => {
          console.log(error);
          reject(error);
          return true;
        }
      );
    });
  });
}

export function restoreDb(dump: string) {
  const expenses: Expense[] = JSON.parse(dump);
  db.transaction((tx) => {
    tx.executeSql(`DELETE FROM expenses`);
    expenses.forEach((expense: Expense) => {
      tx.executeSql(
        `INSERT INTO expenses (amount, amount_in_home_currency, home_currency, selected_currency, country_id, expense_types, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.amount,
          expense.amount_in_home_currency,
          expense.home_currency,
          expense.selected_currency,
          expense.country_id,
          expense.expense_types,
          expense.date,
        ]
      );
    });
  });
}
