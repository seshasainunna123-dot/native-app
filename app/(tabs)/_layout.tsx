import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function TabIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return (
    <Ionicons name={name} size={28} color={color} style={{ marginBottom: -4 }} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B', // Brighter background for better contrast
          borderTopColor: 'rgba(255,255,255,0.15)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70, // Increased height
          paddingBottom: Platform.OS === 'ios' ? 30 : 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#94A3B8', // Lighter inactive color
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600', paddingBottom: 4, marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <TabIcon name="swap-horizontal" color={color} />,
        }}
      />
      <Tabs.Screen
        name="emis"
        options={{
          title: 'EMIs',
          tabBarIcon: ({ color }) => <TabIcon name="card" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
