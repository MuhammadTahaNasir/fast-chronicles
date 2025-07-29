import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const FolderBrowser = ({ isDarkTheme }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [folderStructure, setFolderStructure] = useState({});
  const [loading, setLoading] = useState(false);
  const iconColor = '#3B82F6';

  const fetchSnapshots = async () => {
    try {
      const res = await fetch(`${API_BASE}/snapshots/list`);
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch (err) {
      console.error('Failed to fetch snapshots for browser');
    }
  };

  const fetchFolderStructure = async (index) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/snapshots/get?index=${index}`);
      const data = await res.json();
      if (data.files) {
        const structure = {};
        data.files.forEach(file => {
          const parts = file.path.split('/');
          let current = structure;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
              current[parts[i]] = { type: 'folder', children: {} };
            }
            current = current[parts[i]].children;
          }
          current[parts[parts.length - 1]] = {
            type: 'file',
            size: file.size,
            mtime: file.mtime,
            content: file.content
          };
        });
        setFolderStructure(structure);
      }
    } catch (err) {
      console.error('Failed to fetch folder structure');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSnapshots();
  }, []);

  useEffect(() => {
    if (selectedSnapshot !== null) {
      fetchFolderStructure(selectedSnapshot);
    }
  }, [selectedSnapshot]);

  const renderFolderItem = (name, item, level = 0) => {
    const isFolder = item.type === 'folder';
    return (
      <div key={name} style={{ marginLeft: `${level * 20}px` }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 0',
          color: isFolder ? iconColor : (isDarkTheme ? '#F8FAFC' : '#1E293B')
        }}>
          <span style={{ marginRight: '8px', fontSize: '1.2em' }}>
            {isFolder ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14 2z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            )}
          </span>
          <span style={{ fontWeight: isFolder ? 'bold' : 'normal' }}>
            {name}
          </span>
          {!isFolder && (
            <span style={{
              marginLeft: '8px',
              fontSize: '0.8em',
              color: isDarkTheme ? '#CBD5E1' : '#64748B',
              background: isDarkTheme ? '#3a3a3a' : '#E2E8F0',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {item.size} bytes
            </span>
          )}
        </div>
        {isFolder && item.children && Object.keys(item.children).map(childName =>
          renderFolderItem(childName, item.children[childName], level + 1)
        )}
      </div>
    );
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div style={{
      padding: '1.5rem',
      color: isDarkTheme ? '#F8FAFC' : '#1E293B',
      background: isDarkTheme ? 'transparent' : '#FFFFFF'
    }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
        </div>
        Folder Browser
      </h2>
      <p style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>
        Browse folder structure of selected snapshot.
      </p>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ marginRight: '8px', fontWeight: 'bold', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>Select Snapshot:</label>
        <select
          value={selectedSnapshot || ''}
          onChange={(e) => setSelectedSnapshot(e.target.value ? parseInt(e.target.value) : null)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            minWidth: '300px',
            background: isDarkTheme ? '#1E293B' : '#FFFFFF',
            color: isDarkTheme ? '#F8FAFC' : '#1E293B',
            border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
          }}
        >
          <option value="">Choose a snapshot...</option>
          {snapshots.map((snap, index) => (
            <option key={index} value={index}>
              #{index} | {formatTime(snap.timestamp)} | {snap.file_count} files
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div style={{
          padding: '12px',
          background: isDarkTheme ? '#23272f' : '#F8FAFC',
          borderRadius: '8px',
          marginBottom: '16px',
          border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
        }}>
          <div style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B', fontStyle: 'italic', textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
            Loading folder structure...
          </div>
        </div>
      )}

      {selectedSnapshot !== null && !loading && (
        <div>
          <h3 style={{ color: isDarkTheme ? '#F8FAFC' : '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            Snapshot #{selectedSnapshot} - Folder Structure
          </h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Object.keys(folderStructure).length === 0 ? (
              <div style={{
                color: isDarkTheme ? '#CBD5E1' : '#64748B',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '20px',
                background: isDarkTheme ? '#23272f' : '#F8FAFC',
                borderRadius: '8px',
                border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                No files in this snapshot
              </div>
            ) : (
              Object.keys(folderStructure).map(name =>
                renderFolderItem(name, folderStructure[name])
              )
            )}
          </div>
        </div>
      )}

      {selectedSnapshot === null && !loading && (
        <div style={{
          padding: '12px',
          background: isDarkTheme ? '#23272f' : '#F8FAFC',
          borderRadius: '8px',
          marginBottom: '16px',
          border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
        }}>
          <div style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B', fontStyle: 'italic', textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M8 2v4"/>
              <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
              <path d="M16 4h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 14H11"/>
              <path d="m15 10-4 4 4 4"/>
            </svg>
            Select a snapshot to view its folder structure
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderBrowser;