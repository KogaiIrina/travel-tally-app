import { useQuery, useQueryClient } from "@tanstack/react-query";

export enum CurrentScreen {
  Home = "home",
  Expenses = "expenses",
}

let currentScreen: CurrentScreen = CurrentScreen.Home;

export function useCurrentScreen(): [
  CurrentScreen,
  (screen: CurrentScreen) => void
] {
  const queryClient = useQueryClient();
  const result = useQuery<CurrentScreen>({
    queryKey: ["useCurrentScreen"],
    queryFn: () => currentScreen,
  });
  const setCurrentScreen = (screen: CurrentScreen) => {
    currentScreen = screen;
    queryClient.invalidateQueries({ queryKey: ["useCurrentScreen"] });
  };
  return [result.data || CurrentScreen.Home, setCurrentScreen];
}
