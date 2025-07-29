import React, { useState, useEffect } from 'react';

const OSConceptsPanel = ({ isDarkTheme }) => {
  const [activeTab, setActiveTab] = useState('filesystem');
  const [processes, setProcesses] = useState([]);
  const [memoryBlocks, setMemoryBlocks] = useState([]);
  const [diskRequests, setDiskRequests] = useState([]);
  const [currentHead, setCurrentHead] = useState(50);

  // File System Tree Data
  const fileSystemTree = {
    name: '/',
    type: 'directory',
    children: [
      {
        name: 'bin',
        type: 'directory',
        size: '2.1 MB',
        permissions: 'drwxr-xr-x',
        children: [
          { name: 'ls', type: 'executable', size: '45 KB', permissions: '-rwxr-xr-x' },
          { name: 'cp', type: 'executable', size: '32 KB', permissions: '-rwxr-xr-x' },
          { name: 'mv', type: 'executable', size: '28 KB', permissions: '-rwxr-xr-x' }
        ]
      },
      {
        name: 'home',
        type: 'directory',
        size: '156 MB',
        permissions: 'drwxr-xr-x',
        children: [
          {
            name: 'user',
            type: 'directory',
            size: '89 MB',
            permissions: 'drwxr-xr-x',
            children: [
              { name: 'Documents', type: 'directory', size: '45 MB', permissions: 'drwxr-xr-x' },
              { name: 'Downloads', type: 'directory', size: '23 MB', permissions: 'drwxr-xr-x' },
              { name: 'Desktop', type: 'directory', size: '12 MB', permissions: 'drwxr-xr-x' },
              { name: 'config.txt', type: 'file', size: '2.3 KB', permissions: '-rw-r--r--' }
            ]
          }
        ]
      },
      {
        name: 'etc',
        type: 'directory',
        size: '8.7 MB',
        permissions: 'drwxr-xr-x',
        children: [
          { name: 'passwd', type: 'file', size: '1.2 KB', permissions: '-rw-r--r--' },
          { name: 'hosts', type: 'file', size: '856 B', permissions: '-rw-r--r--' }
        ]
      },
      {
        name: 'var',
        type: 'directory',
        size: '234 MB',
        permissions: 'drwxr-xr-x',
        children: [
          { name: 'log', type: 'directory', size: '45 MB', permissions: 'drwxr-xr-x' },
          { name: 'tmp', type: 'directory', size: '12 MB', permissions: 'drwxr-xr-x' }
        ]
      }
    ]
  };

  // Process Management Data
  useEffect(() => {
    const generateProcesses = () => {
      const processTypes = ['system', 'user', 'daemon'];
      const newProcesses = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `process_${i + 1}`,
        type: processTypes[Math.floor(Math.random() * processTypes.length)],
        priority: Math.floor(Math.random() * 10) + 1,
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 512) + 64,
        status: ['running', 'waiting', 'sleeping'][Math.floor(Math.random() * 3)],
        startTime: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()
      }));
      setProcesses(newProcesses);
    };

    generateProcesses();
    const interval = setInterval(generateProcesses, 3000);
    return () => clearInterval(interval);
  }, []);

  // Memory Management Data
  useEffect(() => {
    const generateMemoryBlocks = () => {
      const blocks = [];
      let currentAddress = 0;
      const blockSizes = [64, 128, 256, 512, 1024];
      
      for (let i = 0; i < 16; i++) {
        const size = blockSizes[Math.floor(Math.random() * blockSizes.length)];
        const isAllocated = Math.random() > 0.3;
        const processId = isAllocated ? Math.floor(Math.random() * 8) + 1 : null;
        
        blocks.push({
          id: i,
          address: currentAddress,
          size,
          isAllocated,
          processId,
          fragmentation: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0
        });
        
        currentAddress += size;
      }
      setMemoryBlocks(blocks);
    };

    generateMemoryBlocks();
    const interval = setInterval(generateMemoryBlocks, 4000);
    return () => clearInterval(interval);
  }, []);

  // Disk Scheduling Data
  useEffect(() => {
    const generateDiskRequests = () => {
      const requests = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        cylinder: Math.floor(Math.random() * 100),
        arrivalTime: i * 100 + Math.floor(Math.random() * 50),
        processed: Math.random() > 0.7
      }));
      setDiskRequests(requests);
    };

    generateDiskRequests();
    const interval = setInterval(generateDiskRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderFileSystemTree = (node, level = 0) => {
    const icon = node.type === 'directory' ? '📁' : node.type === 'executable' ? '⚙️' : '📄';
    const color = node.type === 'directory' ? '#3B82F6' : node.type === 'executable' ? '#10B981' : '#6B7280';
    
    return (
      <div key={node.name} style={{ marginLeft: level * 20 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          color: isDarkTheme ? '#F8FAFC' : '#1E293B'
        }}
        onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = isDarkTheme ? '#334155' : '#F1F5F9'}
        onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}>
          <span style={{ fontSize: '16px' }}>{icon}</span>
          <span style={{ fontWeight: 500, color }}>{node.name}</span>
          <span style={{ fontSize: '12px', color: isDarkTheme ? '#94A3B8' : '#64748B' }}>
            {node.size} • {node.permissions}
          </span>
        </div>
        {node.children && node.children.map(child => renderFileSystemTree(child, level + 1))}
      </div>
    );
  };

  const renderProcessTable = () => (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Process Management</h3>
        <span className="badge badge-primary">{processes.length} Processes</span>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>PID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Priority</th>
            <th>CPU %</th>
            <th>Memory (MB)</th>
            <th>Status</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody>
          {processes.map(process => (
            <tr key={process.id}>
              <td>{process.id}</td>
              <td>{process.name}</td>
              <td>
                <span className={`badge badge-${process.type === 'system' ? 'danger' : process.type === 'user' ? 'success' : 'warning'}`}>
                  {process.type}
                </span>
              </td>
              <td>{process.priority}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '60px',
                    height: '8px',
                    background: isDarkTheme ? '#334155' : '#E2E8F0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${process.cpu}%`,
                      height: '100%',
                      background: process.cpu > 80 ? '#EF4444' : process.cpu > 50 ? '#F59E0B' : '#10B981',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <span>{process.cpu}%</span>
                </div>
              </td>
              <td>{process.memory}</td>
              <td>
                <span className={`badge badge-${process.status === 'running' ? 'success' : process.status === 'waiting' ? 'warning' : 'info'}`}>
                  {process.status}
                </span>
              </td>
              <td>{process.startTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMemoryVisualization = () => (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Memory Management</h3>
        <span className="badge badge-info">{memoryBlocks.length} Blocks</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '8px',
        marginTop: '16px'
      }}>
        {memoryBlocks.map(block => (
          <div key={block.id} style={{
            height: `${Math.max(block.size / 10, 40)}px`,
            background: block.isAllocated 
              ? `linear-gradient(135deg, ${block.fragmentation > 0 ? '#F59E0B' : '#10B981'}, ${block.fragmentation > 0 ? '#FCD34D' : '#34D399'})`
              : isDarkTheme ? '#334155' : '#F1F5F9',
            border: `2px solid ${isDarkTheme ? '#475569' : '#E2E8F0'}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 500,
            color: block.isAllocated ? 'white' : isDarkTheme ? '#94A3B8' : '#64748B',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {block.isAllocated && (
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '4px',
                fontSize: '10px',
                background: 'rgba(0,0,0,0.2)',
                padding: '1px 4px',
                borderRadius: '2px'
              }}>
                P{block.processId}
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div>{block.size}KB</div>
              {block.fragmentation > 0 && (
                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                  {block.fragmentation}% frag
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', gap: '16px', fontSize: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', background: '#10B981', borderRadius: '4px' }} />
          <span>Allocated</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', background: '#F59E0B', borderRadius: '4px' }} />
          <span>Fragmented</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', background: isDarkTheme ? '#334155' : '#F1F5F9', borderRadius: '4px' }} />
          <span>Free</span>
        </div>
      </div>
    </div>
  );

  const renderDiskScheduling = () => (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Disk Scheduling (SCAN Algorithm)</h3>
        <span className="badge badge-warning">Head: {currentHead}</span>
      </div>
      <div style={{
        height: '200px',
        background: isDarkTheme ? '#1E293B' : '#F8FAFC',
        border: `1px solid ${isDarkTheme ? '#475569' : '#E2E8F0'}`,
        borderRadius: '8px',
        position: 'relative',
        marginTop: '16px',
        overflow: 'hidden'
      }}>
        {/* Disk Track Visualization */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '2px',
          background: isDarkTheme ? '#475569' : '#CBD5E1',
          transform: 'translateY(-50%)'
        }} />
        
        {/* Disk Head */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${currentHead}%`,
          width: '4px',
          height: '20px',
          background: '#EF4444',
          transform: 'translate(-50%, -50%)',
          borderRadius: '2px',
          zIndex: 10
        }} />
        
        {/* Disk Requests */}
        {diskRequests.map((request, index) => (
          <div key={request.id} style={{
            position: 'absolute',
            top: '50%',
            left: `${request.cylinder}%`,
            width: '8px',
            height: '8px',
            background: request.processed ? '#10B981' : '#F59E0B',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translate(-50%, -50%) scale(1.5)';
            e.target.style.boxShadow = '0 0 8px rgba(245, 158, 11, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translate(-50%, -50%) scale(1)';
            e.target.style.boxShadow = 'none';
          }}
          title={`Cylinder ${request.cylinder}, Arrival: ${request.arrivalTime}ms`} />
        ))}
        
        {/* Track Numbers */}
        {[0, 25, 50, 75, 100].map(track => (
          <div key={track} style={{
            position: 'absolute',
            top: '10px',
            left: `${track}%`,
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: isDarkTheme ? '#94A3B8' : '#64748B',
            fontWeight: 500
          }}>
            {track}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <h4>Request Queue</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '8px',
          marginTop: '8px'
        }}>
          {diskRequests.map(request => (
            <div key={request.id} style={{
              padding: '8px',
              background: request.processed ? '#10B981' : isDarkTheme ? '#334155' : '#F1F5F9',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '12px',
              color: request.processed ? 'white' : isDarkTheme ? '#F8FAFC' : '#1E293B'
            }}>
              <div style={{ fontWeight: 600 }}>C{request.cylinder}</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>{request.arrivalTime}ms</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'filesystem', name: 'File System', icon: '📁' },
    { id: 'processes', name: 'Process Management', icon: '⚙️' },
    { id: 'memory', name: 'Memory Management', icon: '🧠' },
    { id: 'disk', name: 'Disk Scheduling', icon: '💾' }
  ];

  return (
    <div style={{ padding: '1.5rem', color: isDarkTheme ? '#F8FAFC' : '#1E293B' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <span style={{ fontSize: '24px' }}>🖥️</span>
          Operating System Concepts
        </h2>
        <p style={{ color: isDarkTheme ? '#CBD5E1' : '#64748B', margin: 0 }}>
          Interactive visualizations of core OS concepts and algorithms
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: `1px solid ${isDarkTheme ? '#475569' : '#E2E8F0'}`,
        paddingBottom: '16px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '500px' }}>
        {activeTab === 'filesystem' && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">File System Tree Structure</h3>
              <span className="badge badge-info">Hierarchical</span>
            </div>
            <div style={{
              background: isDarkTheme ? '#1E293B' : '#F8FAFC',
              border: `1px solid ${isDarkTheme ? '#475569' : '#E2E8F0'}`,
              borderRadius: '8px',
              padding: '16px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {renderFileSystemTree(fileSystemTree)}
            </div>
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="card">
                <h4>File Types</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📁</span>
                    <span>Directories</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚙️</span>
                    <span>Executables</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📄</span>
                    <span>Regular Files</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <h4>Permissions</h4>
                <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
                  <div>drwxr-xr-x (755)</div>
                  <div>-rw-r--r-- (644)</div>
                  <div>-rwxr-xr-x (755)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'processes' && renderProcessTable()}
        {activeTab === 'memory' && renderMemoryVisualization()}
        {activeTab === 'disk' && renderDiskScheduling()}
      </div>
    </div>
  );
};

export default OSConceptsPanel; 