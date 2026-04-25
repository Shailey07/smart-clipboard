import React, { useState } from 'react';
import { createSession } from '../api';
import QRCodeModal from './QRCodeModal';

export default function CreateSession({ onSessionCreated }) {
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [showQR, setShowQR]         = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await createSession();
      const data = res.data;
      setSessionData(data);
      setShowQR(true);
      onSessionCreated(data, true);
    } catch (err) {
      console.error(err);
      setError('// connection failed — try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Main CTA */}
      <button
        onClick={handleCreate}
        disabled={loading}
        className="ice-btn btn-ice"
      >
        {loading ? (
          <>
            <span style={{ opacity: 0.7 }}>⟳ Generating...</span>
          </>
        ) : (
          <>
            {/* Star icon */}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
              <path
                d="M6.5 1L8 4.5L12 5.3L9.5 7.8L10.1 12L6.5 10.2L2.9 12L3.5 7.8L1 5.3L5 4.5L6.5 1Z"
                stroke="var(--ice)" strokeWidth="1.1" fill="none"
              />
            </svg>
            Generate New Session
          </>
        )}
      </button>

      {/* Loading bar */}
      {loading && (
        <div className="loading-bar">
          <div className="loading-bar-inner" />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-error" style={{ textAlign: 'center' }}>{error}</p>
      )}

      {/* Info note */}
      <div style={{ borderLeft: '1.5px solid var(--border-mid)', paddingLeft: 14 }}>
        <p style={{
          fontFamily: 'var(--font-m)',
          fontSize: 9.5, color: 'var(--t3)',
          lineHeight: 2, letterSpacing: '0.5px',
        }}>
          // Session expires after 2.5 hours<br />
          // No account required — fully anonymous<br />
          // Share code + password to sync devices
        </p>
      </div>

      {/* QR Modal */}
      {showQR && sessionData && (
        <QRCodeModal
  qrData={sessionData.qrCode}
  code={sessionData.code}
  password={sessionData.password}
  onClose={() => setShowQR(false)}
/>
      )}
    </div>
  );
}