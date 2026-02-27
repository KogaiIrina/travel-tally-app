import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";

const MODAL_HEIGHT = Dimensions.get("window").height * 0.82;
import { Ionicons } from "@expo/vector-icons";
import { useAddCustomCategory } from "../../../db/hooks/useCustomCategories";
import * as Icons from "./icons";

// Predefined colors that match the app's design
const COLORS = [
  "#A57865", "#FDC0A1", "#BB2649", "#6667AA", "#F7E00E",
  "#154A7D", "#F36F62", "#6E5B98", "#85AF48", "#91A6D0",
  "#F6CAC9", "#964F4D", "#B564A5", "#039775", "#686868",
  "#D94124", "#E66385", "#179A9D",
];

// Available icons with their components
const ICONS = [
  { name: "home", component: () => Icons.HomeIcon() },
  { name: "airplain", component: () => Icons.AirPlainIcon() },
  { name: "food", component: () => Icons.FoodIcon() },
  { name: "groceries", component: () => Icons.GroceriesIcon() },
  { name: "cup", component: () => Icons.CoffeeIcon() },
  { name: "car", component: () => Icons.CarIcon() },
  { name: "entertainment", component: () => Icons.EntertainmentIcon() },
  { name: "metro", component: () => Icons.TransportIcon() },
  { name: "gym", component: () => Icons.FitnessIcon() },
  { name: "shopping", component: () => Icons.ShoppingIcon() },
  { name: "umbrella", component: () => Icons.InsuranceIcon() },
  { name: "tshirt", component: () => Icons.ClothesIcon() },
  { name: "display", component: () => Icons.ElectronicsIcon() },
  { name: "pharmacy", component: () => Icons.HealthIcon() },
  { name: "beauty", component: () => Icons.BeautyIcon() },
  { name: "savings", component: () => Icons.InvestmentIcon() },
  { name: "pets", component: () => Icons.PetsIcon() },
  { name: "utility", component: () => Icons.UtilityIcon() },
  { name: "spa", component: () => Icons.SpaIcon() },
  { name: "phone", component: () => Icons.PhoneIcon() },
  { name: "hotel", component: () => Icons.HotelIcon() },
  { name: "bus", component: () => Icons.BusIcon() },
  { name: "flower", component: () => Icons.FlowerIcon() },
  { name: "runningShoe", component: () => Icons.RunningShoeIcon() },
  { name: "cat", component: () => Icons.CatIcon() },
  { name: "dog", component: () => Icons.DogIcon() },
  { name: "palmTree", component: () => Icons.PalmTreeIcon() },
  { name: "tickets", component: () => Icons.TicketsIcon() },
  { name: "camera", component: () => Icons.CameraIcon() },
  { name: "children", component: () => Icons.ChildrenIcon() },
  { name: "gift", component: () => Icons.GiftIcon() },
  { name: "books", component: () => Icons.BooksIcon() },
  { name: "studying", component: () => Icons.StudyingIcon() },
  { name: "sofa", component: () => Icons.FurnitureIcon() },
  { name: "other", component: () => Icons.OtherIcon() },
];

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onClose }) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0].name);
  const { mutate: addCustomCategory } = useAddCustomCategory();

  const handleSave = () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    const key = categoryName.toLowerCase().replace(/\s+/g, "_");

    addCustomCategory(
      {
        key,
        text: categoryName,
        color: selectedColor,
        icon: selectedIcon,
      },
      {
        onSuccess: () => {
          setCategoryName("");
          setSelectedColor(COLORS[0]);
          setSelectedIcon(ICONS[0].name);
          onClose();
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to add category. Please try again.");
          console.error(error);
        },
      }
    );
  };

  const isActive = !!categoryName.trim();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Add New Category</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Scrollable content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formGroup}>
              <Text style={styles.label}>CATEGORY NAME</Text>
              <TextInput
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name"
                placeholderTextColor="#AAAAAA"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>SELECT COLOR</Text>
              <View style={styles.colorGrid}>
                {COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorItem,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorItem,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>SELECT ICON</Text>
              <View style={styles.iconGrid}>
                {ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon.name}
                    style={[
                      styles.iconItem,
                      selectedIcon === icon.name && styles.selectedIconItem,
                    ]}
                    onPress={() => setSelectedIcon(icon.name)}
                  >
                    <View style={styles.iconWrapper}>
                      {icon.component()}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveButton, isActive ? styles.saveButtonActive : styles.saveButtonInactive]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={[styles.saveButtonText, !isActive && styles.saveButtonTextInactive]}>
                Save Category
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    height: MODAL_HEIGHT,
    backgroundColor: "#F7F8FA",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8E8ED",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#AAAAAA",
    letterSpacing: 1,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1A1A1A",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorItem: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedColorItem: {
    borderWidth: 3,
    borderColor: "#2C65E1",
    shadowColor: "#2C65E1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  iconItem: {
    borderRadius: 12,
    padding: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C65E1",
    borderRadius: 24,
    overflow: "hidden",
  },
  selectedIconItem: {
    backgroundColor: "rgba(44, 101, 225, 0.15)",
    borderRadius: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#F7F8FA",
  },
  saveButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonActive: {
    backgroundColor: "#2C65E1",
  },
  saveButtonInactive: {
    backgroundColor: "#E0E4F0",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  saveButtonTextInactive: {
    color: "#9AAACA",
  },
});

export default AddCategoryModal;
