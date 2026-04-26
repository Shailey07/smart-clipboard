import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (sessionId, password, onAuthenticated, onTextUpdate, onNewFile, onFileDeleted) => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io('/', {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionAttempts: 10,
    transports: ['websocket', 'polling'],
  });

  let authenticated = false;

  const doAuth = () => {
    socket.emit('authenticate', { sessionId, password }, (response) => {
      if (response?.success) {
        if (!authenticated) {
          authenticated = true;
          onAuthenticated(response.text || '', response.files || []);
        }
        // reconnect pe sirf room join hota hai — text overwrite nahi
      } else {
        console.error('Auth failed:', response?.error);
      }
    });
  };

  socket.on('connect', () => {
    console.log('✅ Socket connected');
    doAuth();
  });

  socket.on('reconnect', () => {
    console.log('🔄 Socket reconnected');
    doAuth();
  });

  socket.on('connect_error', (err) => console.error('❌ Socket error:', err.message));

  socket.on('text-updated', ({ text }) => {
    onTextUpdate(text);
  });

  socket.on('new-file', ({ file }) => onNewFile(file));
  socket.on('file-deleted', ({ fileId }) => onFileDeleted(fileId));

  return socket;
};

export const updateText = (sessionId, text) => {
  if (socket?.connected) {
    socket.emit('update-text', { sessionId, text });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};