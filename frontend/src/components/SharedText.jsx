import React, { useState, useRef, useEffect } from 'react';

export default function SharedText({ text: remoteProp, onChange }) {
  const [localText, setLocalText] = useState(remoteProp || '');
  const [syncing, setSyncing]     = useState(false);
  const debounceRef               = useRef(null);
  const typingRef                 = useRef(false);

  useEffect(() => {
    // Remote se update aaya — sirf tab apply karo jab user type nahi kar raha
    if (!typingRef.current) {
      setLocalText(remoteProp || '');
    }
  }, [remoteProp]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalText(value);
    setSyncing(true);
    typingRef.current = true;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(value);
      setSyncing(false);
      // 1.5 sec baad typing flag hatao
      setTimeout(() => { typingRef.current = false; }, 1500);
    }, 500);
  };

  const handleCopy = () => {
    if (localText) navigator.clipboard.writeText(localText);
  };

  const handleClear = () => {
    typingRef.current = false;
    setLocalText('');
    onChange('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label className="field-label" style={{ margin: 0 }}>Shared Notepad</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {syncing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--mint)', animation: 'blink 0.8s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--mint)', letterSpacing: 1 }}>SYNCING</span>
            </div>
          )}
          {localText && (
            <>
              <button onClick={handleCopy} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid var(--border-mid)', background: 'var(--violet-faint)', color: 'var(--violet)', fontFamily: 'var(--font-m)', fontSize: 9, fontWeight: 600, cursor: 'pointer' }}>Copy</button>
              <button onClick={handleClear} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(242,107,107,0.22)', background: 'var(--rose-faint)', color: 'var(--rose)', fontFamily: 'var(--font-m)', fontSize: 9, fontWeight: 600, cursor: 'pointer' }}>Clear</button>
            </>
          )}
        </div>
      </div>
      <textarea
        className="clip-textarea"
        value={localText}
        onChange={handleChange}
        rows={6}
        placeholder="Type here... instantly syncs to other device"
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
        <span style={{ fontFamily: 'var(--font-m)', fontSize: 8.5, color: 'var(--t3)' }}>
          {localText.length.toLocaleString()} chars · {localText.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
}