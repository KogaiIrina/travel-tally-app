import React from "react";
import {
  Alert,
  StyleSheet,
  Pressable,
  Platform,
  View,
  Text,
} from "react-native";
import useExpenses from "../../../db/hooks/useExpenses";
import SettingsIcon from "./icons/settings";
import exportFile from "./utils/export";
import importFile from "./utils/importFile";
import { restoreDb } from "./utils/dataRestore";
import { Actionsheet, Box, Button, useDisclose } from "native-base";
import HomeCurrencyButton from "../input/HomeCurrencyButton";
import useHomeCountry from "../../../db/hooks/useHomeCountry";

export default function DataSettingsButton() {
  const { data: expenses, isLoading } = useExpenses({});
  const { data: homeCountry } = useHomeCountry();

  function exportData() {
    if (!expenses) {
      return;
    }

    const json = JSON.stringify(expenses);

    const filename = `traveltally-export-${new Date().toISOString()}.json`;
    exportFile(json, filename, "application/json")
      .then(() => Platform.OS === "android" && Alert.alert("Export Successful"))
      .catch((error: any) => {
        if (error) {
          Alert.alert("Export Failed", error.message);
        }
      });
  }

  function importData() {
    if (!expenses) {
      return;
    }

    importFile("application/json")
      .then((content) => {
        if (!content) {
          return;
        }
        Alert.alert(
          "Import Data",
          "This will overwrite your current data." +
            " Your data is stored only on your phone and in the backups, you have made yourself." +
            " If your backup is broken, your data will become unrecoverable." +
            "\nDo you want to proceed?",
          [
            { text: "Cancel" },
            {
              text: "OK",
              onPress: () => {
                try {
                  restoreDb(content);
                  Alert.alert("Import Successful");
                } catch (error) {
                  Alert.alert("Import Failed", (error as Error)?.message);
                }
              },
            },
          ]
        );
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Import Failed", error.message);
      });
  }

  const { isOpen, onOpen, onClose } = useDisclose();

  const onButtonPress = () => {
    onOpen();
  };

  return (
    <>
      <Pressable style={styles.button} onPress={onButtonPress}>
        <SettingsIcon />
      </Pressable>
      <Actionsheet
        style={styles.container}
        isOpen={isOpen}
        onClose={onClose}
        hideDragIndicator
      >
        <Actionsheet.Content>
          <Box style={styles.header}>
            <Text style={styles.text}>Settings</Text>
          </Box>
          <View style={styles.selectorsBox}>
            <Actionsheet.Item
              style={{
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.buttonGroup}>
                <Button
                  style={styles.exportImportButton}
                  onPress={exportData}
                  disabled={isLoading}
                >
                  <Text style={styles.text}>Export Data</Text>
                </Button>
                <Button style={styles.exportImportButton} onPress={importData}>
                  <Text style={styles.text}>Import Data</Text>
                </Button>
                {!homeCountry && <HomeCurrencyButton />}
              </View>
            </Actionsheet.Item>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    width: "100%",
    paddingTop: 20,
  },
  buttonGroup: {
    height: 60,
    alignContent: "center",
    width: "100%",
  },
  selectorsBox: {
    height: 200,
    width: "100%",
  },
  button: {
    backgroundColor: "#1C1D1F",
    height: 40,
    width: 40,
    color: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#EDEAEA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 5,
  },
  exportImportButton: {
    height: 50,
    width: 330,
    backgroundColor: "#F3F6FF",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: "#C3C5F3",
  },
  text: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 21,
    color: "#494EBF",
  },
  header: {
    justifyContent: "center",
    paddingTop: 20,
  },
});
