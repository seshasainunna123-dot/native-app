import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';

// Screens
import InitialScreen from '../screens/InitialScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import EMIScreen from '../screens/EMIScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AddEMIScreen from '../screens/AddEMIScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import AddPostScreen from '../screens/AddPostScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: 'rgba(255,255,255,0.15)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600', paddingBottom: 4, marginTop: 4 },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Dashboard') iconName = 'analytics';
          else if (route.name === 'Transactions') iconName = 'swap-horizontal';
          else if (route.name === 'EMIs') iconName = 'card';
          else if (route.name === 'Settings') iconName = 'settings';
          else if (route.name === 'Profile') iconName = 'person-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="EMIs" component={EMIScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={InitialScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen 
        name="AddTransaction" 
        component={AddTransactionScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="AddEMI" 
        component={AddEMIScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
      <Stack.Screen name="AddPost" component={AddPostScreen} />

    </Stack.Navigator>
  );
}
