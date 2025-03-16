import * as SQLite from "expo-sqlite";
import db from "../../../../db";

// Define types for SQLite transaction callbacks
type SQLiteCallback = (transaction: any, resultSet: any) => void;
type SQLiteErrorCallback = (transaction: any, error: any) => boolean;
type TransactionErrorCallback = (error: any) => void;
type TransactionSuccessCallback = () => void;

interface Expense {
  id?: number;
  amount: number;
  amount_in_home_currency: number;
  home_currency: string;
  selected_currency: string;
  country_id: number;
  expense_types: string;
  date: number;
}

interface CustomCategory {
  id?: number;
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
    // Use getAllAsync directly for both queries
    Promise.all([
      db.getAllAsync<Expense>('SELECT * FROM expenses'),
      db.getAllAsync<CustomCategory>('SELECT key, text, color, icon FROM custom_categories')
    ])
    .then(([expenses, customCategories]) => {
      const exportData: ExportData = {
        expenses,
        customCategories,
      };
      resolve(JSON.stringify(exportData, null, 2));
    })
    .catch(error => {
      console.error("Error dumping database:", error);
      reject(error);
    });
  });
}

// Function to verify the database after import
function verifyDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    Promise.all([
      db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM expenses'),
      db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM custom_categories')
    ])
    .then(([expensesCount, categoriesCount]) => {
      const expenseCount = expensesCount[0]?.count || 0;
      const categoryCount = categoriesCount[0]?.count || 0;
      console.log(`Database verification: Found ${expenseCount} expenses and ${categoryCount} custom categories`);
      resolve();
    })
    .catch(error => {
      console.error("Error verifying database:", error);
      reject(error);
    });
  });
}

// Function to check if the imported data has the correct structure
function validateImportData(data: any): ExportData {
  console.log("Validating import data structure...");
  
  // Check if data is an object
  if (!data || typeof data !== 'object') {
    console.error("Invalid data format: not an object");
    throw new Error("Invalid data format: not an object");
  }
  
  // Handle old format (array of expenses only)
  if (Array.isArray(data)) {
    console.log("Detected old format (array of expenses only)");
    return {
      expenses: data.map(expense => ({
        ...expense,
        // Ensure expense_types is valid
        expense_types: expense.expense_types || "other"
      })),
      customCategories: []
    };
  }
  
  // Check if expenses property exists and is an array
  if (!Array.isArray(data.expenses)) {
    console.warn("Invalid or missing expenses array, using empty array");
    data.expenses = [];
  }
  
  // Check if customCategories property exists and is an array
  if (!Array.isArray(data.customCategories)) {
    console.warn("Invalid or missing customCategories array, using empty array");
    data.customCategories = [];
  }
  
  // Validate each expense object
  data.expenses = data.expenses.map((expense: any, index: number) => {
    // Ensure all required fields exist
    if (typeof expense.amount !== 'number') {
      console.warn(`Expense ${index} has invalid amount, setting to 0`);
      expense.amount = 0;
    }
    
    if (typeof expense.amount_in_home_currency !== 'number') {
      console.warn(`Expense ${index} has invalid amount_in_home_currency, setting to 0`);
      expense.amount_in_home_currency = 0;
    }
    
    if (!expense.home_currency) {
      console.warn(`Expense ${index} has invalid home_currency, setting to USD`);
      expense.home_currency = 'USD';
    }
    
    if (!expense.selected_currency) {
      console.warn(`Expense ${index} has invalid selected_currency, setting to USD`);
      expense.selected_currency = 'USD';
    }
    
    if (typeof expense.country_id !== 'number') {
      console.warn(`Expense ${index} has invalid country_id, setting to 1`);
      expense.country_id = 1;
    }
    
    if (!expense.expense_types) {
      console.warn(`Expense ${index} has invalid expense_types, setting to other`);
      expense.expense_types = 'other';
    }
    
    if (typeof expense.date !== 'number' && typeof expense.date !== 'string') {
      console.warn(`Expense ${index} has invalid date, setting to current time`);
      expense.date = Math.floor(Date.now() / 1000);
    }
    
    return expense;
  });
  
  // Validate each custom category object
  data.customCategories = data.customCategories.map((category: any, index: number) => {
    if (!category.key) {
      console.warn(`Category ${index} has invalid key, generating a new one`);
      category.key = `custom_${index}_${Date.now()}`;
    }
    
    if (!category.text) {
      console.warn(`Category ${index} has invalid text, using key as text`);
      category.text = category.key;
    }
    
    if (!category.color) {
      console.warn(`Category ${index} has invalid color, setting to default`);
      category.color = '#8b7c93';
    }
    
    if (!category.icon) {
      console.warn(`Category ${index} has invalid icon, setting to other`);
      category.icon = 'other';
    }
    
    return category;
  });
  
  console.log("Data validation complete");
  return data as ExportData;
}

export async function restoreDb(dump: string) {
  try {
    // Parse and validate the imported data
    const rawData = JSON.parse(dump);
    const data = validateImportData(rawData);
    
    const expenses = data.expenses || [];
    const customCategories = data.customCategories || [];

    console.log(`Importing ${expenses.length} expenses and ${customCategories.length} custom categories`);
    
    // First, process custom categories to ensure they're available for expense validation
    const customCategoryKeys = new Set(customCategories.map(cat => cat.key));
    
    // Check for any potential issues with the data
    const validExpenses = expenses.filter(expense => {
      if (!expense.expense_types) {
        console.warn("Found expense with missing expense_types, will be set to 'other'");
        expense.expense_types = "other";
      }
      
      // Log if expense type is not in default list or custom categories
      if (!customCategoryKeys.has(expense.expense_types) && 
          !["rent", "flights", "food", "groceries", "cafe", "taxi", "entertainment", 
            "metro", "souvenir", "insurance", "clothes", "electronics", "health", 
            "beauty", "savings", "other"].includes(expense.expense_types)) {
        console.warn(`Expense has non-standard type: ${expense.expense_types}`);
      }
      
      return true; // Keep all expenses, we'll handle unknown types gracefully
    });

    console.log(`Found ${validExpenses.length} valid expenses to import`);

    try {
      // Begin transaction
      await db.runAsync('BEGIN TRANSACTION');
      
      // Clear existing data
      await db.runAsync('DELETE FROM expenses');
      await db.runAsync('DELETE FROM custom_categories');
      
      // Import custom categories first
      if (customCategories.length > 0) {
        console.log(`Importing ${customCategories.length} custom categories...`);
        for (let i = 0; i < customCategories.length; i++) {
          const category = customCategories[i];
          if (i % 10 === 0 || i === customCategories.length - 1) {
            console.log(`Importing category ${i + 1}/${customCategories.length}: ${category.key}`);
          }
          
          await db.runAsync(
            `INSERT INTO custom_categories (key, text, color, icon) VALUES (?, ?, ?, ?)`,
            [
              category.key,
              category.text,
              category.color,
              category.icon || 'other', // Ensure icon has a default value
            ]
          );
        }
      } else {
        console.log("No custom categories to import");
      }
      
      // Import expenses
      if (validExpenses.length > 0) {
        console.log(`Importing ${validExpenses.length} expenses...`);
        for (let i = 0; i < validExpenses.length; i++) {
          const expense = validExpenses[i];
          // Log every 10th expense for debugging
          if (i % 10 === 0 || i === validExpenses.length - 1) {
            console.log(`Importing expense ${i + 1}/${validExpenses.length}: ${expense.expense_types}`);
          }
          
          await db.runAsync(
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
        }
      } else {
        console.log("No expenses to import");
      }
      
      // Commit transaction
      await db.runAsync('COMMIT');
      console.log("Import completed successfully");
      
      // Verify the database after import
      await verifyDatabase();
    } catch (error) {
      // Rollback on error
      await db.runAsync('ROLLBACK');
      console.error("Error during import, rolling back:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error parsing or processing data:", error);
    throw error;
  }
}
