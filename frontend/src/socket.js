// frontend/src/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (sessionId, password, onAuthenticated, onTextUpdate, onNewFile, onFileDeleted) => {
  if (socket) socket.disconnect();

  socket = io('/', {
    autoConnect: true,
    reconnection: true,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected, emitting authenticate...');
    socket.emit('authenticate', { sessionId, password }, (response) => {
      console.log('🔐 Auth response:', response);
      if (response?.success) {
        onAuthenticated(response.text || '', response.files || []);
      } else {
        console.error('Auth failed:', response?.error);
      }
    });
  });

  socket.on('connect_error', (err) => console.error('❌ Socket error:', err.message));
  socket.on('text-updated', ({ text }) => {
    console.log('📝 text-updated RECEIVED:', text);
    onTextUpdate(text);
  });
  socket.on('new-file', ({ file }) => onNewFile(file));
  socket.on('file-deleted', ({ fileId }) => onFileDeleted(fileId));

  return socket;
};

export const updateText = (sessionId, text) => {
  if (socket && socket.connected) {
    console.log('📤 Emitting update-text:', text.slice(0, 30));
    socket.emit('update-text', { sessionId, text });
  } else {
    console.warn('Socket not connected');
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};