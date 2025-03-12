import { useMutation, useQuery, useQueryClient } from "react-query";
import dbRead from "../utils/read";
import dbWrite from "../utils/write";
import { CountryType, ExpensesType } from "../../utils/types";
import { USE_TOTAL_EXPENSES_QUERY_KEY } from "./useTotalExpenses";

const USE_EXPENSES_QUERY_KEY = "useExpenses";
const USE_GROUPED_EXPENSES_QUERY_KEY = "useGroupedExpenses";

export type ExpandedExpenseType = ExpensesType & CountryType;

export interface UseExpensesFilter {
  paymentCountryId?: number;
  category?: string;
  monthYear?: string;
}

export interface UseExpensesStatistics {
  paymentCountryId?: number;
  category?: string;
  monthYear?: string;
  dateStart?: Date;
  dateEnd?: Date;
}
export interface UseGroupedExpenses {
  expense_types: string;
  total_amount: number;
  total_home_currency_amount: number;
  count: number;
  country: string;
  flag: string;
  selected_currency: string;
  percentage: number;
}

export default function useExpenses({
  paymentCountryId,
  category,
  monthYear,
}: UseExpensesFilter) {
  return useQuery(
    [USE_EXPENSES_QUERY_KEY, paymentCountryId, category, monthYear],
    () => {
      const filters = [];
      const values = [];

      if (paymentCountryId) {
        filters.push("expenses.country_id = ?");
        values.push(paymentCountryId);
      }

      if (category) {
        filters.push("expenses.expense_types = ?");
        values.push(category);
      }

      if (monthYear) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const [monthName, year] = monthYear.split(" ");
        const month = monthNames.indexOf(monthName) + 1;
        const from = new Date(`${year}-${month}-01`);
        const to = new Date(new Date(from).setMonth(from.getMonth() + 1));
        filters.push("expenses.date >= ? AND expenses.date <= ?");
        values.push(Math.floor(+from / 1000));
        values.push(Math.floor(+to / 1000));
      }

      return dbRead<ExpandedExpenseType>(
        "SELECT expenses.*, countries.country, countries.flag, expenses.selected_currency" +
          " FROM expenses, countries" +
          " WHERE expenses.country_id = countries.id" +
          (filters.length ? ` AND ${filters.join(" AND ")}` : "") +
          " ORDER BY expenses.date DESC",
        values
      );
    }
  );
}

export function useGroupedExpenses({
  paymentCountryId,
  category,
  dateStart,
  dateEnd,
}: UseExpensesStatistics) {
  return useQuery(
    [
      USE_GROUPED_EXPENSES_QUERY_KEY,
      paymentCountryId,
      category,
      dateStart,
      dateEnd,
    ],
    async () => {
      const filters = [];
      const values = [];

      if (paymentCountryId) {
        filters.push("expenses.country_id = ?");
        values.push(paymentCountryId);
      }

      if (category) {
        filters.push("expenses.expense_types = ?");
        values.push(category);
      }

      if (dateStart && dateEnd) {
        const from = new Date(dateStart).getTime() / 1000;
        const to = new Date(dateEnd).getTime() / 1000;
        filters.push("expenses.date BETWEEN ? AND ?");
        values.push(from, to);
      }

      const whereClause = filters.length
        ? `WHERE ${filters.join(" AND ")}`
        : "";

      const totalHomeCurrencyAmountResult = await dbRead<{ total: number }>(
        `SELECT SUM(amount_in_home_currency) as total FROM expenses ${whereClause}`,
        values
      );

      const totalHomeCurrencyAmount =
        totalHomeCurrencyAmountResult[0]?.total || 1;

      const groupedExpenses = await dbRead<UseGroupedExpenses>(
        `SELECT expenses.expense_types, 
                SUM(expenses.amount) as total_amount, 
                SUM(expenses.amount_in_home_currency) as total_home_currency_amount, 
                COUNT(expenses.id) as count, 
                countries.country, 
                countries.flag, 
                expenses.selected_currency 
         FROM expenses 
         JOIN countries ON expenses.country_id = countries.id 
         ${whereClause} 
         GROUP BY expenses.expense_types 
         ORDER BY expenses.expense_types`,
        values
      );

      const formattedExpenses = groupedExpenses.map((expense) => {
        const percentage =
          (expense.total_home_currency_amount / totalHomeCurrencyAmount) * 100;
        return {
          ...expense,
          percentage: parseFloat(percentage.toFixed(2)),
        };
      });
      return formattedExpenses;
    }
  );
}

export function useAddExpense() {
  const queryClient = useQueryClient();
  return useMutation(
    (expense: Omit<ExpensesType, "id">) =>
      dbWrite(
        `INSERT INTO expenses 
         (amount, amount_in_home_currency, home_currency, selected_currency, country_id, expense_types, date) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.amount,
          expense.amount_in_home_currency,
          expense.home_currency,
          expense.selected_currency,
          expense.country_id,
          expense.expense_types,
          Math.floor(+expense.date / 1000),
        ]
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([USE_EXPENSES_QUERY_KEY]);
        queryClient.invalidateQueries([USE_TOTAL_EXPENSES_QUERY_KEY]);
        queryClient.invalidateQueries([USE_GROUPED_EXPENSES_QUERY_KEY]);
      },
    }
  );
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: number) => dbWrite("DELETE FROM expenses WHERE id = ?", [id]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USE_EXPENSES_QUERY_KEY);
        queryClient.invalidateQueries(USE_TOTAL_EXPENSES_QUERY_KEY);
        queryClient.invalidateQueries(USE_GROUPED_EXPENSES_QUERY_KEY);
      },
    }
  );
}
