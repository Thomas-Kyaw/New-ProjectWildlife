import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Import screens
import Home from '../screens/Home';
import Sightings from '../screens/Sightings';
import Info from '../screens/Info';
import Tourism from '../screens/Tourism';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#F7F5ED', // Light Cream background
          borderTopColor: '#2E8B57', // Forest Green border
        },
        tabBarActiveTintColor: '#1B95E0', // Active tab color
        tabBarInactiveTintColor: '#888', // Inactive tab color
        tabBarLabelStyle: {
          fontFamily: 'FuzzyBubbles-Regular', // Custom font
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: '#2E8B57', // Stack header background
        },
        headerTintColor: '#F7F5ED', // Stack header text color
        headerTitleStyle: {
          fontFamily: 'DynaPuff-Bold', // Header title font
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Sightings"
        component={Sightings}
        options={{
          tabBarLabel: 'Sightings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="visibility" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tourism"
        component={Tourism}
        options={{
          tabBarLabel: 'Tourism',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-attraction" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={Info}
        options={{
          tabBarLabel: 'Info',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="info" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
