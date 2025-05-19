/**
 * Archivo principal de la aplicación React Native.
 * 
 * @module index
 * */
import { registerRootComponent } from 'expo';

import App from './src/App';
registerRootComponent(App);

/**
 * Registra el componente `App` como el componente raíz de la aplicación.
 *
 * La función `registerRootComponent` es proporcionada por la librería 'expo'
 * y es esencial para que Expo pueda renderizar correctamente la aplicación
 * en el dispositivo o emulador. Al registrar `App` aquí, se asegura que
 * este componente sea el primero en montarse y mostrarse al usuario.
 *
 * @param {React.ComponentType} App El componente raíz de la aplicación.
 * Este componente contiene la
 * estructura principal de la interfaz de usuario
 * y la lógica de navegación de la aplicación.
 *
 */