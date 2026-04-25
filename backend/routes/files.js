import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { sessions, saveFile, getFiles, deleteFile } from '../storage.js';
import { getIo } from '../server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMP_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'temp');
fs.ensureDirSync(TEMP_UPLOAD_DIR);

const router = express.Router();
const upload = multer({ dest: TEMP_UPLOAD_DIR });

// Upload a file to a session
router.post('/:sessionId/upload', upload.single('file'), async (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  if (session.expiresAt < Date.now()) {
    return res.status(410).json({ error: 'Session expired' });
  }
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    const fileMeta = await saveFile(sessionId, req.file);
    session.files.push(fileMeta);
    
    const io = getIo();
    io.to(sessionId).emit('new-file', { file: fileMeta });
    
    res.json({ file: fileMeta });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all files in a session
router.get('/:sessionId/files', async (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  if (session.expiresAt < Date.now()) {
    return res.status(410).json({ error: 'Session expired' });
  }
  
  const files = await getFiles(sessionId);
  res.json({ files });
});

// Download a file
router.get('/:sessionId/files/:fileId/download', async (req, res) => {
  const { sessionId, fileId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session || session.expiresAt < Date.now()) {
    return res.status(410).json({ error: 'Session expired or not found' });
  }
  
  const filePath = path.join(process.cwd(), 'uploads', sessionId, fileId);
  const fileMeta = session.files.find(f => f.id === fileId);
  
  if (!fileMeta) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.download(filePath, fileMeta.originalName);
});

// Delete a file
router.delete('/:sessionId/files/:fileId', async (req, res) => {
  const { sessionId, fileId } = req.params;
  const session = sessions.get(sessionId);
  
  if (!session || session.expiresAt < Date.now()) {
    return res.status(410).json({ error: 'Session expired or not found' });
  }
  
  await deleteFile(sessionId, fileId);
  session.files = session.files.filter(f => f.id !== fileId);
  
  const io = getIo();
  io.to(sessionId).emit('file-deleted', { fileId });
  
  res.json({ success: true });
});

export default router;