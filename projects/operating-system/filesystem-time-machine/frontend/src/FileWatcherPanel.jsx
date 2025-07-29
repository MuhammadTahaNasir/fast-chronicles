import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:8000';

const FileWatcherPanel = ({ isDarkTheme }) => {
  const [watcherStatus, setWatcherStatus] = useState('unknown');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [availableFolders, setAvailableFolders] = useState([]);
  const [isSelectingFolder, setIsSelectingFolder] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let interval;
    if (watcherStatus === 'started' || watcherStatus === 'already running') {
      fetchEvents();
      interval = setInterval(fetchEvents, 2000);
    }
    return () => clearInterval(interval);
  }, [watcherStatus]);

  // Get available folders from the system
  useEffect(() => {
    fetchAvailableFolders();
  }, []);

  const fetchAvailableFolders = async () => {
    try {
      const res = await fetch(`${API_BASE}/folders/available`);
      const data = await res.json();
      setAvailableFolders(data.folders || []);
    } catch (err) {
      // If API doesn't exist, use default folders
      setAvailableFolders([
        './tests',
        './frontend',
        './backend',
        './results',
        './scripts',
        './filesystem-time-machine',
        './filesystem-time-machine/frontend',
        './filesystem-time-machine/backend'
      ]);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE}/watcher/events`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      setError('Failed to fetch events');
    }
  };

  const startWatcher = async () => {
    if (!selectedFolder) {
      setError('Please select a folder to watch');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/watcher/start`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folder: selectedFolder })
      });
      const data = await res.json();
      setWatcherStatus(data.status);
    } catch (err) {
      setError('Failed to start watcher. Make sure the backend server is running.');
    }
    setLoading(false);
  };

  const stopWatcher = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/watcher/stop`, { method: 'POST' });
      const data = await res.json();
      setWatcherStatus(data.status);
    } catch (err) {
      setError('Failed to stop watcher');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'started':
      case 'already running':
        return '#10B981';
      case 'stopped':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'created':
        return '📄';
      case 'modified':
        return '✏️';
      case 'deleted':
        return '🗑️';
      case 'moved':
        return '📁';
      default:
        return '📋';
    }
  };

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    setIsSelectingFolder(false);
  };

  const openFolderSelector = () => {
    setIsSelectingFolder(true);
  };

  // File input handling for folder selection
  const handleFileInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Get the folder path from the selected file
      const folderPath = file.webkitRelativePath.split('/')[0];
      setSelectedFolder(`./${folderPath}`);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Drag and drop handling
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const items = e.dataTransfer.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry && entry.isDirectory) {
            setSelectedFolder(entry.fullPath || entry.name);
            break;
          }
        }
      }
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2c-1.4 0-2.8.4-4 1.1A7 7 0 0 0 3 10v6a7 7 0 0 0 7 7h4a7 7 0 0 0 7-7V6a7 7 0 0 0-9-6.9z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          File Watcher Control
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: getStatusColor(watcherStatus),
            animation: watcherStatus === 'started' || watcherStatus === 'already running' ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            {watcherStatus === 'started' || watcherStatus === 'already running' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      
      <p>Monitor and control file system events in real-time. Select any folder to watch for changes.</p>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3>Control Panel</h3>
          
          {/* Drag & Drop Area */}
          <div
            style={{
              border: `2px dashed ${isDragOver ? '#10B981' : 'var(--border)'}`,
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              background: isDragOver ? 'var(--primary-50)' : 'var(--surface-hover)',
              transition: 'all 0.3s ease',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📁</div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {isDragOver ? 'Drop folder here' : 'Select Folder to Watch'}
            </h4>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Drag and drop a folder here, or click to browse
            </p>
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              📁 Browse Folders
            </button>
          </div>

          {/* Hidden file input for folder selection */}
          <input
            ref={fileInputRef}
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />

          {/* Manual folder input */}
          <div className="form-group">
            <label className="form-label">Or enter folder path manually:</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                placeholder="e.g., ./my-folder or C:\my-folder"
              />
              <button
                onClick={openFolderSelector}
                className="btn btn-secondary"
                style={{ whiteSpace: 'nowrap' }}
              >
                📋 Quick Select
              </button>
            </div>
          </div>

          {/* Folder Selector Modal */}
          {isSelectingFolder && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div className="card" style={{
                maxWidth: '500px',
                width: '90%',
                maxHeight: '400px',
                overflow: 'hidden'
              }}>
                <div className="card-header">
                  <h3 className="card-title">Quick Select Folder</h3>
                  <button
                    onClick={() => setIsSelectingFolder(false)}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {availableFolders.map((folder, index) => (
                    <button
                      key={index}
                      onClick={() => handleFolderSelect(folder)}
                      className="btn btn-secondary"
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        marginBottom: '8px',
                        textAlign: 'left'
                      }}
                    >
                      📁 {folder}
                    </button>
                  ))}
                  <div style={{ padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      Or use drag & drop above for any folder
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={startWatcher}
              disabled={loading || watcherStatus === 'started' || watcherStatus === 'already running' || !selectedFolder}
              className="btn btn-success"
            >
              {loading ? <div className="loading" /> : 'Start Watching'}
            </button>
            <button
              onClick={stopWatcher}
              disabled={loading || watcherStatus === 'stopped'}
              className="btn btn-danger"
            >
              {loading ? <div className="loading" /> : 'Stop Watching'}
            </button>
          </div>

          {selectedFolder && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface-hover)', borderRadius: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Currently watching: <span style={{ color: '#10B981' }}>{selectedFolder}</span>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>
                {events.length}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Total Events
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B' }}>
                {events.filter(e => e.event_type === 'modified').length}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Modified Files
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>
                {events.filter(e => e.event_type === 'created').length}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                New Files
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>
                {events.filter(e => e.event_type === 'deleted').length}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Deleted Files
              </div>
            </div>
          </div>

          {watcherStatus === 'started' || watcherStatus === 'already running' ? (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <div className="badge badge-success">
                🟢 Live Monitoring Active
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <div className="badge badge-warning">
                ⚠️ Monitoring Inactive
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Events</h3>
          <span className="badge badge-primary">{events.length} Events</span>
        </div>
        
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <p>No events detected yet. Start watching a folder to see file changes.</p>
            {watcherStatus !== 'started' && watcherStatus !== 'already running' && (
              <button
                onClick={openFileDialog}
                className="btn btn-primary"
                style={{ marginTop: '16px' }}
              >
                📁 Select Folder to Watch
              </button>
            )}
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {events.slice(-20).reverse().map((event, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <div style={{ fontSize: '20px' }}>
                  {getEventIcon(event.event_type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {event.filename || event.src_path}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {event.event_type} • {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
                <span className={`badge badge-${
                  event.event_type === 'created' ? 'success' :
                  event.event_type === 'modified' ? 'warning' :
                  event.event_type === 'deleted' ? 'danger' : 'info'
                }`}>
                  {event.event_type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default FileWatcherPanel;