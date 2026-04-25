import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connectSocket, updateText, disconnectSocket } from '../socket';
import { uploadFile, downloadFileUrl, deleteFile } from '../api';
import FileUpload from './FileUpload';
import FileList from './FileList';
import SharedText from './SharedText';

export default function ClipboardView({ session, onLeave, onActivity }) {
  const [text, setText]       = useState(session.textContent || '');
  const [files, setFiles]     = useState(session.files || []);
  const [timeLeft, setTimeLeft] = useState('');
  const [expired, setExpired]   = useState(false);
  const socketRef = useRef(null);
  const sessionId = session.sessionId;
  const password  = session.password;

  /* ── Countdown timer ── */
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = session.expiresAt - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft('Expired');
        setExpired(true);
        onLeave();
      } else {
        const hrs  = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(hrs > 0 ? `${hrs}h ${mins}m` : `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session.expiresAt, onLeave]);

  /* ── WebSocket ── */
  useEffect(() => {
    const socket = connectSocket(
      sessionId, password,
      (initialText, initialFiles) => { setText(initialText); setFiles(initialFiles); },
      (newText)  => { setText(newText); onActivity(); },
      (newFile)  => { setFiles(prev => [...prev, newFile]); onActivity(); },
      (fileId)   => { setFiles(prev => prev.filter(f => f.id !== fileId)); onActivity(); }
    );
    socketRef.current = socket;
    return () => disconnectSocket();
  }, [sessionId, password, onActivity]);

  const handleTextChange = useCallback((newText) => {
    setText(newText);
    updateText(sessionId, newText);
    onActivity();
  }, [sessionId, onActivity]);

  const handleFileUpload = useCallback(async (file) => {
    await uploadFile(sessionId, file);
    onActivity();
  }, [sessionId, onActivity]);

  const handleDownload = useCallback((fileId, fileName) => {
    const a = document.createElement('a');
    a.href = downloadFileUrl(sessionId, fileId);
    a.download = fileName;
    a.click();
  }, [sessionId]);

  const handleDelete = useCallback(async (fileId) => {
    if (window.confirm('Delete this file?')) {
      await deleteFile(sessionId, fileId);
    }
  }, [sessionId]);

  /* ── Timer color: red when < 5 min ── */
  const timerColor = (() => {
    const rem = session.expiresAt - Date.now();
    if (expired || rem <= 0)       return 'var(--danger)';
    if (rem < 5 * 60 * 1000)      return 'var(--danger)';
    if (rem < 15 * 60 * 1000)     return 'var(--amber)';
    return 'var(--teal)';
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Session Info Bar ── */}
      <div className="session-info-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--ice-faint)', border: '0.5px solid var(--border-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-d)', fontSize: 15, fontWeight: 700, color: 'var(--ice)',
            flexShrink: 0,
          }}>
            {(session.code || 'S').charAt(0)}
          </div>

          {/* Code + password */}
          <div>
            <div style={{
              fontFamily: 'var(--font-d)', fontSize: 15, fontWeight: 700,
              color: 'var(--t1)', letterSpacing: '0.2px',
            }}>
              {session.code || 'Session'}
            </div>
            <div style={{
              fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--t3)',
              letterSpacing: '0.5px', marginTop: 2,
            }}>
              pw: {session.password || '—'}
            </div>
          </div>
        </div>

        {/* Timer + leave */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--t3)', letterSpacing: 1, textTransform: 'uppercase' }}>
              expires
            </div>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 13, color: timerColor, fontWeight: 500, letterSpacing: '0.5px' }}>
              {timeLeft || '--:--'}
            </div>
          </div>
          <button
            className="ice-btn btn-danger"
            style={{ width: 'auto', padding: '7px 12px', fontSize: 12 }}
            onClick={onLeave}
          >
            ✕ Leave
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '14px 16px 24px',
        display: 'flex', flexDirection: 'column', gap: 16,
        scrollbarWidth: 'thin', scrollbarColor: 'var(--border-mid) transparent',
      }}>

        {/* Shared Text */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <p className="section-label" style={{ margin: 0 }}>////// Shared Text</p>
            <button
              className="ice-btn btn-ghost"
              style={{ width: 'auto', padding: '4px 10px', fontSize: 10 }}
              onClick={() => navigator.clipboard?.writeText(text)}
            >
              ⎘ Copy
            </button>
          </div>
          <SharedText text={text} onChange={handleTextChange} />
        </div>

        {/* File Upload */}
        <div>
          <p className="section-label" style={{ marginBottom: 8 }}>////// File Transfer</p>
          <FileUpload onUpload={handleFileUpload} />
        </div>

        {/* File List */}
        <div>
          {files.length > 0 && (
            <>
              <p className="section-label" style={{ marginBottom: 8 }}>
                ////// Files ({files.length})
              </p>
              <FileList files={files} onDownload={handleDownload} onDelete={handleDelete} />
            </>
          )}
          {files.length === 0 && (
            <div style={{
              fontFamily: 'var(--font-m)', fontSize: 9.5, color: 'var(--t3)',
              textAlign: 'center', padding: '16px 0', letterSpacing: '0.5px',
            }}>
              // No files shared yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}