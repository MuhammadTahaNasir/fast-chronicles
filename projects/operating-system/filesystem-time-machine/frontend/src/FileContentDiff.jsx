import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const FileContentDiff = ({ isDarkTheme }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshots, setSelectedSnapshots] = useState({ snapshot1: '', snapshot2: '' });
  const [diffResult, setDiffResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const iconColor = '#10B981';

  const fetchSnapshots = async () => {
    try {
      const res = await fetch(`${API_BASE}/snapshots/list`);
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch (err) {
      console.error('Failed to fetch snapshots for diff');
    }
  };

  const fetchDiff = async () => {
    if (!selectedSnapshots.snapshot1 || !selectedSnapshots.snapshot2) {
      setError('Please select both snapshots');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/snapshots/diff?index1=${selectedSnapshots.snapshot1}&index2=${selectedSnapshots.snapshot2}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setDiffResult(null);
      } else {
        setDiffResult(data);
      }
    } catch (err) {
      setError('Failed to fetch diff');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const handleSnapshotChange = (e) => {
    setSelectedSnapshots({
      ...selectedSnapshots,
      [e.target.name]: e.target.value
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderDiffSection = (title, files, color) => {
    if (!files || files.length === 0) {
      return (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ color, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="17" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="7" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="17" y1="18" x2="7" y2="18"/>
            </svg>
            {title}
          </h4>
          <div style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B', fontStyle: 'italic' }}>None</div>
        </div>
      );
    }

    return (
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="17" y1="10" x2="3" y2="10"/>
            <line x1="21" y1="6" x2="7" y2="6"/>
            <line x1="21" y1="14" x2="3" y2="14"/>
            <line x1="17" y1="18" x2="7" y2="18"/>
          </svg>
          {title} ({files.length})
        </h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {files.map((file, index) => (
            <div key={index} style={{
              padding: '8px',
              borderLeft: `4px solid ${color}`,
              background: isDarkTheme ? '#23272f' : '#F8FAFC',
              marginBottom: '4px',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14 2z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                <div>
                  <div style={{ fontWeight: 'bold', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>{file.path}</div>
                  <div style={{ fontSize: '0.8em', color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>
                    Size: {formatFileSize(file.size)} | Modified: {new Date(file.mtime * 1000).toLocaleString()}
                  </div>
                  {file.content && (
                    <div style={{ fontSize: '0.8em', color: '#10B981' }}>
                      Content: {file.content.length} bytes stored
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        File Content Diff Viewer
      </h2>
      <p style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>
        Compare file contents between snapshots.
      </p>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '8px', fontWeight: 'bold', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>Snapshot 1:</label>
            <select
              name="snapshot1"
              value={selectedSnapshots.snapshot1}
              onChange={handleSnapshotChange}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                minWidth: '250px',
                background: isDarkTheme ? '#1E293B' : '#FFFFFF',
                color: isDarkTheme ? '#F8FAFC' : '#1E293B',
                border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
              }}
            >
              <option value="">Select snapshot...</option>
              {snapshots.map((snap, index) => (
                <option key={index} value={index}>
                  #{index} | {formatTime(snap.timestamp)} | {snap.file_count} files
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ marginRight: '8px', fontWeight: 'bold', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>Snapshot 2:</label>
            <select
              name="snapshot2"
              value={selectedSnapshots.snapshot2}
              onChange={handleSnapshotChange}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                minWidth: '250px',
                background: isDarkTheme ? '#1E293B' : '#FFFFFF',
                color: isDarkTheme ? '#F8FAFC' : '#1E293B',
                border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
              }}
            >
              <option value="">Select snapshot...</option>
              {snapshots.map((snap, index) => (
                <option key={index} value={index}>
                  #{index} | {formatTime(snap.timestamp)} | {snap.file_count} files
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchDiff}
            disabled={!selectedSnapshots.snapshot1 || !selectedSnapshots.snapshot2 || loading}
            style={{
              padding: '8px 16px',
              background: '#8B5CF6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: !selectedSnapshots.snapshot1 || !selectedSnapshots.snapshot2 || loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!(!selectedSnapshots.snapshot1 || !selectedSnapshots.snapshot2 || loading)) {
                e.target.style.background = '#A855F7';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#8B5CF6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M3 21v-5h5"/>
                </svg>
                Comparing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                Compare
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: '#F43F5E',
          color: '#fff',
          borderRadius: '8px',
          marginBottom: '16px',
          border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
        }}>
          {error}
        </div>
      )}

      {diffResult && (
        <div style={{
          padding: '12px',
          background: isDarkTheme ? '#23272f' : '#F8FAFC',
          borderRadius: '8px',
          marginBottom: '16px',
          border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
        }}>
          <h3 style={{ color: isDarkTheme ? '#F8FAFC' : '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="17" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="7" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="17" y1="18" x2="7" y2="18"/>
            </svg>
            Diff Results
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {renderDiffSection('➕ Added Files', diffResult.added, '#10B981')}
            {renderDiffSection('➖ Removed Files', diffResult.removed, '#F43F5E')}
            {renderDiffSection('🔄 Changed Files', diffResult.changed, '#F59E0B')}
          </div>
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: isDarkTheme ? '#3a3a3a' : '#E2E8F0',
            borderRadius: '8px',
            fontSize: '0.9em',
            color: isDarkTheme ? '#CBD5E1' : '#64748B',
            textAlign: 'center'
          }}>
            <strong>Summary:</strong> {diffResult.added?.length || 0} added, {diffResult.removed?.length || 0} removed, {diffResult.changed?.length || 0} changed
          </div>
        </div>
      )}

      {!diffResult && !loading && (
        <div style={{
          padding: '12px',
          background: isDarkTheme ? '#23272f' : '#F8FAFC',
          borderRadius: '8px',
          marginBottom: '16px',
          border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
        }}>
          <div style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B', fontStyle: 'italic', textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Select two snapshots to compare their file contents
          </div>
        </div>
      )}
    </div>
  );
};

export default FileContentDiff;