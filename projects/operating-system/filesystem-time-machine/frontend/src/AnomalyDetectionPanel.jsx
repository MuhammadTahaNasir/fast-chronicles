import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const AnomalyDetectionPanel = ({ isDarkTheme }) => {
  const [anomalyStats, setAnomalyStats] = useState(null);
  const [anomalyReports, setAnomalyReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filePermissions, setFilePermissions] = useState([]);
  const [permLoading, setPermLoading] = useState(false);
  const [permError, setPermError] = useState('');
  const iconColor = '#8B5CF6';

  const fetchAnomalyStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/watcher/anomaly-stats`);
      const data = await res.json();
      setAnomalyStats(data);
    } catch (err) {
      console.error('Failed to fetch anomaly statistics');
    }
  };

  const fetchAnomalyReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/watcher/anomaly-reports`);
      const data = await res.json();
      setAnomalyReports(data.anomaly_reports || []);
    } catch (err) {
      console.error('Failed to fetch anomaly reports');
    }
  };

  const fetchFilePermissions = async () => {
    setPermLoading(true);
    setPermError('');
    try {
      const res = await fetch(`${API_BASE}/snapshots/list`);
      const data = await res.json();
      const snapshots = data.snapshots || [];
      if (snapshots.length === 0) {
        setFilePermissions([]);
        setPermLoading(false);
        return;
      }
      const latestIndex = snapshots.length - 1;
      const detailRes = await fetch(`${API_BASE}/snapshots/get?index=${latestIndex}`);
      const detailData = await detailRes.json();
      setFilePermissions(detailData.files || []);
    } catch (err) {
      setPermError('Failed to fetch file permissions');
      setFilePermissions([]);
    }
    setPermLoading(false);
  };

  useEffect(() => {
    fetchAnomalyStats();
    fetchAnomalyReports();
    fetchFilePermissions();
    const interval = setInterval(() => {
      fetchAnomalyStats();
      fetchAnomalyReports();
      fetchFilePermissions();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
        return '#F43F5E';
      case 'MEDIUM':
        return '#F59E0B';
      case 'LOW':
        return '#10B981';
      default:
        return '#888';
    }
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
            <path d="M12 2c-1.4 0-2.8.4-4 1.1A7 7 0 0 0 3 10v6a7 7 0 0 0 7 7h4a7 7 0 0 0 7-7V6a7 7 0 0 0-9-6.9z"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        Anomaly Detection (ML)
      </h2>
      <p style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>
        Monitor file access, permissions, and anomalies in real time.
      </p>

      {/* Permissions Table */}
      <h3 style={{ marginTop: 24, color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>File Permissions (Latest Snapshot)</h3>
      {permLoading ? (
        <div style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B', fontStyle: 'italic', marginBottom: 8 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M3 21v-5h5"/>
          </svg>
          Loading file permissions...
        </div>
      ) : permError ? (
        <div style={{ color: '#F43F5E', fontStyle: 'italic', marginBottom: 8 }}>{permError}</div>
      ) : filePermissions.length === 0 ? (
        <div style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B', fontStyle: 'italic', marginBottom: 8 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14 2z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
          No snapshot data available. Create a snapshot to see file permissions.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: isDarkTheme ? '#23272f' : '#F8FAFC',
            borderRadius: 8,
            border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
          }}>
            <thead>
              <tr style={{ background: isDarkTheme ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>File</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>Permissions</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>Owner (UID)</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>Group (GID)</th>
              </tr>
            </thead>
            <tbody>
              {filePermissions.slice(0, 20).map((f, i) => (
                <tr key={i} style={{ borderBottom: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14 2z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    {f.path}
                  </td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>{f.permissions || '-'}</td>
                  <td style={{ padding: '0.5rem', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>{f.uid !== undefined ? f.uid : '-'}</td>
                  <td style={{ padding: '0.5rem', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>{f.gid !== undefined ? f.gid : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filePermissions.length > 20 && (
            <div style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B', fontSize: '0.9em', marginTop: 4 }}>
              Showing first 20 files. View snapshot details for more.
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {anomalyStats && (
        <div style={{
          background: isDarkTheme ? '#23272f' : '#F8FAFC',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
        }}>
          <h3 style={{ color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>Detection Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
            <div style={{ padding: '8px', background: isDarkTheme ? '#3a3a3a' : '#E2E8F0', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.9em', color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>Events Processed</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>{anomalyStats.total_events_processed}</div>
            </div>
            <div style={{ padding: '8px', background: isDarkTheme ? '#3a3a3a' : '#E2E8F0', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.9em', color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>Suspicious Patterns</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>{anomalyStats.suspicious_patterns_detected}</div>
            </div>
            <div style={{ padding: '8px', background: isDarkTheme ? '#3a3a3a' : '#E2E8F0', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.9em', color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>Active Files</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>{anomalyStats.file_activity_count}</div>
            </div>
            <div style={{ padding: '8px', background: isDarkTheme ? '#3a3a3a' : '#E2E8F0', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.9em', color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>Window Size</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>{anomalyStats.window_size}</div>
            </div>
          </div>
        </div>
      )}

      {/* Anomaly Reports */}
      <div>
        <h3 style={{ color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>Recent Anomaly Reports</h3>
        {anomalyReports.length === 0 ? (
          <div style={{
            padding: '16px',
            background: isDarkTheme ? '#23272f' : '#F8FAFC',
            borderRadius: '8px',
            color: isDarkTheme ? '#CBD5E1' : '#64748B',
            fontStyle: 'italic',
            textAlign: 'center',
            border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M12 2c-1.4 0-2.8.4-4 1.1A7 7 0 0 0 3 10v6a7 7 0 0 0 7 7h4a7 7 0 0 0 7-7V6a7 7 0 0 0-9-6.9z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            No anomalies detected yet. The system is monitoring file activity...
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {anomalyReports.map((report, index) => (
              <div key={index} style={{
                marginBottom: '12px',
                padding: '12px',
                background: isDarkTheme ? '#23272f' : '#F8FAFC',
                borderRadius: '8px',
                border: `2px solid ${getSeverityColor(report.severity)}`,
                borderLeft: `6px solid ${getSeverityColor(report.severity)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', color: getSeverityColor(report.severity) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                      <path d="M12 2c-1.4 0-2.8.4-4 1.1A7 7 0 0 0 3 10v6a7 7 0 0 0 7 7h4a7 7 0 0 0 7-7V6a7 7 0 0 0-9-6.9z"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    {report.severity} Severity Alert
                  </div>
                  <div style={{ fontSize: '0.8em', color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>
                    {formatTime(report.timestamp)}
                  </div>
                </div>
                <div style={{ marginBottom: '8px', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>
                  <strong>Recommendation:</strong> {report.recommendation}
                </div>
                <div>
                  <strong>Detected Anomalies:</strong>
                  <ul style={{ margin: '4px 0', paddingLeft: '20px', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>
                    {report.anomalies.map((anomaly, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <strong>{anomaly.type.replace('_', ' ').toUpperCase()}:</strong> {anomaly.description}
                        {anomaly.suspicious_files && (
                          <div style={{ marginLeft: '16px', fontSize: '0.9em', color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>
                            Files: {anomaly.suspicious_files.map(f => f.file).join(', ')}
                          </div>
                        )}
                        {anomaly.patterns && (
                          <div style={{ marginLeft: '16px', fontSize: '0.9em', color: isDarkTheme ? '#CBD5E1' : '#64748B' }}>
                            Patterns: {anomaly.patterns.map(p => p.description).join(', ')}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: isDarkTheme ? '#23272f' : '#F8FAFC',
        borderRadius: '8px',
        fontSize: '0.9em',
        color: isDarkTheme ? '#CBD5E1' : '#64748B',
        border: isDarkTheme ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid #E2E8F0'
      }}>
        <strong>Detection Features:</strong>
        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
          <li>Rapid file creation/deletion detection</li>
          <li>Suspicious file pattern recognition</li>
          <li>Unusual activity pattern analysis</li>
          <li>Real-time anomaly scoring</li>
        </ul>
      </div>
    </div>
  );
};

export default AnomalyDetectionPanel;