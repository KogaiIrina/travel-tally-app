import HomeIcon from "../screens/components/expenses/icons/home";
import ArrowIcon from "../screens/components/expenses/icons/arrow";
import AirPlainIcon from "../screens/components/expenses/icons/air-plain";
import FoodIcon from "../screens/components/expenses/icons/food";
import GroceriesIcon from "../screens/components/expenses/icons/groceries";
import CupIcon from "../screens/components/expenses/icons/cup";
import CarIcon from "../screens/components/expenses/icons/car";
import EntertainmentIcon from "../screens/components/expenses/icons/entertainment";
import MetroIcon from "../screens/components/expenses/icons/metro";
import SouvenirIcon from "../screens/components/expenses/icons/souvenir";
import UmbrellaIcon from "../screens/components/expenses/icons/umbrella";
import TshirtIcon from "../screens/components/expenses/icons/t-shirt";
import DisplayIcon from "../screens/components/expenses/icons/display";
import FilterIcon from "../screens/components/expenses/icons/filter";
import ExpensesCategoryIcon from "../screens/components/expenses/icons/expenses-type";
import CalendarIcon from "../screens/components/expenses/icons/calendar";
import PharmacyIcon from "../screens/components/expenses/icons/pharmacy";
import BeautyIcon from "../screens/components/expenses/icons/scissor";
import OtherIcon from "../screens/components/expenses/icons/other";
import SavingsIcon from "../screens/components/expenses/icons/savings";
import { CustomCategoryType } from "../db/hooks/useCustomCategories";
import { ReactElement } from "react";
import PetsIcon from "../screens/components/expenses/icons/pets";
import UtilityIcon from "../screens/components/expenses/icons/utility";
import SpaIcon from "../screens/components/expenses/icons/spa";
import PhoneIcon from "../screens/components/expenses/icons/phone";
import HotelIcon from "../screens/components/expenses/icons/hotel";
import BusIcon from "../screens/components/expenses/icons/bus";
import FlowerIcon from "../screens/components/expenses/icons/flower";
import RunningShoeIcon from "../screens/components/expenses/icons/running-shoe";
import CatIcon from "../screens/components/expenses/icons/cat";
import DogIcon from "../screens/components/expenses/icons/dog";
import PalmTreeIcon from "../screens/components/expenses/icons/palm-tree";
import MusicIcon from "../screens/components/expenses/icons/tickets";
import CameraIcon from "../screens/components/expenses/icons/camera";
import ChildrenIcon from "../screens/components/expenses/icons/children";
import BooksIcon from "../screens/components/expenses/icons/books";
import StudyingIcon from "../screens/components/expenses/icons/studying";
import GiftIcon from "../screens/components/expenses/icons/gift";

export const home = HomeIcon();
export const airplain = AirPlainIcon();
export const food = FoodIcon();
export const groceries = GroceriesIcon();
export const cup = CupIcon();
export const car = CarIcon();
export const entertainment = EntertainmentIcon();
export const metro = MetroIcon();
export const souvenir = SouvenirIcon();
export const umbrella = UmbrellaIcon();
export const tshirt = TshirtIcon();
export const display = DisplayIcon();
export const arrow = ArrowIcon();
export const filter = FilterIcon();
export const category = ExpensesCategoryIcon();
export const calendar = CalendarIcon();
export const pharmacy = PharmacyIcon();
export const beauty = BeautyIcon();
export const savings = SavingsIcon();
export const other = OtherIcon();

// Default expense categories
export const expensesArray = [
  {
    key: "rent",
    icon: home,
    color: "#df53f4",
    text: "Rent",
  },
  {
    key: "flights",
    icon: airplain,
    color: "#53acf4",
    text: "Flights",
  },
  {
    key: "food",
    icon: food,
    color: "#494EBF",
    text: "Food",
  },
  {
    key: "groceries",
    icon: groceries,
    color: "#EC6DB9",
    text: "Groceries",
  },
  {
    key: "cafe",
    icon: cup,
    color: "#553F39",
    text: "Cafe",
  },
  {
    key: "taxi",
    icon: car,
    color: "#F7D253",
    text: "Taxi",
  },
  {
    key: "entertainment",
    icon: entertainment,
    color: "#77BD66",
    text: "Entertainment",
  },
  {
    key: "metro",
    icon: metro,
    color: "#DA536C",
    text: "Metro",
  },
  {
    key: "souvenir",
    icon: souvenir,
    color: "#f45355",
    text: "Souvenir",
  },
  {
    key: "insurance",
    icon: umbrella,
    color: "#ef6b13",
    text: "Insurance",
  },
  {
    key: "clothes",
    icon: tshirt,
    color: "#9684c9",
    text: "Clothes",
  },
  {
    key: "electronics",
    icon: display,
    color: "#212224",
    text: "Electronics",
  },
  {
    key: "health",
    icon: pharmacy,
    color: "#5dc18a",
    text: "Health",
  },
  {
    key: "beauty",
    icon: beauty,
    color: "#17c7ea",
    text: "Beauty",
  },
  {
    key: "savings",
    icon: savings,
    color: "#ebacef",
    text: "Savings",
  },
  {
    key: "other",
    icon: other,
    color: "#8b7c93",
    text: "Other",
  },
];

