import { useQuery, useQueryClient, UseQueryResult } from "react-query";
import dbRead from "../utils/read";
import dbWrite from "../utils/write";
import { CountryType } from "../../utils/types";

const USE_CURRENT_COUNTRY_QUERY_KEY = "useCurrentCountry";

type UseCurrentCountryResult = UseQueryResult<CountryType> & {
  setCurrentCountry: (countryId: number) => Promise<void>;
};

export default function useCurrentCountry(): UseCurrentCountryResult {
  const queryClient = useQueryClient();

  const queryResult = useQuery(USE_CURRENT_COUNTRY_QUERY_KEY, async () => {
    const countries = await dbRead<CountryType>(
      "SELECT countries.* FROM countries, country WHERE countries.id = country.current_country"
    );
    return countries[0];
  });

  async function setCurrentCountry(countryId: number): Promise<void> {
    await dbWrite(
      "INSERT INTO country (id, current_country) VALUES (1, ?)" +
        " ON CONFLICT(id) DO UPDATE SET (id, current_country) = (1, ?)",
      [countryId, countryId]
    );
    queryClient.invalidateQueries(USE_CURRENT_COUNTRY_QUERY_KEY);
  }

  return { ...queryResult, setCurrentCountry };
}
