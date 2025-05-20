/**
 * Componente `Canvas` que representa un lienzo interactivo de píxeles.
 *
 * Este componente renderiza una cuadrícula de píxeles utilizando `react-native-svg`.
 * Permite a los usuarios tocar un píxel para cambiar su color, que luego se sincroniza
 * con otros usuarios a través de un socket. Recibe el tamaño del lienzo, el nickname
 * del usuario, el color seleccionado y una función para notificar información del píxel.
 *
 * @module Canvas
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { socket } from '../services/socket';

const Canvas = ({ size, nickname, selectedColor, onPixelInfo }) => {
  /**
   * Estado para almacenar la matriz de colores del lienzo.
   * Inicializado con una matriz de 100x100 llena de color blanco.
   * @useState {string[][]}
   */
  const [canvas, setCanvas] = useState(() => Array.from({ length: 100 }, () => Array(100).fill('#FFFFFF')));

  /**
   * Estado para indicar si los datos iniciales del lienzo están cargando.
   * @useState {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Tamaño de cada píxel individual calculado en función del tamaño total del lienzo y la cantidad de píxeles (100x100).
   * Se memoiza para evitar recálculos innecesarios.
   * @constant {number}
   */
  const pixelSize = useMemo(() => size / 100, [size]);

  /**
   * Hook de efecto para gestionar la conexión y recepción de datos del socket relacionados con el lienzo.
   *
   * Se suscribe a los eventos 'canvasData' para recibir los datos iniciales del lienzo y 'pixelChange' para
   * escuchar los cambios de color de los píxeles en tiempo real. Al montarse, emite un evento 'requestCanvasData'
   * para solicitar los datos iniciales al servidor.
   *
   * La función de limpieza se ejecuta al desmontar el componente para eliminar los listeners del socket
   * y evitar fugas de memoria.
   */
  useEffect(() => {
    /**
     * Función handler para procesar los datos iniciales del lienzo recibidos del servidor.
     * Valida los datos recibidos y actualiza el estado `canvas`.
     * @param firebaseData Objeto que representa los datos del lienzo.
     */
    const onCanvasData = (firebaseData) => {
      // Valida y estructura los datos recibidos para asegurar una matriz 100x100.
      const validatedData = Array.from({ length: 100 }, (_, x) =>
        Array.from({ length: 100 }, (_, y) => firebaseData[x]?.[y] || '#FFFFFF')
      );
      setCanvas(validatedData);
      setLoading(false);
    };

    /**
     * Función handler para procesar los cambios de color de un píxel recibidos del servidor.
     * Actualiza el estado `canvas` con el nuevo color del píxel.
     * @param {{ x: number, y: number, color: string }} pixelInfo Objeto con las coordenadas y el nuevo color del píxel.
     */
    const onPixelChange = ({ x, y, color }) => {
      setCanvas(prev => {
        const newCanvas = [...prev];
        newCanvas[x] = [...newCanvas[x]];
        newCanvas[x][y] = color;
        return newCanvas;
      });
    };

    socket.on('canvasData', onCanvasData);
    socket.on('pixelChange', onPixelChange);
    socket.emit('requestCanvasData');

    return () => {
      socket.off('canvasData', onCanvasData);
      socket.off('pixelChange', onPixelChange);
    };
  }, []);

  /**
   * Función memoizada para manejar el toque en un píxel específico del lienzo.
   *
   * Verifica si el usuario tiene un nickname antes de permitir pintar. Si no tiene, notifica
   * al usuario a través de `onPixelInfo`. Si tiene un nickname, actualiza el estado local
   * del lienzo con el color seleccionado y emite un evento 'pixelChange' al servidor a través del socket.
   * También notifica la acción del usuario a través de `onPixelInfo`.
   *
   * @param {number} x La coordenada x del píxel tocado.
   * @param {number} y La coordenada y del píxel tocado.
   */

  const handlePixelPress = useCallback((x: number, y: number) => {
    if (!nickname) {
      onPixelInfo('Ingresa tu nickname antes de pintar');
      return;
    }

    setCanvas(prev => {
      const newCanvas = [...prev];
      newCanvas[x] = [...newCanvas[x]];
      newCanvas[x][y] = selectedColor;
      return newCanvas;
    });

    socket.emit('pixelChange', { x, y, color: selectedColor });
    onPixelInfo(`Píxel (${x}, ${y}) pintado con ${selectedColor}`);
  }, [nickname, selectedColor]);

  // Renderiza un indicador de carga mientras se obtienen los datos iniciales del lienzo.
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { width: size, height: size }]}>
        <Text>Cargando canvas...</Text>
      </View>
    );
  }

  
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {canvas.map((row, x) =>
          row.map((color, y) => (
            <Rect
              key={`pixel-${x}-${y}`}
              x={y * pixelSize}
              y={x * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={color}
              stroke="#ddd"
              strokeWidth={0.3}
              onPress={() => handlePixelPress(x, y)}
            />
          ))
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

// Envuelve el componente con React.memo para optimizar el rendimiento evitando re-renderizaciones innecesarias
// si las props no han cambiado.
export default React.memo(Canvas);
