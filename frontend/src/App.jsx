import React, { useState, useCallback } from 'react';
import CreateSession from './components/CreateSession';
import JoinSession from './components/JoinSession';
import ClipboardView from './components/ClipboardView';
import QRScanner from './components/QRScanner';
import QRCodeModal from './components/QRCodeModal';

const Icon = {
  Sessions: ({ active }) => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="1" width="7" height="7" rx="2" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/><rect x="12" y="1" width="7" height="7" rx="2" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/><rect x="1" y="12" width="7" height="7" rx="2" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/><rect x="12" y="12" width="7" height="7" rx="2" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/></svg>),
  Create: ({ active }) => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/><line x1="10" y1="6" x2="10" y2="14" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/><line x1="6" y1="10" x2="14" y2="10" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  Join: ({ active }) => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 3H3a1.5 1.5 0 00-1.5 1.5v13A1.5 1.5 0 003 19h13a1.5 1.5 0 001.5-1.5V12" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/><path d="M12.5 1.5H18.5V7.5" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><line x1="18.5" y1="1.5" x2="9.5" y2="10.5" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  Scan: ({ active }) => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.2" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/><rect x="13" y="1" width="6" height="6" rx="1.2" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/><rect x="1" y="13" width="6" height="6" rx="1.2" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/><line x1="13" y1="13" x2="19" y2="13" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/><line x1="13" y1="13" x2="13" y2="19" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/><line x1="19" y1="16" x2="16" y2="16" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/><line x1="16" y1="19" x2="16" y2="16" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  About: ({ active }) => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4"/><circle cx="10" cy="6.5" r="1" fill={active ? 'var(--violet)' : 'var(--t3)'}/><line x1="10" y1="9.5" x2="10" y2="14.5" stroke={active ? 'var(--violet)' : 'var(--t3)'} strokeWidth="1.4" strokeLinecap="round"/></svg>),
};

const NAV_TABS = [
  { id: 'sessions', label: 'Sessions', Ic: Icon.Sessions },
  { id: 'create',   label: 'Create',   Ic: Icon.Create   },
  { id: 'join',     label: 'Join',     Ic: Icon.Join     },
  { id: 'scanner',  label: 'Scan',     Ic: Icon.Scan     },
  { id: 'about',    label: 'About',    Ic: Icon.About    },
];

const LogoIcon = () => (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="url(#logoGrad)" strokeWidth="1.2" fill="none"/><circle cx="9" cy="9" r="4" stroke="url(#logoGrad)" strokeWidth="0.8" fill="none" opacity="0.5"/><circle cx="9" cy="9" r="2" fill="url(#logoGrad)"/><defs><linearGradient id="logoGrad" x1="0" y1="0" x2="18" y2="18"><stop offset="0%" stopColor="#6c63ff"/><stop offset="100%" stopColor="#3da9fc"/></linearGradient></defs></svg>);

const WireframeDeco = () => (<><div className="wireframe-deco" style={{ top: -40, right: -60, width: 280, height: 280 }}><svg viewBox="0 0 280 280" fill="none"><polygon points="140,8 272,72 272,208 140,272 8,208 8,72" stroke="#6c63ff" strokeWidth="0.8" fill="none"/><polygon points="140,36 244,90 244,190 140,244 36,190 36,90" stroke="#6c63ff" strokeWidth="0.5" fill="none"/><line x1="140" y1="8" x2="140" y2="272" stroke="#6c63ff" strokeWidth="0.3"/><line x1="8" y1="72" x2="272" y2="208" stroke="#6c63ff" strokeWidth="0.3"/><line x1="8" y1="208" x2="272" y2="72" stroke="#6c63ff" strokeWidth="0.3"/></svg></div><div className="wireframe-deco" style={{ bottom: -80, left: -50, width: 240, height: 240 }}><svg viewBox="0 0 240 240" fill="none"><rect x="16" y="16" width="208" height="208" stroke="#3da9fc" strokeWidth="0.7" fill="none"/><rect x="48" y="48" width="144" height="144" stroke="#3da9fc" strokeWidth="0.4" fill="none" transform="rotate(15 120 120)"/><circle cx="120" cy="120" r="72" stroke="#3da9fc" strokeWidth="0.4" fill="none" strokeDasharray="4 8"/></svg></div></>);

