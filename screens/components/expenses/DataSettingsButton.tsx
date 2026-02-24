import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Pressable,
  Platform,
  View,
  Text,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import useExpenses from "../../../db/hooks/useExpenses";
import SettingsIcon from "./icons/settings";
import exportFile from "./utils/export";
import importFile from "./utils/importFile";
import { restoreDb, dumpDb } from "./utils/dataRestore";
import { useDisclose } from "../../../utils/useDisclose";
import HomeCurrencyButton from "../input/HomeCurrencyButton";
import useHomeCountry from "../../../db/hooks/useHomeCountry";
import { useQueryClient } from "@tanstack/react-query";
import { useRevenueCat } from "../../../utils/RevenueCatProvider";
import { updateSubscriptionCache, triggerGlobalSubscriptionRefresh } from "../../../utils/useSubscriptionStatus";

export default function DataSettingsButton() {
  const queryClient = useQueryClient();
  const { data: expenses, isLoading } = useExpenses({});
  const { data: homeCountry } = useHomeCountry();
  const { restorePermissions } = useRevenueCat() || {};
  const [isRestoring, setIsRestoring] = useState(false);

  function exportData() {
    if (!expenses) {
      return;
    }

    dumpDb()
      .then(json => {
        const filename = `traveltally-export-${new Date().toISOString()}.json`;
        exportFile(json, filename, "application/json")
          .then(() => Platform.OS === "android" && Alert.alert("Export Successful"))
          .catch((error: any) => {
            if (error) {
              Alert.alert("Export Failed", error.message);
            }
          });
      })
      .catch(error => {
        Alert.alert("Export Failed", error.message);
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
              onPress: async () => {
                try {
                  await restoreDb(content);
                  queryClient.invalidateQueries();
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

  const handleRestorePurchases = async () => {
    if (!restorePermissions) return;
    setIsRestoring(true);
    try {
      const customerInfo = await restorePermissions();
      console.log("RESTORED CUSTOMER INFO:", JSON.stringify(customerInfo, null, 2));

      if (
        Object.keys(customerInfo.entitlements.active).length > 0 ||
        customerInfo.activeSubscriptions.length > 0
      ) {
        updateSubscriptionCache(true);
        triggerGlobalSubscriptionRefresh();
        Alert.alert("Success", "Your purchases have been successfully restored.");
      } else {
        Alert.alert("No Purchases Found", "We couldn't find any active subscriptions to restore.");
      }
    } catch (error: any) {
      Alert.alert("Restore Failed", error.message || "An error occurred while restoring purchases.");
    } finally {
      setIsRestoring(false);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclose();

  const onButtonPress = () => {
    onOpen();
  };

  return (
    <>
      <Pressable style={styles.button} onPress={onButtonPress}>
        <SettingsIcon />
      </Pressable>
      <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.text}>Settings</Text>
          </View>
          <View style={styles.selectorsBox}>
            <View
              style={{
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                paddingHorizontal: 20,
              }}
            >
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.exportImportButton, isLoading && styles.buttonDisabled]}
                  onPress={exportData}
                  disabled={isLoading}
                >
                  <Text style={styles.text}>Export Data</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportImportButton} onPress={importData}>
                  <Text style={styles.text}>Import Data</Text>
                </TouchableOpacity>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[Platform.OS === 'ios' ? styles.exportImportButton : styles.exportImportButtonLast, isRestoring && styles.buttonDisabled]}
                    onPress={handleRestorePurchases}
                    disabled={isRestoring}
                  >
                    {isRestoring ? (
                      <ActivityIndicator color="#1A1A1A" />
                    ) : (
                      <Text style={styles.text}>Restore Purchases</Text>
                    )}
                  </TouchableOpacity>
                )}
                <View style={{ paddingTop: 16, width: "100%" }}>
                  {!homeCountry && <HomeCurrencyButton />}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
  },
  selectorsBox: {
    height: 280,
    width: "100%",
  },
  button: {
    backgroundColor: "#FFFFFF",
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  exportImportButton: {
    height: 56,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  exportImportButtonLast: {
    height: 56,
    width: "100%",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1A1A1A",
  },
  header: {
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "90%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#D0D0D0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
