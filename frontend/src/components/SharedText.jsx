import React, { useState, useRef, useEffect } from 'react';

export default function SharedText({ text: initialText, onChange }) {
  const [localText, setLocalText] = useState(initialText || '');
  const [syncing, setSyncing]     = useState(false);
  const timeoutRef                = useRef(null);

  useEffect(() => {
    setLocalText(initialText || '');
  }, [initialText]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalText(value);
    setSyncing(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(value);
      setSyncing(false);
    }, 200);
  };

  const handleCopy = () => {
    if (!localText) return;
    navigator.clipboard.writeText(localText);
  };

  const handleClear = () => {
    setLocalText('');
    onChange('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <label className="field-label" style={{ margin: 0 }}>Shared Notepad</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {syncing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--mint)',
                animation: 'blink 0.8s ease-in-out infinite',
              }} />
              <span style={{ fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--mint)', letterSpacing: 1 }}>
                SYNCING
              </span>
            </div>
          )}
          {localText && (
            <>
              <button
                onClick={handleCopy}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border-mid)',
                  background: 'var(--violet-faint)',
                  color: 'var(--violet)',
                  fontFamily: 'var(--font-m)',
                  fontSize: 9,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                }}
              >
                Copy
              </button>
              <button
                onClick={handleClear}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  border: '1px solid rgba(242,107,107,0.22)',
                  background: 'var(--rose-faint)',
                  color: 'var(--rose)',
                  fontFamily: 'var(--font-m)',
                  fontSize: 9,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                }}
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        className="clip-textarea"
        value={localText}
        onChange={handleChange}
        rows={6}
        placeholder="Type here... instantly syncs to other device"
      />

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        marginTop: 6,
      }}>
        <span style={{ fontFamily: 'var(--font-m)', fontSize: 8.5, color: 'var(--t3)', letterSpacing: 0.5 }}>
          {localText.length.toLocaleString()} chars · {localText.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
}