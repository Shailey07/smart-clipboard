import React, { useState } from 'react';
import QRCode from 'react-qr-code';

export default function QRCodeModal({ code, password, onClose }) {
  const [copied, setCopied] = useState(null);

  const copy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', maxWidth: 320, width: '100%', textAlign: 'center', boxShadow: '0 24px 60px rgba(108,99,255,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', marginBottom: 6 }}>Share Session</h3>
        <p style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 1.5, marginBottom: 20 }}>SCAN OR COPY CREDENTIALS</p>
        <div style={{ display: 'inline-block', padding: 14, background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', marginBottom: 20 }}>
          <QRCode value={`${code}:${password}`} size={160} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[{ label: 'Session Code', value: code, key: 'code' }, { label: 'Password', value: password, key: 'pass' }].map(({ label, value, key }) => (
            <div key={key} style={{ background: '#f8faff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', letterSpacing: 1 }}>{value}</div>
              </div>
              <button onClick={() => copy(value, key)} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: copied === key ? '#f0fdf4' : '#ede9fe', color: copied === key ? '#16a34a' : '#6c63ff', fontSize: 10, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {copied === key ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8faff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
}
