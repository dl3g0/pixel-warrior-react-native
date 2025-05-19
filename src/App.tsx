/**
 * Este archivo configura la estructura de navegación de la aplicación
 * utilizando la librería `react-navigation`. Define una única pantalla
 * llamada 'Game' que muestra el componente `GameScreen`.
 * 
 * @module App
 */
import { enableScreens } from 'react-native-screens';
enableScreens(true); // Habilita las optimizaciones de react-native-screens
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
/**
 * `createNativeStackNavigator` crea un navegador de pila que utiliza las API
 * nativas de cada plataforma para proporcionar una experiencia de navegación
 * más fluida y con mejor rendimiento.
 *
 * @constant {StackNavigator} Stack
 */
import GameScreen from './screens/GameScreen';
const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;