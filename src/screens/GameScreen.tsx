import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Canvas from '../components/Canvas';
import ColorPicker from '../components/ColorPicker';
import NicknameModal from '../components/NicknameModal';
import { socket } from '../services/socket';

const GameScreen: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [showNicknameModal, setShowNicknameModal] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [pixelInfo, setPixelInfo] = useState('');
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    socket.on('userCount', (count: number) => {
      setUserCount(count);
    });

    return () => {
      socket.off('userCount');
    };
  }, []);

  const handleNicknameConfirm = (nick: string) => {
    setNickname(nick);
    setShowNicknameModal(false);
    socket.emit('setNickname', nick);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pixel Warrior</Text>
        <Text style={styles.userCount}>Usuarios conectados: {userCount}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Bienvenido a Pixel Warrior</Text>
        <Text style={styles.description}>
          Explora la maravilla de nuestro lienzo creado por nuestros usuarios y sé parte del mismo!
        </Text>

        <View style={styles.pixelInfoContainer}>
          <Text>{pixelInfo}</Text>
        </View>

        <ColorPicker onColorChange={setSelectedColor} />

        <View style={styles.canvasContainer}>
          <Canvas
            size={500} // Adjust size as needed
            nickname={nickname}
            selectedColor={selectedColor}
            onPixelInfo={setPixelInfo}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Pixel Warrior</Text>
      </View>

      <NicknameModal
        visible={showNicknameModal}
        onConfirm={handleNicknameConfirm}
        onCancel={() => setShowNicknameModal(false)}
      />
    </View>
  );
};

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