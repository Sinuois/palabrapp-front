import 'react-native-gesture-handler';

import React from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Tabs } from './navigator/Tabs';
import { PalabrasProvider } from './context/PalabrasContext';

const AppState = ({ children }: any ) => {
  return (
    <PalabrasProvider>
      { children }
    </PalabrasProvider>
  )
}

export const App = () => (
  <NavigationContainer
    theme={{ 
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background:'black'
      }
    }}
  >
    <AppState>
      <Tabs />
    </AppState>  
  </NavigationContainer>
)
export default App ;