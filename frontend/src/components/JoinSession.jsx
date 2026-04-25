import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { validateSession } from '../api';

export default function JoinSession({ onSessionJoined }) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleSubmit = async (overrideCode, overridePassword) => {
    const finalCode = (overrideCode || code).toUpperCase();
    const finalPass = overridePassword || password;
    setLoading(true);
    setError('');
    try {
      const res = await validateSession(finalCode, finalPass);
      const { sessionId, textContent, files, expiresAt } = res.data;
      onSessionJoined({ sessionId, code: finalCode, password: finalPass, textContent, files, expiresAt });
    } catch (err) {
      setError(err.response?.status === 410 ? '// session expired (2.5h limit)' : '// invalid code or password');
    } finally {
      setLoading(false);
    }
  };

  const startScanner = () => {
    setScanning(true);
    setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 240, height: 240 } });
        scanner.render(
          (decodedText) => {
            const [scannedCode, scannedPassword] = decodedText.split(':');
            scanner.clear();
            setScanning(false);
            if (scannedCode && scannedPassword) {
              setCode(scannedCode);
              setPassword(scannedPassword);
              handleSubmit(scannedCode, scannedPassword);
            } else {
              setError('// invalid QR code format');
            }
          },
          (err) => console.warn(err)
        );
      } catch (err) {
        setError('// camera error: ' + err.message);
        setScanning(false);
      }
    }, 100);
  };

  const stopScanner = () => setScanning(false);

  if (scanning) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ border: '0.5px solid var(--border-mid)', borderRadius: 'var(--r-md)', overflow: 'hidden', position: 'relative', background: 'rgba(0,0,0,0.5)', minHeight: 260 }}>
          <div className="scan-corner tl" />
          <div className="scan-corner tr" />
          <div className="scan-corner bl" />
          <div className="scan-corner br" />
          <div className="scan-line" />
          <div id="qr-reader" style={{ width: '100%' }} />
        </div>
        <button onClick={stopScanner} className="ice-btn btn-danger">✕ Cancel Scan</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label className="field-label">Session Code</label>
        <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="A12ES4" maxLength={6} className="ice-input" style={{ textAlign: 'center', letterSpacing: 8, fontSize: 22, fontWeight: 700 }} />
      </div>
      <div>
        <label className="field-label">Password</label>
        <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Xy9#Qz" className="ice-input" style={{ letterSpacing: 2 }} />
      </div>
      {error && <p className="text-error">{error}</p>}
      <button onClick={() => handleSubmit()} disabled={loading || !code || !password} className="ice-btn btn-teal">{loading ? '⟳ Connecting...' : '▶ Access Clipboard'}</button>
      <div className="or-divider"><span className="or-text">or</span></div>
      <button onClick={startScanner} className="ice-btn btn-lavender">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
          <rect x="1" y="1" width="4" height="4" rx="0.8" stroke="var(--lavender)" strokeWidth="1" />
          <rect x="8" y="1" width="4" height="4" rx="0.8" stroke="var(--lavender)" strokeWidth="1" />
          <rect x="1" y="8" width="4" height="4" rx="0.8" stroke="var(--lavender)" strokeWidth="1" />
          <line x1="8" y1="8" x2="12" y2="8" stroke="var(--lavender)" strokeWidth="1" strokeLinecap="round" />
          <line x1="8" y1="8" x2="8" y2="12" stroke="var(--lavender)" strokeWidth="1" strokeLinecap="round" />
          <line x1="12" y1="10" x2="10" y2="10" stroke="var(--lavender)" strokeWidth="1" strokeLinecap="round" />
          <line x1="10" y1="12" x2="10" y2="10" stroke="var(--lavender)" strokeWidth="1" strokeLinecap="round" />
        </svg>
        Scan QR Code
      </button>
    </div>
  );
}