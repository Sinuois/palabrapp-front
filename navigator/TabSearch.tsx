import React from 'react'

import { createStackNavigator } from "@react-navigation/stack";
import { SearchScreen } from "../screens/SearchScreen";
import { RootStackParams } from "./TabLista";
import { HomeScreen } from '../screens/HomeScreen';
import { PalabraScreen } from '../screens/PalabraScreen';

const TabSearch = createStackNavigator<RootStackParams>();

export const TabSearchScreen = () => {
  return (
    <TabSearch.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <TabSearch.Screen name="HomeScreen" component={ SearchScreen } />
        {/* <TabSearch.Screen name="PalabraScreen" component={ PalabraScreen } /> */}
    </TabSearch.Navigator>
  );
}