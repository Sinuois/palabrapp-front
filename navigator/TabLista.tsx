import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { HomeScreen } from '../screens/HomeScreen';
import { PalabraScreen } from '../screens/PalabraScreen';

export type RootStackParams = {
    HomeScreen: undefined;
    PalabraScreen: { id?: string, concepto?: string, significado?: string };
}

const Stack = createStackNavigator<RootStackParams>();

export const TabLista = () => {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="HomeScreen" component={ HomeScreen } />
        <Stack.Screen name="PalabraScreen" component={ PalabraScreen } />
    </Stack.Navigator>
  );
}