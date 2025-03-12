import React from 'react';
import CustomDropdown, { DropdownItem } from './CustomDropdown';

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
  icon?: string;
}

interface BetterPickerSelectProps {
  value: string;
  onValueChange(value: string, index: number): void;
  items: Item[];
  placeholder?: Item | { label: string; value: null };
  style?: any;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  containerStyle?: object;
}

export function BetterPickerSelect(props: BetterPickerSelectProps) {
  // Convert items to the format expected by CustomDropdown
  const dropdownItems: DropdownItem[] = props.items.map((item, index) => ({
    id: typeof item.key === 'number' ? item.key : index,
    value: item.value,
    label: item.inputLabel || item.label,
    icon: item.icon
  }));

  // Handle placeholder
  const placeholderText = props.placeholder ? props.placeholder.label : 'Select an item';

  return (
    <CustomDropdown
      items={dropdownItems}
      selectedValue={props.value}
      onValueChange={(value) => {
        const index = props.items.findIndex(item => item.value === value);
        props.onValueChange(value, index);
      }}
      placeholder={placeholderText}
      leftIcon={props.leftIcon}
      containerStyle={props.containerStyle}
      disabled={props.disabled}
    />
  );
}
