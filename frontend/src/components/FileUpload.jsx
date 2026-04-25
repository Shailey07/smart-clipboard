import React, { useRef, useState } from 'react';

const FILE_ICONS = {
  image:       '🖼️',
  video:       '🎬',
  audio:       '🎵',
  pdf:         '📄',
  zip:         '🗜️',
  code:        '💻',
  text:        '📝',
  spreadsheet: '📊',
  default:     '📎',
};

function getFileIcon(file) {
  const type = file.type;
  const name = file.name.toLowerCase();
  if (type.startsWith('image/'))                    return FILE_ICONS.image;
  if (type.startsWith('video/'))                    return FILE_ICONS.video;
  if (type.startsWith('audio/'))                    return FILE_ICONS.audio;
  if (type === 'application/pdf')                   return FILE_ICONS.pdf;
  if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.gz')) return FILE_ICONS.zip;
  if (['js','ts','jsx','tsx','py','go','rs','cpp','c','java','css','html'].some(e => name.endsWith('.'+e))) return FILE_ICONS.code;
  if (type.startsWith('text/'))                     return FILE_ICONS.text;
  if (name.endsWith('.xlsx') || name.endsWith('.csv')) return FILE_ICONS.spreadsheet;
  return FILE_ICONS.default;
}

function formatSize(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/(1024*1024)).toFixed(1)} MB`;
}

export default function FileUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [queue, setQueue]         = useState([]);
  const fileInputRef              = useRef(null);

  const handleFiles = async (files) => {
    const arr = Array.from(files);
    if (!arr.length) return;

    setQueue(arr);
    setUploading(true);

    for (const file of arr) {
      await onUpload(file);
    }

    setUploading(false);
    setQueue([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onInputChange = (e) => handleFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label className="field-label">Attach Files</label>

      {/* Drop Zone */}
      <label
        className={`drop-zone${dragOver ? ' drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
      >
        <div style={{ pointerEvents: 'none' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>
            {uploading ? '⏳' : dragOver ? '📂' : '☁️'}
          </div>
          <p style={{ fontFamily: 'var(--font-d)', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 4 }}>
            {uploading ? 'Uploading...' : dragOver ? 'Drop to upload' : 'Click or drag files here'}
          </p>
          <p style={{ fontFamily: 'var(--font-m)', fontSize: 8.5, color: 'var(--t3)', letterSpacing: 1 }}>
            images · videos · docs · code · zip — up to 50MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={onInputChange}
          disabled={uploading}
        />
      </label>

      {/* Upload queue */}
      {queue.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {queue.map((file, i) => (
            <div key={i} className="file-item">
              <div className="file-icon">{getFileIcon(file)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-d)', fontSize: 12, fontWeight: 600,
                  color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {file.name}
                </p>
                <p style={{ fontFamily: 'var(--font-m)', fontSize: 9, color: 'var(--t3)', marginTop: 2 }}>
                  {formatSize(file.size)}
                </p>
              </div>
              {uploading && (
                <div style={{ flexShrink: 0 }}>
                  <div className="loading-bar" style={{ width: 52 }}>
                    <div className="loading-bar-inner" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}