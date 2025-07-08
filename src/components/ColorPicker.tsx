import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ColorPicker = ({ onColorChange }) => {
  const [selectedColor, setSelectedColor] = useState('#000000');

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#A52A2A'
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona un color:</Text>
      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor
            ]}
            onPress={() => handleColorSelect(color)}
          />
        ))}
      </View>
      <Text style={styles.currentColor}>Color actual: {selectedColor}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 30,
    height: 30,
    margin: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000',
  },
  currentColor: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default ColorPicker;