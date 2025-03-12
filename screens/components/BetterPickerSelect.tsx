import RNPickerSelect, {
  PickerSelectProps as RNPickerSelectProps,
} from "react-native-picker-select";

interface Item {
  label: string;
  value: string;
  key?: string | number;
  color?: string;
  /**
   * Used when you want a different label displayed
   * on the input than what is displayed on the Picker
   *
   * If falsy, label is used
   */
  inputLabel?: string;
}

type BetterPickerSelectProps = Omit<
  RNPickerSelectProps,
  "value" | "onValueChange" | "items" | "placeholder"
> & {
  value: string;
  onValueChange(value: string, index: number): void;
  items: Item[];
  placeholder?: Item;
};

export function BetterPickerSelect(props: BetterPickerSelectProps) {
  return <RNPickerSelect {...props} />;
}
