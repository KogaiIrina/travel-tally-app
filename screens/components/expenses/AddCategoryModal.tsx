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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAddCustomCategory } from "../../../db/hooks/useCustomCategories";
import BigBlueButton from "../BigBlueButton";
import * as Icons from "./icons";

// Predefined colors that match the app's design
const COLORS = [
  "#A57865", "#FDC0A1", "#BB2649", "#6667AA", "#F7E00E", 
  "#154A7D", "#F36F62", "#6E5B98", "#85AF48", "#91A6D0", 
  "#F6CAC9", "#964F4D", "#B564A5", "#039775", "#686868",
  "#D94124","#E66385", "#179A9D", 
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

    // Create a unique key from the category name
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
          // Reset form and close modal
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Add New Category</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#494EBF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Select Color</Text>
              <View style={styles.colorGrid}>
                {COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorItem,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Select Icon</Text>
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

          <View style={styles.footer}>
            <BigBlueButton
              onPress={handleSave}
              isActive={!!categoryName.trim()}
              text="SAVE CATEGORY"
            />
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
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#494EBF",
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    maxHeight: "70%",
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconItem: {
    width: "16%",
    padding: 5,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#494EBF",
    borderRadius: 22.5,
    overflow: "hidden",
  },
  selectedItem: {
    borderWidth: 3,
    borderColor: "#2C65E1",
  },
  selectedIconItem: {
    backgroundColor: "rgba(44, 101, 225, 0.2)",
  },
  footer: {
    marginTop: 20,
  },
});

export default AddCategoryModal; 
