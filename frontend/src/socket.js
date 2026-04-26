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

  let isFirstConnect = true; // ← pehli baar hi onAuthenticated call karo

  socket.on('connect', () => {
    console.log('✅ Socket connected, authenticating...');
    socket.emit('authenticate', { sessionId, password }, (response) => {
      console.log('🔐 Auth response:', response);
      if (response?.success) {
        if (isFirstConnect) {
          // Sirf pehli baar initial text/files set karo
          onAuthenticated(response.text || '', response.files || []);
          isFirstConnect = false;
        }
        // Reconnect pe sirf room join hota hai, text overwrite nahi
      } else {
        console.error('Auth failed:', response?.error);
      }
    });
  });

  socket.on('connect_error', (err) => console.error('❌ Socket error:', err.message));

  socket.on('text-updated', ({ text }) => {
    console.log('📝 text-updated received:', text.slice(0, 30));
    onTextUpdate(text);
  });

  socket.on('new-file', ({ file }) => onNewFile(file));
  socket.on('file-deleted', ({ fileId }) => onFileDeleted(fileId));

  return socket;
};

export const updateText = (sessionId, text) => {
  if (socket && socket.connected) {
    socket.emit('update-text', { sessionId, text });
  } else {
    console.warn('⚠️ Socket not connected, update skipped');
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};