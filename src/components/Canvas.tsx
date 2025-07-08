import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { socket } from '../services/socket';

const Canvas = ({ size, nickname, selectedColor, onPixelInfo }) => {
  const [canvas, setCanvas] = useState(() => Array.from({ length: 100 }, () => Array(100).fill('#FFFFFF')));
  const [loading, setLoading] = useState(true);
  const pixelSize = useMemo(() => size / 100, [size]);

  useEffect(() => {
    const onCanvasData = (firebaseData) => {
      // Valida y estructura los datos recibidos para asegurar una matriz 100x100.
      const validatedData = Array.from({ length: 100 }, (_, x) =>
        Array.from({ length: 100 }, (_, y) => firebaseData[x]?.[y] || '#FFFFFF')
      );
      setCanvas(validatedData);
      setLoading(false);
    };

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
