import { useQuery } from "@tanstack/react-query";
import dbRead from "../utils/read";

const USE_MONTHS_QUERY_KEY = "useMonths";

export default function useMonths() {
  return useQuery({
    queryKey: [USE_MONTHS_QUERY_KEY],
    queryFn: async () => {
      const expenses = await dbRead<{ monthYear: string }>(
        "SELECT strftime('%Y-%m', datetime(expenses.date, 'unixepoch')) as monthYear" +
        " FROM expenses" +
        " GROUP BY monthYear" +
        " ORDER BY monthYear DESC"
      );

      return expenses.map(({ monthYear }) => {
        const [year, month] = monthYear.split("-");
        if (!year || !month) {
          return "-";
        }
        const date = new Date(Number(year), Number(month) - 1);
        const monthName = date.toLocaleString("en-GB", { month: "long" });
        return `${monthName} ${year}`;
      });
    },
  });
}
