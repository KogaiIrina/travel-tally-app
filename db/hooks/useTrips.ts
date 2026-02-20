import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dbRead from "../utils/read";
import dbWrite from "../utils/write";
import { TripType } from "../../utils/types";

export const USE_TRIPS_QUERY_KEY = "useTrips";
export const USE_ACTIVE_TRIP_QUERY_KEY = "useActiveTrip";

export type ExpandedTripType = TripType & { country: string; flag: string };

export default function useTrips() {
  return useQuery({
    queryKey: [USE_TRIPS_QUERY_KEY],
    queryFn: () => {
      // return trips with country details
      return dbRead<ExpandedTripType>(
        "SELECT trips.*, countries.country, countries.flag FROM trips LEFT JOIN countries ON trips.country_id = countries.id ORDER BY trips.start_date DESC, trips.id DESC"
      );
    },
  });
}

export function useActiveTrip() {
  return useQuery({
    queryKey: [USE_ACTIVE_TRIP_QUERY_KEY],
    queryFn: async () => {
      const trips = await dbRead<ExpandedTripType>(
        "SELECT trips.*, countries.country, countries.flag FROM trips LEFT JOIN countries ON trips.country_id = countries.id WHERE trips.is_active = 1 LIMIT 1"
      );
      return trips.length > 0 ? trips[0] : null;
    },
  });
}

export function useAddTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trip: Omit<TripType, "id" | "is_active">) => {
      const isActive = 1;

      // If the new trip is set as active, deactivate others
      if (isActive) {
        await dbWrite("UPDATE trips SET is_active = 0");
      }

      return dbWrite(
        `INSERT INTO trips (name, country_id, base_currency, target_currency, start_date, end_date, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          trip.name,
          trip.country_id,
          trip.base_currency,
          trip.target_currency,
          trip.start_date ? Math.floor(+trip.start_date / 1000) : null,
          trip.end_date ? Math.floor(+trip.end_date / 1000) : null,
          isActive
        ]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USE_TRIPS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USE_ACTIVE_TRIP_QUERY_KEY] });
    },
  });
}

export function useSetActiveTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await dbWrite("UPDATE trips SET is_active = 0");
      return dbWrite("UPDATE trips SET is_active = 1 WHERE id = ?", [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USE_TRIPS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USE_ACTIVE_TRIP_QUERY_KEY] });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      // First delete all expenses attached to this trip to avoid orphaned records
      await dbWrite("DELETE FROM expenses WHERE trip_id = ?", [id]);
      return dbWrite("DELETE FROM trips WHERE id = ?", [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USE_TRIPS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USE_ACTIVE_TRIP_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["useExpenses"] });
      queryClient.invalidateQueries({ queryKey: ["useGroupedExpenses"] });
    },
  });
}
