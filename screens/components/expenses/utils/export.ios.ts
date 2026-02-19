import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

export default async function exportFile(
  content: string,
  filename: string,
  mimetype: string
) {
  const uri = FileSystem.cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(uri, content);
  await Sharing.shareAsync(uri, { UTI: mimetype });
}
