import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    'DynaPuff': require('./assets/fonts/DynaPuff-Regular.ttf'),
    'FuzzyBubbles-Regular': require('./assets/fonts/FuzzyBubbles-Regular.ttf'),
    'Atma-Bold': require('./assets/fonts/Atma-Bold.ttf'),
  });

  return (
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
  );
}
