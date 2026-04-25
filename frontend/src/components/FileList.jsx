import React, { useState } from 'react';

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(file) {
  const name = (file.originalName || '').toLowerCase();
  const type = (file.mimeType || '').toLowerCase();
  if (type.startsWith('image/'))   return '🖼️';
  if (type.startsWith('video/'))   return '🎬';
  if (type.startsWith('audio/'))   return '🎵';
  if (type === 'application/pdf')  return '📄';
  if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.gz')) return '🗜️';
  if (['js','ts','jsx','tsx','py','go','rs','cpp','c','java','css','html'].some(e => name.endsWith('.'+e))) return '💻';
  if (type.startsWith('text/'))    return '📝';
  if (name.endsWith('.xlsx') || name.endsWith('.csv')) return '📊';
  return '📎';
}

export default function FileList({ files, onDownload, onDelete }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
  };

  if (!files || files.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '32px 20px',
        border: '1.5px dashed var(--border-mid)',
        borderRadius: 'var(--r-md)',
        background: 'rgba(108,99,255,0.04)',
      }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
        <p style={{ fontFamily: 'var(--font-d)', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 5 }}>
          No files shared yet
        </p>
        <p style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--t3)', letterSpacing: 1 }}>
          upload a file to share with the other device
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <label className="field-label" style={{ margin: 0 }}>Shared Files</label>
        <span style={{
          fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--violet)',
          background: 'var(--violet-faint)',
          border: '1px solid var(--border-mid)',
          padding: '2px 9px', borderRadius: 20, fontWeight: 600,
        }}>
          {files.length}
        </span>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        maxHeight: 260, overflowY: 'auto',
        paddingRight: 2,
      }}>
        {files.map((file) => (
          <div key={file.id} className="file-item">
            <div className="file-icon">{getFileIcon(file)}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'var(--font-d)', fontSize: 12, fontWeight: 600,
                color: 'var(--t1)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {file.originalName}
              </p>
              <p style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--t3)', marginTop: 2 }}>
                {formatFileSize(file.size)}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => onDownload(file.id, file.originalName)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(108,99,255,0.25)',
                  background: 'var(--violet-faint)',
                  color: 'var(--violet)',
                  fontFamily: 'var(--font-m)',
                  fontSize: 10, fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.16)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(108,99,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--violet-faint)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                ↓ Save
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                disabled={deleting === file.id}
                style={{
                  padding: '5px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(242,107,107,0.22)',
                  background: 'var(--rose-faint)',
                  color: 'var(--rose)',
                  fontFamily: 'var(--font-m)',
                  fontSize: 10, fontWeight: 600,
                  cursor: deleting === file.id ? 'not-allowed' : 'pointer',
                  opacity: deleting === file.id ? 0.5 : 1,
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (deleting !== file.id) e.currentTarget.style.background = 'rgba(242,107,107,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--rose-faint)'; }}
              >
                {deleting === file.id ? '...' : '✕'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}