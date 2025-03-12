import { StorageAccessFramework } from "expo-file-system";

const DOWNLOADS_LIBRARY = "Download";

export default async function exportFile(
  content: string,
  filename: string,
  mimetype: string
) {
  const downloadsUri =
    StorageAccessFramework.getUriForDirectoryInRoot(DOWNLOADS_LIBRARY);

  const permissions =
    await StorageAccessFramework.requestDirectoryPermissionsAsync(downloadsUri);
  if (!permissions.granted) {
    throw new Error("Permission to access downloads folder was not granted");
  }

  const uri = await StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    filename,
    mimetype
  );
  await StorageAccessFramework.writeAsStringAsync(uri, content);
}
