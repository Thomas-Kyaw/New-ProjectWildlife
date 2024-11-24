import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import AnimalDetails from '../screens/AnimalDetails';
import UploadImage from '../screens/UploadImage';
import Tourism from '../screens/Tourism';
import Donation from '../screens/Donation';
import ContactUs from '../screens/ContactUs';
import AboutUs from '../screens/AboutUs';
import Payment from '../screens/Payment';
import Login from '../screens/Login';
import Register from '../screens/Register';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E8B57', // Forest Green
        },
        headerTintColor: '#F7F5ED', // Cream White
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'DynaPuff-Bold', // Custom font
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="AnimalDetails" 
        component={AnimalDetails} 
        options={({ route }) => ({
          title: route.params?.sighting.name || 'Animal Details',
        })}
      />
      <Stack.Screen 
        name="Tourism" 
        component={Tourism} 
        options={{ title: 'Tourism' }} 
      />
      <Stack.Screen 
        name="Donation" 
        component={Donation} 
        options={{ title: 'Donate' }} 
      />
      <Stack.Screen 
        name="ContactUs" 
        component={ContactUs} 
        options={{ title: 'Contact Us' }} 
      />
      <Stack.Screen 
        name="AboutUs" 
        component={AboutUs} 
        options={{ title: 'About Us' }} 
      />
      <Stack.Screen 
        name="Payment" 
        component={Payment} 
        options={{ title: 'Complete Donation' }} 
      />
      <Stack.Screen 
        name="UploadImage" 
        component={UploadImage} 
        options={{ title: 'Upload Image' }} 
      />
    </Stack.Navigator>
  );
}
