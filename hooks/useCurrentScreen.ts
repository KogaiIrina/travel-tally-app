import { useQuery, useQueryClient } from "react-query";

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
  const result = useQuery<CurrentScreen>(
    ["useCurrentScreen"],
    () => currentScreen
  );
  const setCurrentScreen = (screen: CurrentScreen) => {
    currentScreen = screen;
    queryClient.invalidateQueries("useCurrentScreen");
  };
  return [result.data || CurrentScreen.Home, setCurrentScreen];
}
