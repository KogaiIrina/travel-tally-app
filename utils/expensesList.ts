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

export function isExpenseCategory(
  anyString: string
): anyString is ExpenseCategory {
  return expensesList.hasOwnProperty(anyString);
}
