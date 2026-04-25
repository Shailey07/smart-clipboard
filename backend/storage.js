import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// In-memory sessions store
export const sessions = new Map(); // sessionId -> session object

// Ensure uploads directory exists
fs.ensureDirSync(UPLOADS_DIR);

// Get session folder path
export function getSessionFolder(sessionId) {
  const folder = path.join(UPLOADS_DIR, sessionId);
  fs.ensureDirSync(folder);
  return folder;
}

// Save uploaded file to session folder
export async function saveFile(sessionId, file) {
  const sessionFolder = getSessionFolder(sessionId);
  const uniqueName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(sessionFolder, uniqueName);
  await fs.move(file.path, filePath, { overwrite: true });
  
  const fileMeta = {
    id: uniqueName,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    path: filePath,
    uploadedAt: new Date().toISOString()
  };
  
  return fileMeta;
}

// Get all files for a session
export async function getFiles(sessionId) {
  const sessionFolder = getSessionFolder(sessionId);
  const files = await fs.readdir(sessionFolder);
  const fileList = [];
  
  for (const file of files) {
    const filePath = path.join(sessionFolder, file);
    const stat = await fs.stat(filePath);
    fileList.push({
      id: file,
      originalName: file.substring(file.indexOf('-') + 1),
      size: stat.size,
      uploadedAt: stat.birthtime.toISOString()
    });
  }
  return fileList;
}

// Delete a specific file
export async function deleteFile(sessionId, fileId) {
  const filePath = path.join(getSessionFolder(sessionId), fileId);
  if (await fs.pathExists(filePath)) {
    await fs.remove(filePath);
    return true;
  }
  return false;
}

// Delete entire session folder and session from memory
export async function deleteSession(sessionId) {
  const sessionFolder = path.join(UPLOADS_DIR, sessionId);
  if (await fs.pathExists(sessionFolder)) {
    await fs.remove(sessionFolder);
  }
  sessions.delete(sessionId);
  console.log(`🗑️ Session ${sessionId} expired and deleted`);
}