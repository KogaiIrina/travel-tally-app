import React from "react";
import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import useTrips, { useDeleteTrip, useSetActiveTrip, useActiveTrip } from "../db/hooks/useTrips";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CreateTripModal from "./components/trips/CreateTripModal";
import { useDisclose } from "native-base";
import BlueButton from "./components/BlueButton";
import { Ionicons } from "@expo/vector-icons";
import useHomeCountry from "../db/hooks/useHomeCountry";
import { formatNumber } from "../utils/formatNumber";
import { currencyList } from "../utils/currencyList";

interface TripsScreenProps {
  onSelectTrip: (id: number) => void;
}

export default function TripsScreen({ onSelectTrip }: TripsScreenProps) {
  const { data: trips } = useTrips();
  const { data: homeCountry } = useHomeCountry();
  const { mutate: deleteTrip } = useDeleteTrip();
  const { mutate: setActiveTrip } = useSetActiveTrip();
  const { data: activeTrip } = useActiveTrip();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclose();

  const rightSwipeActions = (id: number) => (
    <Pressable
      onPress={() => deleteTrip(id)}
      style={{
        backgroundColor: "#D0312D",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 8,
        borderRadius: 12,
        width: 100,
      }}
    >
      <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
        Delete
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Destinations</Text>
          <Pressable onPress={onCreateOpen} style={styles.headerAddButton}>
            <Text style={styles.headerAddText}>Add Destination</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <GestureHandlerRootView>
            <Swipeable renderRightActions={() => rightSwipeActions(item.id)}>
              <Pressable
                style={styles.tripCard}
                onPress={() => onSelectTrip(item.id)}
              >
                <View style={styles.tripInfo}>
                  <Text style={styles.tripName}>{item.name}</Text>
                  <Text style={styles.tripDetails}>
                    {item.country} {item.flag} • {item.base_currency} ➔ {item.target_currency}
                  </Text>
                  <Text style={styles.tripTotalInfo}>
                    Total Spent: {currencyList[homeCountry?.currency as keyof typeof currencyList] || "$"}{formatNumber(Number(((item.total_spent || 0) / 100).toFixed(2)))}
                  </Text>
                </View>
                <Pressable
                  style={[styles.activeButton, item.is_active ? styles.activeButtonOn : styles.activeButtonOff]}
                  onPress={() => setActiveTrip(item.id)}
                >
                  <Text style={[styles.activeButtonText, item.is_active && styles.activeButtonTextOn]}>
                    {item.is_active ? "Active" : "Set Active"}
                  </Text>
                </Pressable>
              </Pressable>
            </Swipeable>
          </GestureHandlerRootView>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={80} color="#CCC" style={{ marginBottom: 20 }} />
            <Text style={styles.emptyTitle}>No Destinations Yet</Text>
            <Text style={styles.emptyText}>Create your first trip to start organizing your travel expenses.</Text>
            <Pressable style={styles.emptyCreateButton} onPress={onCreateOpen}>
              <Text style={styles.emptyCreateButtonText}>+ Add New Destination</Text>
            </Pressable>
          </View>
        }
      />

      <CreateTripModal isOpen={isCreateOpen} onClose={onCreateClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActionLeft: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerAddButton: {
    backgroundColor: "#E8EEFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAddText: {
    color: "#4169E1",
    fontSize: 14,
    fontWeight: "700",
  },
  headerTitle: { color: "#1A1A1A", fontSize: 24, fontWeight: "700" },
  listContent: { padding: 16, paddingBottom: 40 },
  tripCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tripInfo: { flex: 1 },
  tripName: { fontSize: 18, fontWeight: "600", marginBottom: 4, paddingRight: 8 },
  tripDetails: { fontSize: 14, color: "#666", marginBottom: 6 },
  tripTotalInfo: { fontSize: 14, color: "#1A1A1A", fontWeight: "600" },
  activeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeButtonOn: { backgroundColor: "#4169E1", borderColor: "#4169E1" },
  activeButtonOff: { backgroundColor: "transparent", borderColor: "#4169E1" },
  activeButtonText: { color: "#4169E1", fontSize: 13, fontWeight: "600" },
  activeButtonTextOn: { color: "#FFF" },
  emptyState: { padding: 40, alignItems: "center", justifyContent: "center", marginTop: 40 },
  emptyTitle: { color: "#333", fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  emptyText: { color: "#777", fontSize: 16, textAlign: "center", marginBottom: 30, lineHeight: 24 },
  emptyCreateButton: {
    backgroundColor: "#4169E1",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#4169E1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyCreateButtonText: {
    color: "#FFF",
    fontSize: 18,
    shadowRadius: 8,
    elevation: 5,
  },
});
