// backend/socketHandler.js
import { sessions } from './storage.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    let currentSessionId = null;

    socket.on('authenticate', ({ sessionId, password }, callback) => {
      const session = sessions.get(sessionId);
      if (!session) return callback({ success: false, error: 'Session not found' });
      if (session.expiresAt < Date.now()) return callback({ success: false, error: 'Session expired' });
      if (session.password !== password) return callback({ success: false, error: 'Invalid password' });

      currentSessionId = sessionId;
      socket.join(sessionId);

      callback({
        success: true,
        text: session.textContent || '',
        files: session.files || []
      });
    });

    socket.on('update-text', ({ sessionId, text }) => {
      if (!currentSessionId || currentSessionId !== sessionId) return;
      const session = sessions.get(sessionId);
      if (!session || session.expiresAt <= Date.now()) return;

      // Save karo server pe
      session.textContent = text;

      // Sirf doosron ko bhejo, sender ko nahi
      socket.to(sessionId).emit('text-updated', { text });
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}