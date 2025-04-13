import io from 'socket.io-client';

const SOCKET_URL = 'https://pixel-warrior.onrender.com'; // Change to your server address

export const socket = io(SOCKET_URL);