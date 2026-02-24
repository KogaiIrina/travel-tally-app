import React from 'react';
import { View, Pressable, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type TabType = 'expenses' | 'trips' | 'statistics';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable
          style={styles.tab}
          onPress={() => onTabChange('expenses')}
        >
          <Ionicons
            name={activeTab === 'expenses' ? 'receipt' : 'receipt-outline'}
            size={24}
            color={activeTab === 'expenses' ? '#4169E1' : '#888'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'expenses' && styles.activeTabText,
            ]}
          >
            Expenses
          </Text>
        </Pressable>

        <Pressable
          style={styles.tab}
          onPress={() => onTabChange('trips')}
        >
          <Ionicons
            name={activeTab === 'trips' ? 'airplane' : 'airplane-outline'}
            size={24}
            color={activeTab === 'trips' ? '#4169E1' : '#888'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'trips' && styles.activeTabText,
            ]}
          >
            Destinations
          </Text>
        </Pressable>

        <Pressable
          style={styles.tab}
          onPress={() => onTabChange('statistics')}
        >
          <Ionicons
            name={activeTab === 'statistics' ? 'pie-chart' : 'pie-chart-outline'}
            size={24}
            color={activeTab === 'statistics' ? '#4169E1' : '#888'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'statistics' && styles.activeTabText,
            ]}
          >
            Stats
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 56 : 64, // Good touch target height
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 0 : 8, // Native iOS safe area usually handles the bottom, but Android needs padding
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4169E1',
    fontWeight: '600',
  },
});
