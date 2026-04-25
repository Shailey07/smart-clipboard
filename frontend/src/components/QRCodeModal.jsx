import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRCodeModal({ code, password, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!code || !password) {
      console.error('QRCodeModal: code or password missing', { code, password });
      return;
    }
    QRCode.toCanvas(canvasRef.current, `${code}:${password}`, {
      width: 200,
      margin: 2,
      color: { dark: '#8ec8e4', light: '#ffffff' }
    }, (err) => {
      if (err) console.error('QR error:', err);
      else console.log('QR generated for', code);
    });
  }, [code, password]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#131d2a', borderRadius: 16, padding: 20,
          maxWidth: 320, textAlign: 'center',
          border: '1px solid #8ec8e4'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ color: '#8ec8e4', marginBottom: 12 }}>🔲 Scan QR</h3>
        <canvas ref={canvasRef} style={{ backgroundColor: '#fff', borderRadius: 8, width: 200, height: 200 }} />
        <p style={{ color: '#8ec8e4', marginTop: 12, fontSize: 18, letterSpacing: 2 }}>{code}</p>
        <p style={{ color: '#aaa', fontSize: 12 }}>pw: {password}</p>
        <button
          onClick={onClose}
          style={{
            marginTop: 16, padding: '6px 16px',
            backgroundColor: '#e07b7b', border: 'none', borderRadius: 8,
            color: 'white', cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}