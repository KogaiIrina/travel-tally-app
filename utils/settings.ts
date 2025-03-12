import * as FileSystem from "expo-file-system";
import { QueryClient, useQuery, useQueryClient } from "react-query";

const CACHE_KEY_SETTING = (key: string) => ["useSetting", key];
const SETTINGS_PATH = FileSystem.documentDirectory + "settings.json";

let globalSettings: Record<string, any> = {};

export async function loadSettings(queryClient?: QueryClient) {
  const settingsFileInfo = await FileSystem.getInfoAsync(SETTINGS_PATH);
  if (!settingsFileInfo.exists) {
    return;
  }
  const settings = await FileSystem.readAsStringAsync(SETTINGS_PATH);
  globalSettings = JSON.parse(settings);
  // invalidate cache for all settings
  queryClient?.invalidateQueries("useSetting");
}

async function saveSettings() {
  const settings = JSON.stringify(globalSettings);
  await FileSystem.writeAsStringAsync(SETTINGS_PATH, settings);
}

export function useSetting<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void];
export function useSetting<T>(
  key: string,
  defaultValue?: T
): [T | undefined, (value: T) => void];

export function useSetting<T>(
  key: string,
  defaultValue?: T
): [T | undefined, (value: T) => void] {
  const queryClient = useQueryClient();
  const queryKey = CACHE_KEY_SETTING(key);

  const setSetting = (value: T) => {
    globalSettings[key] = value;
    queryClient.invalidateQueries(queryKey);
    // TODO: debounce the saveSettings call
    saveSettings().catch(console.error);
  };

  const queryResult = useQuery<T>(
    queryKey,
    () => globalSettings[key] ?? defaultValue
  );

  return [queryResult.data ?? defaultValue, setSetting];
}