export default function App() {
  const [sessions, setSessions]             = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeTab, setActiveTab]           = useState('sessions');
  const [pendingSession, setPendingSession] = useState(null);

  const addSessionToList = useCallback((sessionData, isCreator) => {
    const newId = Date.now().toString();
    setSessions(prev => [...prev, {
      id: newId,
      code: sessionData.code,
      name: sessionData.code || `CLIP-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
      lastMessage: isCreator ? '// created by you' : '// joined session',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      data: sessionData,
      isCreator,
    }]);
    setActiveSessionId(newId);
    setActiveTab('sessions');
  }, []);

  const addSession = useCallback((sessionData, isCreator) => {
    if (isCreator) {
      setPendingSession(sessionData);
    } else {
      addSessionToList(sessionData, false);
    }
  }, [addSessionToList]);

  const handlePendingClose = useCallback(() => {
    setPendingSession(prev => {
      if (prev) addSessionToList(prev, true);
      return null;
    });
  }, [addSessionToList]);

  const removeSession = useCallback((sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setActiveSessionId(prev => {
      if (prev !== sessionId) return prev;
      return null;
    });
  }, []);

  const updateSessionActivity = useCallback((sessionId) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? {
        ...s,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: s.id !== sessionId ? s.unread + 1 : 0,
      } : s
    ));
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Stable callbacks for ClipboardView — recreate nahi honge
  const handleLeave = useCallback(() => {
    if (activeSession) {
      removeSession(activeSession.id);
      setActiveTab('sessions');
    }
  }, [activeSession?.id, removeSession]);

  const handleActivity = useCallback(() => {
    if (activeSession) updateSessionActivity(activeSession.id);
  }, [activeSession?.id, updateSessionActivity]);

  const renderContent = () => {
    if (activeTab === 'sessions') {
      return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 20px' }}>
          {sessions.length === 0 ? (
            <div className="empty-state fade-in">
              <div style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: 16, background: 'linear-gradient(135deg, var(--violet-faint), var(--sky-faint))', border: '1.5px solid var(--border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md), 0 1px 0 rgba(255,255,255,0.9) inset' }}>
                <Icon.Sessions active={false} />
              </div>
              <p style={{ fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>No sessions yet</p>
              <p className="slash-label" style={{ marginTop: 8 }}>create or join one to begin</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
                <button className="ice-btn btn-ice" style={{ width: 'auto', padding: '10px 22px', fontSize: 13 }} onClick={() => setActiveTab('create')}>✦ Create</button>
                <button className="ice-btn btn-teal" style={{ width: 'auto', padding: '10px 22px', fontSize: 13 }} onClick={() => setActiveTab('join')}>▶ Join</button>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              <p className="section-label">Active Sessions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sessions.map(session => (
                  <div key={session.id} className="session-row bracketed" onClick={() => { setActiveSessionId(session.id); setActiveTab('chat'); }}>
                    <div className="session-avatar">{session.name.charAt(0)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-d)', fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{session.name}</p>
                      <p style={{ fontFamily: 'var(--font-m)', fontSize: 9.5, color: 'var(--t3)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.lastMessage}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--t3)' }}>{session.timestamp}</span>
                      {session.unread > 0 && <span className="unread-badge">{session.unread}</span>}
                    </div>
                    <button className="ice-btn btn-danger" style={{ width: 'auto', padding: '5px 10px', fontSize: 11, marginLeft: 8, flexShrink: 0 }} onClick={e => { e.stopPropagation(); removeSession(session.id); }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'chat' && activeSession) {
      return (
        <ClipboardView
          key={activeSession.id}
          session={activeSession.data}
          onLeave={handleLeave}
          onActivity={handleActivity}
        />
      );
    }

    if (activeTab === 'create') {
      return (
        <div style={{ padding: '14px 16px 24px' }} className="fade-in">
          <p className="section-label" style={{ marginTop: 4 }}>New Session</p>
          <div className="glass-card card-3d" style={{ padding: '24px 20px', marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #a78bfa, #6c63ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(108,99,255,0.35)' }}>
                <Icon.Create active={true} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>Create Session</h2>
                <p className="slash-label">generate · share · sync</p>
              </div>
            </div>
            <CreateSession onSessionCreated={addSession} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            <span className="chip chip-ice">✦ Anonymous</span>
            <span className="chip chip-teal">⚡ Real-time</span>
            <span className="chip chip-lavender">⧗ 2.5h Expiry</span>
            <span className="chip chip-amber">⇅ File Sync</span>
          </div>
        </div>
      );
    }

    if (activeTab === 'join') {
      return (
        <div style={{ padding: '14px 16px 24px' }} className="fade-in">
          <p className="section-label" style={{ marginTop: 4 }}>Join Session</p>
          <div className="glass-card card-3d" style={{ padding: '24px 20px', marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #6ee7b7, #2ec4b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(46,196,182,0.30)' }}>
                <Icon.Join active={true} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>Join Session</h2>
                <p className="slash-label">enter credentials or scan QR</p>
              </div>
            </div>
            <JoinSession onSessionJoined={addSession} />
          </div>
        </div>
      );
    }

    if (activeTab === 'scanner') {
      return (
        <div style={{ padding: '14px 16px 24px' }} className="fade-in">
          <p className="section-label" style={{ marginTop: 4 }}>QR Scan</p>
          <div className="glass-card card-3d" style={{ padding: '24px 20px', marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(139,92,246,0.30)' }}>
                <Icon.Scan active={true} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 800, color: 'var(--t1)' }}>Scan QR Code</h2>
                <p className="slash-label">point camera at the code</p>
              </div>
            </div>
            <QRScanner onScan={(code, password) => addSession({ code, password, sessionId: null, textContent: '', files: [], expiresAt: Date.now() + 9000000 }, false)} />
          </div>
        </div>
      );
    }

    if (activeTab === 'about') {
      return (
        <div style={{ padding: '14px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }} className="fade-in">
          <div className="glass-card float-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div className="hero-grad-line" />
            <div style={{ width: 72, height: 72, margin: '0 auto 20px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: 20, background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)', boxShadow: '0 16px 40px rgba(108,99,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'perspective(200px) rotateX(-6deg)' }}>
                <svg viewBox="0 0 40 40" width="38" height="38" fill="none"><rect x="5" y="5" width="12" height="12" rx="3" fill="#6c63ff" opacity="0.85"/><rect x="23" y="5" width="12" height="12" rx="3" fill="#3da9fc" opacity="0.85"/><rect x="5" y="23" width="12" height="12" rx="3" fill="#2ec4b6" opacity="0.85"/><rect x="23" y="23" width="12" height="12" rx="3" fill="#a78bfa" opacity="0.85"/></svg>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 38, fontWeight: 900, letterSpacing: -0.5, marginBottom: 8, background: 'linear-gradient(135deg, #1a1535 0%, #6c63ff 60%, #3da9fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ClipShare</h1>
            <p className="slash-label" style={{ marginBottom: 22 }}>Sync. Share. Vanish.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="chip chip-ice">Anonymous</span>
              <span className="chip chip-teal">Real-time</span>
              <span className="chip chip-lavender">2.5h Expiry</span>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '4px 20px' }}>
            {[['Author','Shailendra Meghwal'],['Version','2026 · v1.0'],['License','All Rights Reserved'],['Protocol','WebSocket + REST']].map(([k,v]) => (
              <div key={k} className="meta-row">
                <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--t3)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-d)', fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <p className="section-label" style={{ marginTop: 0, marginBottom: 14 }}>How It Works</p>
            {[['01','Create','Generate a session — get a unique code and password'],['02','Share','Send the credentials to another device or person'],['03','Sync','Text and files sync across devices in real-time'],['04','Vanish','Session auto-expires after 2.5 hours, no traces']].map(([n,t,d]) => (
              <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1, background: 'linear-gradient(135deg, var(--violet-faint), var(--sky-faint))', border: '1px solid var(--border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-m)', fontSize: 8, color: 'var(--violet)', fontWeight: 600 }}>{n}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-d)', fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{t}</div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 9.5, color: 'var(--t3)', marginTop: 3 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div className="animated-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <WireframeDeco />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '14px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.70)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(210,218,242,0.88)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', flexShrink: 0, boxShadow: '0 2px 12px rgba(108,99,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', border: '1.5px solid rgba(108,99,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(108,99,255,0.18)', transform: 'perspective(100px) rotateX(-4deg)' }}>
              <LogoIcon />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-d)', fontSize: 19, fontWeight: 900, letterSpacing: '-0.3px', background: 'linear-gradient(135deg, #1a1535 0%, #6c63ff 60%, #3da9fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ClipShare</div>
              <div className="slash-label" style={{ marginTop: 1 }}>Anonymous · Real-time</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--t3)', letterSpacing: 1.5 }}>{sessions.length > 0 ? `${sessions.length} active` : 'offline'}</span>
            <div className="status-dot" />
          </div>
        </header>
        <main style={{ flex: 1, overflow: 'hidden' }}>
          {renderContent()}
        </main>
        <nav style={{ background: 'rgba(205,213,238,0.94)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderTop: '1px solid rgba(255,255,255,0.72)', padding: '10px 4px 20px', display: 'flex', justifyContent: 'space-around', flexShrink: 0, boxShadow: '0 -4px 20px rgba(108,99,255,0.06)' }}>
          {NAV_TABS.map(({ id, label, Ic }) => {
            const isActive = activeTab === id || (activeTab === 'chat' && id === 'sessions');
            return (
              <button key={id} className={`nav-btn${isActive ? ' active' : ''}`} onClick={() => setActiveTab(id)}>
                <div className="nav-icon"><Ic active={isActive} /></div>
                <span className="nav-label">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {pendingSession && (
        <QRCodeModal
          code={pendingSession.code}
          password={pendingSession.password}
          onClose={handlePendingClose}
        />
      )}
    </div>
  );
}
