import * as SQLite from "expo-sqlite";

// Use the correct method to open the database
const db = SQLite.openDatabaseAsync("db.db");

interface Expense {
  amount: number;
  amount_in_home_currency: number;
  home_currency: string;
  selected_currency: string;
  country_id: number;
  expense_types: string;
  date: number;
}

interface CustomCategory {
  key: string;
  text: string;
  color: string;
  icon: string;
}

interface ExportData {
  expenses: Expense[];
  customCategories: CustomCategory[];
}

export function createExpenseTable() {
  db.then(database => {
    database.execAsync(
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
    // Get expenses
    db.then(database => {
      database.getAllAsync<Expense>(`SELECT * FROM expenses`)
        .then(expenses => {
          // Get custom categories
          database.getAllAsync<CustomCategory>(`SELECT key, text, color, icon FROM custom_categories`)
            .then(categories => {
              const exportData: ExportData = {
                expenses,
                customCategories: categories,
              };
              resolve(JSON.stringify(exportData, null, 2));
            })
            .catch(error => {
              console.log(error);
              reject(error);
            });
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    }).catch(error => {
      console.log(error);
      reject(error);
    });
  });
}

export function restoreDb(dump: string) {
  try {
    const data: ExportData = JSON.parse(dump);
    const expenses = data.expenses || [];
    const customCategories = data.customCategories || [];

    db.then(database => {
      // Begin transaction
      database.execAsync('BEGIN TRANSACTION')
        .then(() => {
          // Restore expenses
          return database.execAsync(`DELETE FROM expenses`);
        })
        .then(() => {
          // Insert expenses
          const promises = expenses.map(expense => 
            database.runAsync(
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
            )
          );
          return Promise.all(promises);
        })
        .then(() => {
          // Delete existing custom categories
          return database.execAsync(`DELETE FROM custom_categories`);
        })
        .then(() => {
          // Insert custom categories
          const promises = customCategories.map(category => 
            database.runAsync(
              `INSERT INTO custom_categories (key, text, color, icon) VALUES (?, ?, ?, ?)`,
              [
                category.key,
                category.text,
                category.color,
                category.icon,
              ]
            )
          );
          return Promise.all(promises);
        })
        .then(() => {
          // Commit transaction
          return database.execAsync('COMMIT');
        })
        .catch(error => {
          // Rollback on error
          database.execAsync('ROLLBACK');
          console.error("Error restoring data:", error);
          throw error;
        });
    }).catch(error => {
      console.error("Database error:", error);
      throw error;
    });
  } catch (error) {
    console.error("Error parsing data:", error);
    throw error;
  }
}
