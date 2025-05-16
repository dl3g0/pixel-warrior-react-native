import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Dimensions } from 'react-native';
import { socket } from '../services/socket';

const Canvas = ({ size, nickname, selectedColor, onPixelInfo }) => {
  const [canvas, setCanvas] = useState<string[][]>(() => 
    Array.from({ length: 100 }, () => Array(100).fill('#FFFFFF'))
  );
  const [loading, setLoading] = useState(true);

  // Tamaño del píxel calculado una sola vez
  const pixelSize = useMemo(() => Math.floor(size / 100), [size]);

  // Escuchar eventos del socket
  useEffect(() => {
    const onCanvasData = (firebaseData: string[][]) => {
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

  // Manejo optimizado del toque en un píxel
  const handlePixelPress = useCallback((x: number, y: number) => {
    if (!nickname) {
      onPixelInfo('Ingresa tu nickname antes de pintar');
      return;
    }
    
    // Actualización optimista
    setCanvas(prev => {
      const newCanvas = [...prev];
      newCanvas[x] = [...newCanvas[x]];
      newCanvas[x][y] = selectedColor;
      return newCanvas;
    });

    socket.emit('pixelChange', { x, y, color: selectedColor });
    onPixelInfo(`Píxel (${x}, ${y}) pintado con ${selectedColor}`);
  }, [nickname, selectedColor]);

  // Renderizar una fila de píxeles (optimizado con React.memo)
  const renderRow = useCallback(({ item: row, index: x }) => (
    <View style={styles.row}>
      {row.map((color, y) => (
        <TouchableOpacity
          key={`pixel-${y}`}
          onPress={() => handlePixelPress(x, y)}
          style={[
            styles.pixel,
            { 
              backgroundColor: color,
              width: pixelSize,
              height: pixelSize,
            }
          ]}
        />
      ))}
    </View>
  ), [handlePixelPress, pixelSize]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { width: size, height: size }]}>
        <Text>Cargando canvas...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={canvas}
      renderItem={renderRow}
      keyExtractor={(_, x) => `row-${x}`}
      scrollEnabled={false}
      style={{ width: size, height: size }}
      initialNumToRender={10} // Solo renderiza 10 filas inicialmente
      maxToRenderPerBatch={10} // Máximo 10 filas por lote
      windowSize={21} // 10 filas arriba/abajo + 1 visible
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
  },
  pixel: {
    borderWidth: 0.3,
    borderColor: '#ddd',
  },
});

export default React.memo(Canvas); // Evita re-renders innecesarios