import { useQuery } from '@tanstack/react-query';

export const USE_EXCHANGE_RATE_QUERY_KEY = 'useExchangeRate';

// Extract the currency fetching logic from BlueButton to heavily cache and background-fetch these values before they're needed.
export default function useExchangeRate({
  selectedCurrency,
  homeCurrency,
  isoDate
}: {
  selectedCurrency?: string;
  homeCurrency?: string;
  isoDate: string;
}) {
  return useQuery({
    queryKey: [USE_EXCHANGE_RATE_QUERY_KEY, selectedCurrency, homeCurrency, isoDate],
    queryFn: async () => {
      // Do not attempt to query if we lack source/target params
      if (!selectedCurrency || !homeCurrency) {
        return undefined;
      }

      const homeCurrencyLowerCase = homeCurrency.toLowerCase();
      const selectedCurrencyLowerCase = selectedCurrency.toLowerCase();

      console.log(`[useExchangeRate] Prefetching ${selectedCurrencyLowerCase} -> ${homeCurrencyLowerCase} for ${isoDate}`);

      let currentRateInfo: Response;

      try {
        currentRateInfo = await fetch(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${isoDate}/v1/currencies/${selectedCurrencyLowerCase}.json`
        );

        if (!currentRateInfo.ok) {
          const fallbackUrl = `https://${isoDate}.currency-api.pages.dev/v1/currencies/${selectedCurrencyLowerCase}.json`;
          currentRateInfo = await fetch(fallbackUrl);
        }

        // Add fallback to 'latest' if the specific date is not yet available (often happens for today's date)
        if (!currentRateInfo.ok) {
          const latestUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${selectedCurrencyLowerCase}.json`;
          currentRateInfo = await fetch(latestUrl);
        }

        if (!currentRateInfo.ok) {
          const latestFallbackUrl = `https://latest.currency-api.pages.dev/v1/currencies/${selectedCurrencyLowerCase}.json`;
          currentRateInfo = await fetch(latestFallbackUrl);
        }

        if (!currentRateInfo.ok) {
          throw new Error("All primary and fallback currency fetches failed");
        }

        const currentRate = await currentRateInfo.json();

        if (selectedCurrencyLowerCase && homeCurrencyLowerCase) {
          return currentRate[selectedCurrencyLowerCase][homeCurrencyLowerCase];
        }
      } catch (error) {
        console.error('[useExchangeRate] error fetching:', error);
        throw error;
      }

      return undefined;
    },
    // We only want to enable this if currencys are selected
    enabled: Boolean(selectedCurrency) && Boolean(homeCurrency),
    // Stale time set to Infinity effectively since past dates' exchange rates do not change
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours caching in garbage collector
  });
}
