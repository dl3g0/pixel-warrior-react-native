/**
 * Componente de la pantalla del juego Pixel Warrior.
 *
 * Esta pantalla principal del juego permite a los usuarios interactuar con un lienzo compartido
 * donde pueden pintar píxeles de diferentes colores. Utiliza un socket para la comunicación
 * en tiempo real con el servidor, permitiendo ver la cantidad de usuarios conectados y
 * sincronizar las acciones de pintura.
 *
 * @module GameScreen
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Canvas from '../components/Canvas';
import ColorPicker from '../components/ColorPicker';
import NicknameModal from '../components/NicknameModal';
import { socket } from '../services/socket';

const GameScreen: React.FC = () => {
  /**
   * Estado para almacenar el apodo del usuario.
   * @useState {string}
   */
  const [nickname, setNickname] = useState('');

   /**
   * Estado para controlar la visibilidad del modal para ingresar el apodo.
   * @useState {boolean}
   */
  const [showNicknameModal, setShowNicknameModal] = useState(true);

  /**
   * Estado para almacenar el color seleccionado por el usuario para pintar.
   * Inicialmente establecido en negro ('#000000').
   * @useState {string}
   */
  const [selectedColor, setSelectedColor] = useState('#000000');

  /**
   * Estado para mostrar información sobre el píxel que el usuario ha tocado.
   * @useState {string}
   */
  const [pixelInfo, setPixelInfo] = useState('');

  /**
   * Estado para almacenar la cantidad de usuarios conectados al juego.
   * Inicialmente establecido en 0.
   * @useState {number}
   */
  const [userCount, setUserCount] = useState(0);

  /**
   * Hook de efecto para gestionar la conexión y desconexión del socket para la
   * actualización del contador de usuarios.
   *
   * Se suscribe al evento 'userCount' cuando el componente se monta y actualiza
   * el estado `userCount`. La función de limpieza se ejecuta cuando el componente
   * se deja de usar para evitar fugas de memoria al eliminar el listener del evento.
   */
  useEffect(() => {
    socket.on('userCount', (count: number) => {
      setUserCount(count);
    });

    // Función de limpieza que se ejecuta al dejar de usar el componente.
    return () => {
      socket.off('userCount');
    };
  }, []); // El array de dependencias vacío asegura que este efecto se ejecute solo una vez al usar y dejar de usar el componente.

  /**
   * Función handler para confirmar el apodo ingresado por el usuario.
   *
   * Actualiza el estado `nickname` con el valor proporcionado, oculta el modal
   * de apodo y emite un evento 'setNickname' al servidor a través del socket
   * para registrar el apodo del usuario.
   *
   * @param {string} nick El apodo ingresado por el usuario.
   */
  const handleNicknameConfirm = (nick: string) => {
    setNickname(nick);
    setShowNicknameModal(false);
    socket.emit('setNickname', nick);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado de la pantalla */}
      <View style={styles.header}>
        <Text style={styles.title}>Pixel Warrior</Text>
        <Text style={styles.userCount}>Usuarios conectados: {userCount}</Text>
      </View>
      {/* Contenido principal de la pantalla, envuelto en un ScrollView para permitir el desplazamiento */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Bienvenido a Pixel Warrior</Text>
        <Text style={styles.description}>
          Explora la maravilla de nuestro lienzo creado por nuestros usuarios y sé parte del mismo!
        </Text>
        {/* Contenedor para mostrar información sobre el píxel seleccionado */}
        <View style={styles.pixelInfoContainer}>
          <Text>{pixelInfo}</Text>
        </View>
        {/* Componente para seleccionar el color */}
        <ColorPicker onColorChange={setSelectedColor} />

        {/* Contenedor para el componente Canvas */}
        <View style={styles.canvasContainer}>
          <Canvas
            size={500}
            nickname={nickname}
            selectedColor={selectedColor}
            onPixelInfo={setPixelInfo}
          />
        </View>
      </ScrollView>
      {/* Pie de página de la pantalla */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Pixel Warrior</Text>
      </View>

      {/* Modal para que el usuario ingrese su apodo */}
      <NicknameModal
        visible={showNicknameModal}
        onConfirm={handleNicknameConfirm}
        onCancel={() => setShowNicknameModal(false)}
      />
    </View>
  );
};

/**
 * Hoja de estilos para el componente `GameScreen`.
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userCount: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  pixelInfoContainer: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 10,
  },
  canvasContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#2196F3',
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
  },
});

export default GameScreen;