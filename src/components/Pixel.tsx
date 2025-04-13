import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface PixelProps {
  size: number;
  color: string;
  x: number;
  y: number;
  onPress: (x: number, y: number) => void;
  onLongPress: (x: number, y: number) => void;
}

const Pixel: React.FC<PixelProps> = ({ size, color, x, y, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={[styles.pixel, { width: size, height: size, backgroundColor: color }]}
      onPress={() => onPress(x, y)}
      onLongPress={() => onLongPress(x, y)}
      delayLongPress={300}
    />
  );
};

const styles = StyleSheet.create({
  pixel: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
  },
});

export default Pixel;