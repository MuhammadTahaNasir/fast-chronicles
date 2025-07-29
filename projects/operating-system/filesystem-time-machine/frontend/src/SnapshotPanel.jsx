import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const SnapshotPanel = ({ isDarkTheme }) => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [snapshotDetail, setSnapshotDetail] = useState(null);
  const [diffIndices, setDiffIndices] = useState({ index1: '', index2: '' });
  const [diffResult, setDiffResult] = useState(null);
  const [restoreMsg, setRestoreMsg] = useState('');

  const fetchSnapshots = async () => {
    try {
      const res = await fetch(`${API_BASE}/snapshots/list`);
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch (err) {
      setError('Failed to fetch snapshots');
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const createSnapshot = async () => {
    setLoading(true);
    setError('');
    try {
      await fetch(`${API_BASE}/snapshots/create`, { method: 'POST' });
      await fetchSnapshots();
    } catch (err) {
      setError('Failed to create snapshot');
    }
    setLoading(false);
  };

  const viewSnapshot = async (index) => {
    setSelected(index);
    setSnapshotDetail(null);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/snapshots/get?index=${index}`);
      const data = await res.json();
      setSnapshotDetail(data);
    } catch (err) {
      setError('Failed to fetch snapshot detail');
    }
  };

  const handleDiffChange = (e) => {
    setDiffIndices({ ...diffIndices, [e.target.name]: e.target.value });
  };

  const diffSnapshots = async () => {
    setDiffResult(null);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/snapshots/diff?index1=${diffIndices.index1}&index2=${diffIndices.index2}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setDiffResult(null);
      } else {
        setDiffResult(data);
      }
    } catch (err) {
      setError('Failed to diff snapshots');
    }
  };

  const restoreSnapshot = async (index) => {
    setRestoreMsg('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/snapshots/restore?index=${index}`, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'restored') {
        setRestoreMsg(`Restored to snapshot #${index} - Files with content restored!`);
      } else {
        setError(data.error || 'Restore failed');
      }
    } catch (err) {
      setError('Restore failed');
    }
    setLoading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getSnapshotIcon = (snapshot) => {
    const fileCount = snapshot.files ? snapshot.files.length : 0;
    if (fileCount > 100) return '📦';
    if (fileCount > 50) return '📁';
    if (fileCount > 10) return '📄';
    return '📋';
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
          </svg>
          </div>
          Smart Snapshots
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-primary">{snapshots.length} Snapshots</span>
        </div>
      </div>
      
      <p>Create point-in-time snapshots with complete file content preservation and metadata tracking.</p>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {restoreMsg && (
        <div className="alert alert-success">
          <strong>Success:</strong> {restoreMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3>Create Snapshot</h3>
          <p>Capture the current state of your file system.</p>
                <button
            onClick={createSnapshot}
                  disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? <div className="loading" /> : '📸 Create New Snapshot'}
                </button>
        </div>

        <div className="card">
          <h3>Compare Snapshots</h3>
          <div className="form-group">
            <label className="form-label">Snapshot 1</label>
          <select
            name="index1"
            value={diffIndices.index1}
            onChange={handleDiffChange}
              className="form-select"
            >
              <option value="">Select snapshot...</option>
              {snapshots.map((snapshot, index) => (
                <option key={index} value={index}>
                  Snapshot #{index} - {new Date(snapshot.timestamp).toLocaleString()}
              </option>
            ))}
          </select>
          </div>
          <div className="form-group">
            <label className="form-label">Snapshot 2</label>
          <select
            name="index2"
            value={diffIndices.index2}
            onChange={handleDiffChange}
              className="form-select"
            >
              <option value="">Select snapshot...</option>
              {snapshots.map((snapshot, index) => (
                <option key={index} value={index}>
                  Snapshot #{index} - {new Date(snapshot.timestamp).toLocaleString()}
              </option>
            ))}
          </select>
          </div>
          <button
            onClick={diffSnapshots}
            disabled={!diffIndices.index1 || !diffIndices.index2}
            className="btn btn-info"
            style={{ width: '100%' }}
          >
            🔍 Compare Snapshots
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Available Snapshots</h3>
        </div>

          {snapshots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
              <p>No snapshots available. Create your first snapshot to get started.</p>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {snapshots.map((snapshot, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
            padding: '12px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    background: selected === index ? 'var(--primary-100)' : 'transparent'
                  }}
                  onClick={() => viewSnapshot(index)}
                  onMouseEnter={(e) => e.target.style.background = selected === index ? 'var(--primary-100)' : 'var(--surface-hover)'}
                  onMouseLeave={(e) => e.target.style.background = selected === index ? 'var(--primary-100)' : 'transparent'}
                >
                  <div style={{ fontSize: '24px' }}>
                    {getSnapshotIcon(snapshot)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                      Snapshot #{index}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(snapshot.timestamp).toLocaleString()} • {snapshot.files ? snapshot.files.length : 0} files
                        </div>
                      </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreSnapshot(index);
                      }}
                      className="btn btn-warning"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      🔄 Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Snapshot Details</h3>
          </div>
          
          {!snapshotDetail ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p>Select a snapshot to view its details.</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h4>Snapshot #{selected}</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Created: {new Date(snapshotDetail.timestamp).toLocaleString()}
                </p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h5>Files ({snapshotDetail.files ? snapshotDetail.files.length : 0})</h5>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {snapshotDetail.files && snapshotDetail.files.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderBottom: '1px solid var(--border)',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>
                        {file.is_directory ? '📁' : '📄'}
                      </span>
                      <span style={{ flex: 1, color: 'var(--text-primary)' }}>
                        {file.path}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {formatFileSize(file.size || 0)}
                      </span>
                        </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {diffResult && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">Diff Results</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>
                {diffResult.added ? diffResult.added.length : 0}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Added Files
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>
                {diffResult.removed ? diffResult.removed.length : 0}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Removed Files
                        </div>
                      </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B' }}>
                {diffResult.modified ? diffResult.modified.length : 0}
                </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Modified Files
              </div>
            </div>
          </div>

          {(diffResult.added && diffResult.added.length > 0) && (
            <div style={{ marginTop: '16px' }}>
              <h5 style={{ color: '#10B981' }}>Added Files</h5>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {diffResult.added.map((file, index) => (
                  <div key={index} style={{ padding: '4px 8px', fontSize: '14px' }}>
                    + {file}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(diffResult.removed && diffResult.removed.length > 0) && (
            <div style={{ marginTop: '16px' }}>
              <h5 style={{ color: '#EF4444' }}>Removed Files</h5>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {diffResult.removed.map((file, index) => (
                  <div key={index} style={{ padding: '4px 8px', fontSize: '14px' }}>
                    - {file}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(diffResult.modified && diffResult.modified.length > 0) && (
            <div style={{ marginTop: '16px' }}>
              <h5 style={{ color: '#F59E0B' }}>Modified Files</h5>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {diffResult.modified.map((file, index) => (
                  <div key={index} style={{ padding: '4px 8px', fontSize: '14px' }}>
                    ~ {file}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default SnapshotPanel;