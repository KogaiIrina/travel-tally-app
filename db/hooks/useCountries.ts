import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import dbRead from "../utils/read";
import dbWrite from "../utils/write";
import { CountryType } from "../../utils/types";

const USE_COUNTRIES_QUERY_KEY = "useCountries";

export default function useCountries() {
  return useQuery({
    queryKey: [USE_COUNTRIES_QUERY_KEY],
    queryFn: async () => {
      return await dbRead<CountryType>("SELECT * FROM countries");
    },
  });
}

export function useCountriesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      country,
      flag,
      currency,
    }: {
      country: string;
      flag: string;
      currency: string;
    }) => {
      return dbWrite(
        "INSERT INTO countries (country, flag, currency) values (?, ?, ?)",
        [country, flag, currency]
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [USE_COUNTRIES_QUERY_KEY] }),
  });
}

export function useCountryById(
  id: number | undefined
): UseQueryResult<CountryType | undefined> {
  return useQuery({
    queryKey: ["country", id],
    queryFn: async () => {
      if (id === undefined) {
        throw new Error("id is undefined");
      }
      const data = await dbRead<CountryType>(
        "SELECT * FROM countries WHERE id = ?",
        [id]
      );
      return data[0];
    },
    enabled: id !== undefined,
  });
}
