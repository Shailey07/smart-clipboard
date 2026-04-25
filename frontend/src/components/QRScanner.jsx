import React, { useState } from 'react';
import QRCode from 'react-qr-code';

/* ─── QRCodeModal ────────────────────────────── */
export function QRCodeModal({ qrData, code, password, onClose }) {
  const [copied, setCopied] = useState(null);

  const copy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(240,244,255,0.72)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: 20,
    }}>
      <div className="glass-card card-3d" style={{
        padding: '32px 24px',
        maxWidth: 340, width: '100%',
        boxShadow: 'var(--shadow-lg), 0 1px 0 rgba(255,255,255,0.95) inset',
      }}>
        <div className="hero-grad-line" />

        <h3 style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 800, color: 'var(--t1)', textAlign: 'center', marginBottom: 6 }}>
          Share Session
        </h3>
        <p className="slash-label" style={{ textAlign: 'center', marginBottom: 24 }}>
          scan or copy credentials
        </p>

        {/* QR Code */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 24,
        }}>
          <div style={{
            padding: 16, borderRadius: 16,
            background: '#fff',
            boxShadow: 'var(--shadow-md), 0 1px 0 rgba(255,255,255,0.9) inset',
            border: '1.5px solid var(--border-mid)',
            transform: 'perspective(300px) rotateX(-4deg)',
          }}>
            <QRCode value={qrData || `${code}:${password}`} size={160} />
          </div>
        </div>

        {/* Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Session Code', value: code, key: 'code' },
            { label: 'Password',     value: password, key: 'pass' },
          ].map(({ label, value, key }) => (
            <div key={key} style={{
              background: 'rgba(255,255,255,0.65)',
              border: '1.5px solid var(--border-mid)',
              borderRadius: 12,
              padding: '10px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 10,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--t3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>
                  {value}
                </div>
              </div>
              <button
                onClick={() => copy(value, key)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border-mid)',
                  background: copied === key ? 'var(--mint-faint)' : 'var(--violet-faint)',
                  color: copied === key ? 'var(--mint)' : 'var(--violet)',
                  fontFamily: 'var(--font-m)',
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {copied === key ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>

        <button className="ice-btn btn-ghost" onClick={onClose} style={{ fontSize: 13 }}>
          Close
        </button>
      </div>
    </div>
  );
}

/* ─── QRScanner (default export — manual code entry) ── */
export default function QRScanner({ onScan }) {
  const [code, setCode]     = useState('');
  const [pass, setPass]     = useState('');
  const [error, setError]   = useState('');

  const handleSubmit = () => {
    if (!code.trim() || !pass.trim()) {
      setError('Both code and password are required.');
      return;
    }
    setError('');
    onScan(code.trim(), pass.trim());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Scanner visual */}
      <div style={{
        position: 'relative',
        height: 180,
        borderRadius: 16,
        background: 'linear-gradient(135deg, var(--violet-faint), var(--sky-faint))',
        border: '1.5px dashed var(--border-mid)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div className="scan-corner tl" />
        <div className="scan-corner tr" />
        <div className="scan-corner bl" />
        <div className="scan-corner br" />
        <div className="scan-line" />
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
          <p style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--t3)', letterSpacing: 2 }}>
            CAMERA PREVIEW
          </p>
          <p style={{ fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--t3)', marginTop: 4 }}>
            (enter code manually below)
          </p>
        </div>
      </div>

      <div className="or-divider"><span className="or-text">or enter manually</span></div>

      {/* Manual entry */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label className="field-label">Session Code</label>
          <input
            className="ice-input"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="XXXX-XXXX"
          />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input
            className="ice-input"
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-error">{error}</p>}
        <button
          className="ice-btn btn-lavender"
          onClick={handleSubmit}
          disabled={!code.trim() || !pass.trim()}
        >
          ▶ Join via Code
        </button>
      </div>
    </div>
  );
}