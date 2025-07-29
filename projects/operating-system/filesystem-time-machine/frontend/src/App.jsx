import React, { useState, useEffect } from 'react';
import IntroPage from './IntroPage';
import FileWatcherPanel from './FileWatcherPanel';
import SnapshotPanel from './SnapshotPanel';
import TimelineChart from './TimelineChart';
import FolderBrowser from './FolderBrowser';
import FileContentDiff from './FileContentDiff';
import AnomalyDetectionPanel from './AnomalyDetectionPanel';
import OSConceptsPanel from './OSConceptsPanel';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import './theme.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function FileSystemPanel({ isDarkTheme }) {
  const iconColor = '#8B5CF6';
  // Demo: show a modern file system explorer with icons
  const mockFiles = [
    { name: 'doc.txt', size: '1.2 MB', permissions: 'rw-r--r--', modified: '2025-07-26', icon: 'fa-file-text' },
    { name: 'image.png', size: '3.5 MB', permissions: 'rwxr-xr-x', modified: '2025-07-25', icon: 'fa-image' },
    { name: 'data/', size: '12.4 MB', permissions: 'rwxr-xr-x', modified: '2025-07-24', icon: 'fa-folder' }
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          File System Explorer
        </h2>
      </div>
      <p>View file attributes and directory structure.</p>
      <h3>File Metadata</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Size</th>
            <th>Permissions</th>
            <th>Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {mockFiles.map((file, index) => (
            <tr key={index}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
                  {file.icon === 'fa-file-text' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
                  )}
                  {file.icon === 'fa-image' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  )}
                  {file.icon === 'fa-folder' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  )}
                </div>
              </td>
              <td>{file.name}</td>
              <td>{file.size}</td>
              <td style={{ fontFamily: 'monospace' }}>{file.permissions}</td>
              <td>{file.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Directory Structure</h3>
      <pre style={{ 
        background: 'var(--surface)',
        padding: '1rem', 
        borderRadius: '8px', 
        fontSize: '1.1em',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', color: iconColor }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span style={{ marginLeft: '8px' }}>root/</span>
        </div>
        <div style={{ marginLeft: '20px' }}>
          <div>├── bin/</div>
          <div>├── home/</div>
          <div>│   └── user/</div>
          <div>│       ├── Documents/</div>
          <div>│       ├── Downloads/</div>
          <div>│       └── Desktop/</div>
          <div>├── etc/</div>
          <div>└── var/</div>
        </div>
      </pre>
    </div>
  );
}

function StoragePanel({ isDarkTheme }) {
  const storageData = {
    labels: ['Used Space', 'Free Space', 'System Files', 'User Data'],
    datasets: [{
      data: [45, 30, 15, 10],
      backgroundColor: ['#EF4444', '#10B981', '#F59E0B', '#3B82F6'],
      borderWidth: 0
    }]
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          Storage Management
        </h2>
      </div>
      <p>Monitor disk usage and storage allocation.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h3>Disk Usage</h3>
          <div style={{ height: '300px' }}>
            <Pie data={storageData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: isDarkTheme ? '#F8FAFC' : '#1E293B'
                  }
                }
              }
            }} />
          </div>
        </div>
        <div>
          <h3>Storage Statistics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <h4>Total Capacity</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>500 GB</p>
            </div>
            <div className="card">
              <h4>Used Space</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>225 GB (45%)</p>
            </div>
            <div className="card">
              <h4>Free Space</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>275 GB (55%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiskSchedulingPanel({ isDarkTheme }) {
  const [requests, setRequests] = useState([]);
  const [currentHead, setCurrentHead] = useState(50);

  const randomize = () => {
    const newRequests = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      cylinder: Math.floor(Math.random() * 100),
      arrivalTime: i * 100 + Math.floor(Math.random() * 50)
    }));
    setRequests(newRequests);
  };

  useEffect(() => {
    randomize();
    const interval = setInterval(randomize, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10,8 16,12 10,16 10,8"/>
            </svg>
          </div>
          Disk Scheduling (FCFS)
        </h2>
      </div>
      <p>Visualize disk head movement and request scheduling.</p>
      
      <div style={{
        height: '200px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        position: 'relative',
        marginTop: '16px',
        overflow: 'hidden'
      }}>
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
        {requests.map((request, index) => (
          <div key={request.id} style={{
            position: 'absolute',
            top: '50%',
            left: `${request.cylinder}%`,
            width: '8px',
            height: '8px',
            background: '#F59E0B',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            cursor: 'pointer'
          }}
          title={`Cylinder ${request.cylinder}, Arrival: ${request.arrivalTime}ms`} />
        ))}
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <h3>Request Queue</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '8px',
          marginTop: '8px'
        }}>
          {requests.map(request => (
            <div key={request.id} style={{
              padding: '8px',
              background: 'var(--surface)',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '12px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontWeight: 600 }}>C{request.cylinder}</div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>{request.arrivalTime}ms</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileSystemComparisonPanel({ isDarkTheme }) {
  const fileSystems = [
    {
      name: 'EXT4',
      features: ['Journaling', 'Large file support', 'Extent-based allocation'],
      pros: ['Stable and mature', 'Good performance', 'Wide compatibility'],
      cons: ['Limited scalability', 'No compression', 'Fragmentation']
    },
    {
      name: 'Btrfs',
      features: ['Copy-on-write', 'Snapshots', 'Compression'],
      pros: ['Advanced features', 'Data integrity', 'Scalability'],
      cons: ['Complexity', 'Performance overhead', 'Less mature']
    },
    {
      name: 'ZFS',
      features: ['Pooled storage', 'Data integrity', 'Snapshots'],
      pros: ['Excellent reliability', 'Advanced features', 'Scalability'],
      cons: ['High memory usage', 'Complex setup', 'Licensing issues']
    }
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11H1l8-8v6a4 4 0 0 0 4 4h6"/>
            </svg>
          </div>
          File System Comparison
        </h2>
      </div>
      <p>Compare different file system architectures and features.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {fileSystems.map((fs, index) => (
          <div key={index} className="card">
            <div className="card-header">
              <h3 className="card-title">{fs.name}</h3>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>Key Features</h4>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {fs.features.map((feature, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h4 style={{ color: '#10B981' }}>Pros</h4>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px' }}>
                  {fs.pros.map((pro, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#EF4444' }}>Cons</h4>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px' }}>
                  {fs.cons.map((con, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [scrollY, setScrollY] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get current page from URL or localStorage
  const getCurrentPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const savedPage = localStorage.getItem('currentPage');
    
    // Always start with intro page if no specific page is requested
    if (page && page !== 'intro') {
      localStorage.setItem('currentPage', page);
      return page;
    } else if (savedPage && savedPage !== 'intro') {
      return savedPage;
    }
    return 'intro';
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  useEffect(() => {
    // Set theme attribute for CSS variables
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const getHourAngle = () => {
    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    return (hours * 30) + (minutes * 0.5);
  };
  const getMinuteAngle = () => {
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return (minutes * 6) + (seconds * 0.1);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    
    // Update URL without page reload
    const url = new URL(window.location);
    if (page === 'intro') {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', page);
    }
    window.history.pushState({}, '', url);
  };

  const handleGetStarted = () => {
    navigateToPage('watcher');
  };

  const handleSelectFeature = (sectionId) => {
    navigateToPage(sectionId);
  };

  const navItems = [
    {
      id: 'watcher',
      title: 'File Watcher',
      color: '#10B981',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      )
    },
    {
      id: 'snapshots',
      title: 'Snapshots',
      color: '#8B5CF6',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      )
    },
    {
      id: 'timeline',
      title: 'Timeline',
      color: '#F59E0B',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      )
    },
    {
      id: 'browser',
      title: 'Folder Browser',
      color: '#3B82F6',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      id: 'diff',
      title: 'File Diff',
      color: '#10B981',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      )
    },
    {
      id: 'anomaly',
      title: 'Security & Anomaly',
      color: '#8B5CF6',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      id: 'os-concepts',
      title: 'OS Concepts',
      color: '#F59E0B',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    },
    {
      id: 'filesystem',
      title: 'File System',
      color: '#3B82F6',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      )
    },
    {
      id: 'storage',
      title: 'Storage',
      color: '#10B981',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      )
    },
    {
      id: 'disk',
      title: 'Disk Scheduling',
      color: '#F59E0B',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10,8 16,12 10,16 10,8"/>
        </svg>
      )
    },
    {
      id: 'comparison',
      title: 'File System Comparison',
      color: '#8B5CF6',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11H1l8-8v6a4 4 0 0 0 4 4h6"/>
        </svg>
      )
    }
  ];

  const renderActiveSection = () => {
    switch (currentPage) {
      case 'watcher':
        return <FileWatcherPanel isDarkTheme={isDarkTheme} />;
      case 'snapshots':
        return <SnapshotPanel isDarkTheme={isDarkTheme} />;
      case 'timeline':
        return <TimelineChart isDarkTheme={isDarkTheme} />;
      case 'browser':
        return <FolderBrowser isDarkTheme={isDarkTheme} />;
      case 'diff':
        return <FileContentDiff isDarkTheme={isDarkTheme} />;
      case 'anomaly':
        return <AnomalyDetectionPanel isDarkTheme={isDarkTheme} />;
      case 'os-concepts':
        return <OSConceptsPanel isDarkTheme={isDarkTheme} />;
      case 'filesystem':
        return <FileSystemPanel isDarkTheme={isDarkTheme} />;
      case 'storage':
        return <StoragePanel isDarkTheme={isDarkTheme} />;
      case 'disk':
        return <DiskSchedulingPanel isDarkTheme={isDarkTheme} />;
      case 'comparison':
        return <FileSystemComparisonPanel isDarkTheme={isDarkTheme} />;
      default:
        return <IntroPage onGetStarted={handleGetStarted} onSelectFeature={handleSelectFeature} />;
    }
  };

  if (currentPage === 'intro') {
    return <IntroPage onGetStarted={handleGetStarted} onSelectFeature={handleSelectFeature} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        background: `rgba(var(--bg-primary-rgb), ${Math.min(scrollY / 100, 0.9)})`,
        backdropFilter: `blur(${Math.min(scrollY / 10, 20)}px)`,
        borderBottom: scrollY > 10 ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s ease',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.5rem 2rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Sidebar Toggle Button - Positioned further left */}
            <button
              onClick={toggleSidebar}
              className="btn btn-secondary"
              style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            <div style={{
              background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                position: 'relative',
                border: '2px solid #1F2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '2px',
                  height: '8px',
                  background: '#1F2937',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) translateY(-100%) rotate(${getHourAngle()}deg)`,
                  borderRadius: '1px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '1px',
                  height: '12px',
                  background: '#1F2937',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) translateY(-100%) rotate(${getMinuteAngle()}deg)`,
                  borderRadius: '0.5px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '3px',
                  height: '3px',
                  background: '#1F2937',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)'
                }}></div>
              </div>
            </div>
            <h1 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em'
            }}>
              Filesystem Time Machine
            </h1>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className="btn btn-secondary"
            style={{
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              padding: 0
            }}
          >
            {isDarkTheme ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 60,
        bottom: 0,
        width: isSidebarOpen ? '280px' : '0',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        zIndex: 1000
      }}>
        <div style={{
          padding: '1rem',
          height: '100%',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Navigation</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateToPage(item.id)}
                className={`btn ${currentPage === item.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem'
                }}
              >
                <div style={{ color: item.color, display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </div>
                <span style={{ marginLeft: '0.75rem' }}>{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: isSidebarOpen ? '280px' : '0',
        marginTop: '60px',
        padding: '2rem',
        transition: 'margin-left 0.3s ease',
        minHeight: 'calc(100vh - 60px)'
      }}>
        {/* Active Section Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
}

export default App;