/**
 * Componente `ColorPicker` que permite al usuario seleccionar un color de una paleta predefinida.
 *
 * Este componente renderiza una cuadrícula de botones de colores. Al seleccionar un color,
 * actualiza su estado interno y notifica al componente padre a través de la prop `onColorChange`.
 * También muestra el color actualmente seleccionado.
 *
 * @module ColorPicker
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Props del componente `ColorPicker`.
 *
 * @property {function} onColorChange Función que se llama cuando el usuario selecciona un color.
 * Recibe el color seleccionado como argumento.
 */

const ColorPicker = ({ onColorChange }) => {
  /**
   * Estado para almacenar el color actualmente seleccionado dentro del componente.
   * Inicialmente se establece en negro ('#000000').
   * @useState {string}
   */
  const [selectedColor, setSelectedColor] = useState('#000000');

  /**
   * Array de colores predefinidos que se mostrarán como opciones.
   * @constant {string[]}
   */
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#A52A2A'
  ];

  /**
   * Función handler que se ejecuta cuando el usuario toca una opción de color.
   *
   * Actualiza el estado `selectedColor` con el color seleccionado y llama a la función
   * `onColorChange` proporcionada por el componente padre, pasando el color seleccionado.
   *
   * @param {string} color El color que el usuario ha seleccionado.
   */
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

/**
 * Hoja de estilos para el componente `ColorPicker`.
 */

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