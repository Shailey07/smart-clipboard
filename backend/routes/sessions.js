import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sessions, deleteSession } from '../storage.js';
import { generateCode, generatePassword, generateQRCode } from '../utils.js';

const router = express.Router();

// Create new session
router.post('/', async (req, res) => {
  const sessionId = uuidv4();
  const code = generateCode();
  const password = generatePassword();
  const createdAt = Date.now();
  const expiresAt = createdAt + 2.5 * 60 * 60 * 1000; // 2.5 hours
  
  const qrCodeDataURL = await generateQRCode(code, password);
  
  const session = {
    id: sessionId,
    code,
    password,
    createdAt,
    expiresAt,
    textContent: '',
    files: []
  };
  
  sessions.set(sessionId, session);
  
  // Auto delete after 1 hour
  setTimeout(() => {
    if (sessions.has(sessionId)) {
      deleteSession(sessionId);
    }
  }, 2.5 * 60 * 60 * 1000);
  
  res.json({
    sessionId,
    code,
    password,
    qrCode: qrCodeDataURL,
    expiresAt
  });
});

// Validate code + password
router.post('/validate', (req, res) => {
  const { code, password } = req.body;
  
  for (const [sessionId, session] of sessions.entries()) {
    if (session.code === code && session.password === password) {
      if (session.expiresAt < Date.now()) {
        return res.status(410).json({ error: 'Session expired' });
      }
      return res.json({
        sessionId,
        textContent: session.textContent,
        files: session.files,
        expiresAt: session.expiresAt
      });
    }
  }
  
  res.status(404).json({ error: 'Invalid code or password' });
});

// Get session details (for initial load)
router.get('/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  if (session.expiresAt < Date.now()) {
    return res.status(410).json({ error: 'Session expired' });
  }
  
  res.json({
    sessionId: session.id,
    code: session.code,
    textContent: session.textContent,
    files: session.files,
    expiresAt: session.expiresAt
  });
});

export default router;