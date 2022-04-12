import React, { useContext } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabLista, RootStackParams } from './TabLista';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


import { TabSearchScreen } from './TabSearch';
import { LoadingScreen } from '../screens/LoadingScreen';
import { PalabrasContext } from '../context/PalabrasContext';

const Tab = createBottomTabNavigator();

export const Tabs = () => {
    const { cargado } = useContext( PalabrasContext );

    if ( !cargado ) {
        return <LoadingScreen />
    }
    return (
    <Tab.Navigator
        screenOptions={ () => ({
            headerShown: false,
            tabBarActiveTintColor: '#5856D6',
            tabBarLabelStyle: {
                marginBottom: ( Platform.OS === 'ios' ) ? 0 : 10
            },
            tabBarStyle: {
                position: 'absolute',
                backgroundColor: 'rgba(255,255,255,0.92)',
                borderWidth: 0,
                elevation: 0,
                height: (Platform.OS === 'ios') ? 80 : 60
            },

          })}
          

    >
        <Tab.Screen
            name="Homescreen" 
            component={TabLista} 
            options={{
                tabBarLabel: "Listado",
                tabBarIcon: ({ color }) => (
                    <Icon 
                        color={ color }
                        size={ 20 }
                        name="list-outline"
                    />
                )
            }}
        />
        <Tab.Screen 
            name="TabSearchScreen" 
            component={TabSearchScreen} 
            options={{
                tabBarLabel: "Búsqueda",
                tabBarIcon: ({ color }) => (
                    <Icon 
                        color={ color }
                        size={ 20 }
                        name="search-outline"
                    />
                )
            }}            
        />
    </Tab.Navigator>
    );
}