// Default expense categories as an object
export const expensesList = {
  rent: {
    key: "rent",
    icon: home,
    color: "#df53f4",
    text: "Rent",
  },
  flights: {
    key: "flights",
    icon: airplain,
    color: "#53acf4",
    text: "Flights",
  },
  food: {
    key: "food",
    icon: food,
    color: "#494EBF",
    text: "Food",
  },
  groceries: {
    key: "groceries",
    icon: groceries,
    color: "#EC6DB9",
    text: "Groceries",
  },
  cafe: {
    key: "cafe",
    icon: cup,
    color: "#553F39",
    text: "Cafe",
  },
  taxi: {
    key: "taxi",
    icon: car,
    color: "#F7D253",
    text: "Taxi",
  },
  entertainment: {
    key: "entertainment",
    icon: entertainment,
    color: "#77BD66",
    text: "Entertainment",
  },
  metro: {
    key: "metro",
    icon: metro,
    color: "#DA536C",
    text: "Metro",
  },
  souvenir: {
    key: "souvenir",
    icon: souvenir,
    color: "#f45355",
    text: "Souvenir",
  },
  insurance: {
    key: "insurance",
    icon: umbrella,
    color: "#ef6b13",
    text: "Insurance",
  },
  clothes: {
    key: "clothes",
    icon: tshirt,
    color: "#9684c9",
    text: "Clothes",
  },
  electronics: {
    key: "electronics",
    icon: display,
    color: "#212224",
    text: "Electronics",
  },
  health: {
    key: "health",
    icon: pharmacy,
    color: "#5dc18a",
    text: "Health",
  },
  beauty: {
    key: "beauty",
    icon: beauty,
    color: "#17c7ea",
    text: "Beauty",
  },
  savings: {
    key: "savings",
    icon: savings,
    color: "#ebacef",
    text: "Savings",
  },
  other: {
    key: "other",
    icon: other,
    color: "#8b7c93",
    text: "Other",
  },
};

export type ExpenseCategory = keyof typeof expensesList;

// Add an index signature to allow string indexing
export interface ExpensesListType {
  [key: string]: {
    key: string;
    icon: ReactElement;
    color: string;
    text: string;
  };
}

export function isExpenseCategory(
  anyString: string
): anyString is ExpenseCategory {
  return expensesList.hasOwnProperty(anyString);
}

// Helper function to get icon component from string name
export function getIconFromName(iconName: string): ReactElement {
  switch (iconName) {
    case 'home': return home;
    case 'airplain': return airplain;
    case 'food': return food;
    case 'groceries': return groceries;
    case 'cup': return cup;
    case 'car': return car;
    case 'entertainment': return entertainment;
    case 'metro': return metro;
    case 'souvenir': return souvenir;
    case 'umbrella': return umbrella;
    case 'tshirt': return tshirt;
    case 'display': return display;
    case 'pharmacy': return pharmacy;
    case 'beauty': return beauty;
    case 'savings': return savings;
    case 'pets': return PetsIcon();
    case 'utility': return UtilityIcon();
    case 'spa': return SpaIcon();
    case 'phone': return PhoneIcon();
    case 'hotel': return HotelIcon();
    case 'bus': return BusIcon();
    case 'flower': return FlowerIcon();
    case 'runningShoe': return RunningShoeIcon();
    case 'cat': return CatIcon();
    case 'dog': return DogIcon();
    case 'palmTree': return PalmTreeIcon();
    case 'music': return MusicIcon();
    case 'camera': return CameraIcon();
    case 'children': return ChildrenIcon();
    case 'gift': return GiftIcon();
    case 'books': return BooksIcon();
    case 'studying': return StudyingIcon();
    default: return other;
  }
}

// Function to merge default and custom categories
export function mergeCategories(customCategories: CustomCategoryType[] = []) {
  const mergedExpensesArray = [...expensesArray];
  const mergedExpensesList: ExpensesListType = { ...expensesList };

  customCategories.forEach(category => {
    const icon = getIconFromName(category.icon);
    
    // Add to array
    mergedExpensesArray.push({
      key: category.key,
      icon,
      color: category.color,
      text: category.text
    });
    
    // Add to object
    mergedExpensesList[category.key] = {
      key: category.key,
      icon,
      color: category.color,
      text: category.text
    };
  });
  
  return { mergedExpensesArray, mergedExpensesList };
}
