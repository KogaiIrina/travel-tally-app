import { useMutation, useQuery, useQueryClient } from "react-query";
import dbRead from "../utils/read";
import dbWrite from "../utils/write";
import { CountryType } from "../../utils/types";

const USE_HOME_CURRENCY_QUERY_KEY = "useHomeCurrency";

export default function useHomeCountry() {
  return useQuery(USE_HOME_CURRENCY_QUERY_KEY, async () => {
    const homeCountry = await dbRead<CountryType>(
      "SELECT countries.*" +
        " FROM home_country, countries" +
        " WHERE home_country.home_country_id = countries.id"
    );
    return homeCountry[0];
  });
}

export function useHomeCountryMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    (countryId: number) => {
      return dbWrite(
        "INSERT INTO home_country (id, home_country_id) VALUES (1, ?)" +
          " ON CONFLICT(id) DO UPDATE SET (id, home_country_id) = (1, ?)",
        [countryId, countryId]
      );
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(USE_HOME_CURRENCY_QUERY_KEY),
    }
  );
}
