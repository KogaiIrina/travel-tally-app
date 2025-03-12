import { useQuery } from "react-query";
import dbRead from "../utils/read";
import { TotalSum } from "../../utils/types";

export interface UseExpensesFilter {
  paymentCountryId?: number;
  category?: string;
  monthYear?: string;
}

export const USE_TOTAL_EXPENSES_QUERY_KEY = "useTotalExpenses";

export default function useTotalExpenses({
  paymentCountryId,
  category,
  monthYear,
}: UseExpensesFilter) {
  return useQuery(
    [USE_TOTAL_EXPENSES_QUERY_KEY, paymentCountryId, category, monthYear],
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
        filters.push("expenses.date >= ? AND expenses.date < ?");
        values.push(Math.floor(+from / 1000));
        values.push(Math.floor(+to / 1000));
      }

      return dbRead<TotalSum>(
        "SELECT SUM(amount_in_home_currency) as total FROM expenses, home_country, countries" +
          " WHERE home_country.home_country_id = countries.id AND expenses.home_currency = countries.currency" +
          (filters.length ? ` AND ${filters.join(" AND ")}` : ""),
        values
      );
    }
  );
}
