import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { socket } from '../services/socket';

interface CanvasProps {
  size: number;
  nickname: string;
  selectedColor: string;
  onPixelInfo: (info: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ size, nickname, selectedColor, onPixelInfo }) => {
  const [canvas, setCanvas] = useState<string[][]>(() => 
    Array.from({ length: 100 }, () => Array(100).fill('#FFFFFF'))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onCanvasData = (firebaseData: string[][]) => {
      // Asegurarnos que los datos tienen el formato correcto
      const validatedData = Array.from({ length: 100 }, (_, x) => 
        Array.from({ length: 100 }, (_, y) => 
          firebaseData[x]?.[y] || '#FFFFFF'
        )
      );
      
      setCanvas(validatedData);
      setLoading(false);
    };
  
    const onPixelChange = ({ x, y, color }: { x: number; y: number; color: string }) => {
      setCanvas(prev => {
        const newCanvas = [...prev];
        newCanvas[x] = [...newCanvas[x]]; // Copiar la fila
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

  const handlePixelPress = (x: number, y: number) => {
    if (!nickname) {
      alert('Ingresa tu nickname antes de colocar píxeles.');
      return;
    }
  
    // Actualización OPTIMISTA del estado local primero
    setCanvas(prev => {
      const newCanvas = [...prev];
      newCanvas[x] = [...newCanvas[x]]; // Copiar la fila
      newCanvas[x][y] = selectedColor;  // Pintar inmediatamente
      return newCanvas;
    });
  
    // Luego enviar al servidor
    socket.emit('pixelChange', { x, y, color: selectedColor });
  };

  const handlePixelLongPress = (x: number, y: number) => {
    if (!nickname) {
      alert('Ingresa tu nickname antes de modificar píxeles.');
      return;
    }
  
    // Actualización OPTIMISTA
    setCanvas(prev => {
      const newCanvas = [...prev];
      newCanvas[x] = [...newCanvas[x]];
      newCanvas[x][y] = '#FFFFFF';  // Borrar inmediatamente
      return newCanvas;
    });
  
    socket.emit('pixelChange', { x, y, color: '#FFFFFF' });
  };

  const pixelSize = Math.floor(size / 100);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { width: size, height: size }]}>
        <Text>Cargando canvas...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {canvas.map((row, x) => (
        <View key={`row-${x}`} style={styles.row}>
          {row.map((color, y) => (
            <TouchableOpacity
              key={`pixel-${x}-${y}`}
              onPress={() => handlePixelPress(x, y)}
              style={[
                styles.pixel,
                { 
                  backgroundColor: color,
                  width: pixelSize,
                  height: pixelSize
                }
              ]}
            />
          ))}
        </View>
      ))}
    </View>
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

export default Canvas;