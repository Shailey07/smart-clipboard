import QRCode from 'qrcode';
import { randomBytes } from 'crypto';

// Generate 6-digit alphanumeric code (uppercase + digits)
export function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate random 6-char password (alphanumeric + special)
export function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let pwd = '';
  for (let i = 0; i < 6; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

// Generate QR code data URL (contains code + password)
export async function generateQRCode(code, password) {
  const data = `${code}:${password}`;
  return await QRCode.toDataURL(data);
}