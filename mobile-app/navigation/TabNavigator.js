import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Import screens
import Home from '../screens/Home';
import Sightings from '../screens/Sightings';
import Info from '../screens/Info';
import Tourism from '../screens/Tourism';
import Profile from '../screens/Profile';  // Import Profile screen

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"  // Start with the Home screen
      screenOptions={{
        tabBarActiveTintColor: '#1B95E0',
        tabBarInactiveTintColor: '#888',
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
