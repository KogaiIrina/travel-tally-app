import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface DropdownItem {
  id: number;
  label: string;
  value: any;
  icon?: string; // Optional icon (like flag emoji)
}

interface CustomDropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  selectedValue?: any;
  onValueChange: (value: any) => void;
  leftIcon?: React.ReactNode;
  containerStyle?: object;
  dropdownStyle?: object;
  itemStyle?: object;
  labelStyle?: object;
  placeholderStyle?: object;
  showSelectedLabel?: boolean;
  disabled?: boolean;
  width?: number | string;
  showIcons?: boolean; // Whether to show icons in dropdown items
  isOpen?: boolean; // Allow external control of dropdown state
  onClose?: () => void; // Callback when dropdown is closed
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder = 'Select an item',
  selectedValue,
  onValueChange,
  leftIcon,
  containerStyle,
  dropdownStyle,
  itemStyle,
  labelStyle,
  placeholderStyle,
  showSelectedLabel = true,
  disabled = false,
  width = '100%',
  showIcons = false, // Default to not showing icons in dropdown items
  isOpen: externalIsOpen,
  onClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

  // Determine if dropdown is open based on external or internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Find the selected item based on the selectedValue
  useEffect(() => {
    if (selectedValue !== undefined && selectedValue !== "" && items.length > 0) {
      // Use loose equality to safely match numbers passed as strings (e.g. ID 1 vs "1")
      const found = items.find(item => item.value == selectedValue);
      setSelectedItem(found || null);
    } else {
      setSelectedItem(null);
    }
  }, [selectedValue, items]);

  // Handle external control of dropdown state
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  const toggleDropdown = () => {
    if (disabled) return;

    const newIsOpen = !isOpen;
    setInternalIsOpen(newIsOpen);

    if (!newIsOpen && onClose) {
      onClose();
    }
  };

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    onValueChange(item.value);
    setInternalIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const renderLabel = () => {
    if (selectedItem && showSelectedLabel) {
      return (
        <Text style={[styles.labelText, labelStyle]} numberOfLines={1} ellipsizeMode="tail">
          {selectedItem.icon && showIcons ? `${selectedItem.icon} ` : ''}
          {selectedItem.label}
        </Text>
      );
    }
    return (
      <Text style={[styles.placeholderText, placeholderStyle]} numberOfLines={1} ellipsizeMode="tail">
        {placeholder}
      </Text>
    );
  };

  // Calculate dropdown width based on container width
  const getDropdownWidth = () => {
    if (typeof width === 'number') {
      return Math.min(width, SCREEN_WIDTH * 0.9);
    }
    return SCREEN_WIDTH * 0.9; // Default to 90% of screen width
  };

  return (
    <View style={[styles.container, { width }, containerStyle]}>
      <TouchableOpacity
        style={[styles.selector, disabled && styles.disabledSelector]}
        onPress={toggleDropdown}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <View style={styles.labelContainer}>{renderLabel()}</View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[
                styles.dropdown,
                { width: getDropdownWidth() },
                dropdownStyle
              ]}>
                <ScrollView nestedScrollEnabled style={styles.scrollView}>
                  {items.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.dropdownItem,
                        selectedItem?.id === item.id && styles.selectedItem,
                        itemStyle,
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.dropdownItemText} numberOfLines={1} ellipsizeMode="tail">
                        {item.icon && showIcons ? `${item.icon} ` : ''}
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginTop: Platform.OS === 'ios' ? 0 : 10,
    minWidth: 200, // Ensure a minimum width
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#C3C5F3',
    backgroundColor: '#FFFFFF',
  },
  disabledSelector: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  iconContainer: {
    height: '100%',
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F6FF',
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
    borderRightWidth: 0.3,
    borderRightColor: '#C3C5F3',
  },
  labelContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  labelText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9EA0AA',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  dropdown: {
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C3C5F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    width: '100%',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#F3F6FF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomDropdown; 
