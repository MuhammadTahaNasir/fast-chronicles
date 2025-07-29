import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const Sidebar = () => {
  const [stats, setStats] = useState({
    snapshots: 0,
    events: 0,
    anomalies: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch snapshots count
        const snapshotsRes = await fetch(`${API_BASE}/snapshots/list`);
        const snapshotsData = await snapshotsRes.json();
        
        // Fetch events count
        const eventsRes = await fetch(`${API_BASE}/watcher/events`);
        const eventsData = await eventsRes.json();
        
        // Fetch anomaly stats
        const anomalyRes = await fetch(`${API_BASE}/watcher/anomaly-stats`);
        const anomalyData = await anomalyRes.json();
        
        setStats({
          snapshots: snapshotsData.snapshots?.length || 0,
          events: eventsData.events?.length || 0,
          anomalies: anomalyData.suspicious_patterns_detected || 0
        });
      } catch (err) {
        console.error('Failed to fetch stats');
      }
      setLoading(false);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { icon: '📸', label: 'Create Snapshot', action: 'create-snapshot' },
    { icon: '🔄', label: 'Start Watcher', action: 'start-watcher' },
    { icon: '⏹️', label: 'Stop Watcher', action: 'stop-watcher' },
    { icon: '📊', label: 'View Timeline', action: 'view-timeline' },
    { icon: '🛡️', label: 'Security Check', action: 'security-check' }
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'var(--panel)',
      borderRight: '1px solid var(--border)',
      padding: '1.5rem',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto',
      zIndex: 50
    }}>
      {/* Quick Stats */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>📈 Quick Stats</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            background: '#2A2A2A',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📸</span>
              <span style={{ fontWeight: 'bold' }}>Snapshots</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
              {loading ? '...' : stats.snapshots}
            </div>
          </div>
          
          <div style={{
            background: '#2A2A2A',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📁</span>
              <span style={{ fontWeight: 'bold' }}>File Events</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10B981' }}>
              {loading ? '...' : stats.events}
            </div>
          </div>
          
          <div style={{
            background: '#2A2A2A',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🛡️</span>
              <span style={{ fontWeight: 'bold' }}>Anomalies</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F59E0B' }}>
              {loading ? '...' : stats.anomalies}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: '#2A2A2A',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#3A3A3A';
                e.target.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#2A2A2A';
                e.target.style.borderColor = 'var(--border)';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>ℹ️ System Info</h3>
        <div style={{
          background: '#2A2A2A',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          fontSize: '0.85rem'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Platform:</strong> Windows
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Backend:</strong> FastAPI
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Frontend:</strong> React
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Watched:</strong> tests/
          </div>
          <div>
            <strong>Version:</strong> 1.0.0
          </div>
        </div>
      </div>

      {/* Help */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>❓ Quick Help</h3>
        <div style={{
          background: '#2A2A2A',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          fontSize: '0.85rem'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>
            💡 Create snapshots to save file states
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            🔄 Restore to go back in time
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            🔍 Compare snapshots to see changes
          </div>
          <div>
            🛡️ Monitor for suspicious activity
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 