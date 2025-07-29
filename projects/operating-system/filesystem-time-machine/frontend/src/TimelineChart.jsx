import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const TimelineChart = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSnapshots = async () => {
    try {
      const res = await fetch(`${API_BASE}/snapshots/list`);
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch (err) {
      console.error('Failed to fetch snapshots for timeline');
    }
  };

  useEffect(() => {
    fetchSnapshots();
    const interval = setInterval(fetchSnapshots, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSnapshotClick = (index) => {
    setSelectedSnapshot(index);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (snapshots.length === 0) {
    return (
      <div>
        <h3>Timeline</h3>
        <p>No snapshots yet. Create some snapshots to see the timeline!</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Timeline View</h3>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '8px',
        background: '#2a2a2a',
        borderRadius: '4px'
      }}>
        {snapshots.map((snap, index) => (
          <div
            key={index}
            onClick={() => handleSnapshotClick(index)}
            style={{
              padding: '12px',
              background: selectedSnapshot === index ? '#8B5CF6' : '#3a3a3a',
              borderRadius: '6px',
              cursor: 'pointer',
              border: '1px solid #4a4a4a',
              transition: 'all 0.2s ease',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              if (selectedSnapshot !== index) {
                e.target.style.background = '#4a4a4a';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSnapshot !== index) {
                e.target.style.background = '#3a3a3a';
              }
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold', color: selectedSnapshot === index ? '#fff' : '#e0e0e0' }}>
                Snapshot #{index}
              </div>
              <div style={{ fontSize: '0.9em', color: selectedSnapshot === index ? '#e0e0e0' : '#b0b0b0' }}>
                {formatDate(snap.timestamp)} at {formatTime(snap.timestamp)}
              </div>
            </div>
            <div style={{ 
              background: '#555', 
              padding: '4px 8px', 
              borderRadius: '12px',
              fontSize: '0.8em',
              color: '#fff'
            }}>
              {snap.file_count} files
            </div>
          </div>
        ))}
      </div>
      {selectedSnapshot !== null && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#2a2a2a', 
          borderRadius: '6px',
          border: '1px solid #4a4a4a'
        }}>
          <h4>Selected: Snapshot #{selectedSnapshot}</h4>
          <p>Time: {formatDate(snapshots[selectedSnapshot]?.timestamp)} at {formatTime(snapshots[selectedSnapshot]?.timestamp)}</p>
          <p>Files: {snapshots[selectedSnapshot]?.file_count}</p>
        </div>
      )}
    </div>
  );
};

export default TimelineChart; 