import React, { useEffect, useState } from 'react';

const HealthStatus = () => {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('Backend not reachable'));
  }, []);

  return (
    <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px', marginBottom: '1rem' }}>
      <strong>Backend Status:</strong> {status}
    </div>
  );
};

export default HealthStatus; 