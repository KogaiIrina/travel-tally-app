import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

export default async function importFile(mimetype?: string) {
  const result = await DocumentPicker.getDocumentAsync({
    // iOS has issues with some mimetypes, like "application/json"
    type: Platform.OS === "ios" ? "*/*" : mimetype,
  });
  if (result.canceled) {
    return;
  }
  const content = await FileSystem.readAsStringAsync(result.assets[0]?.uri);
  return content;
}
