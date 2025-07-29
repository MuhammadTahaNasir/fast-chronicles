import React, { useState, useEffect } from 'react';

const featureSectionIds = [
  'watcher',      // Real-time File Watching
  'snapshots',    // Smart Snapshots
  'timeline',     // Time Travel Restore
  'diff',         // Advanced Diff Viewer
  'os-concepts'   // OS Concepts
];

const IntroPage = ({ onGetStarted, onSelectFeature }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Set theme attribute for CSS variables
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', handleScroll);
    };
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

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      ),
      title: 'Real-time File Watching',
      description: 'Monitor any folder in real-time with instant file change detection, event tracking, and live notifications.',
      color: '#10B981'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      ),
      title: 'Smart Snapshots',
      description: 'Create point-in-time snapshots with complete file content preservation and metadata tracking.',
      color: '#8B5CF6'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M3 21v-5h5"/>
        </svg>
      ),
      title: 'Time Travel Restore',
      description: 'Restore any folder to its previous state with complete file recovery and content restoration.',
      color: '#F59E0B'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      ),
      title: 'Advanced Diff Viewer',
      description: 'Compare snapshots to see exactly what changed between versions with detailed file analysis.',
      color: '#3B82F6'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: 'OS Concepts Visualization',
      description: 'Interactive visualizations of file systems, process management, memory allocation, and disk scheduling.',
      color: '#F59E0B'
    }
  ];

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      color: 'var(--text-primary)',
      width: '100vw',
      boxSizing: 'border-box',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>

      {/* Scrollable Blur Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: `rgba(var(--bg-primary-rgb), ${Math.min(scrollY / 100, 0.9)})`,
        backdropFilter: `blur(${Math.min(scrollY / 10, 20)}px)`,
        borderBottom: scrollY > 10 ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s ease'
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

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        textAlign: 'center',
        width: '100%',
        maxWidth: '1200px',
        padding: '0 1rem',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
        marginTop: '60px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 25px 50px rgba(139, 92, 246, 0.4)',
          position: 'relative',
          animation: 'float 6s ease-in-out infinite'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
            position: 'relative',
            border: '3px solid #1F2937',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '3px',
              height: '25px',
              background: '#1F2937',
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) translateY(-100%) rotate(${getHourAngle()}deg)`,
              borderRadius: '1.5px'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2px',
              height: '35px',
              background: '#1F2937',
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) translateY(-100%) rotate(${getMinuteAngle()}deg)`,
              borderRadius: '1px'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '6px',
              height: '6px',
              background: '#1F2937',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
          </div>
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          lineHeight: '1.1',
          letterSpacing: '-0.025em',
          background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Filesystem Time Machine
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          lineHeight: '1.6',
          maxWidth: '600px',
          fontWeight: '400'
        }}>
          Discover insights about your file system patterns, version control, and data management habits with interactive OS concepts visualization.
        </p>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="btn btn-primary"
          style={{
            padding: '1.5rem 4rem',
            fontSize: '1.2rem',
            fontWeight: '700',
            boxShadow: '0 15px 35px rgba(139, 92, 246, 0.4)',
            letterSpacing: '-0.025em',
            marginBottom: '4rem'
          }}
        >
          Get Started
        </button>

        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '3rem',
          color: 'var(--text-primary)',
          lineHeight: '1.2',
          letterSpacing: '-0.025em',
          background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          What Can You Do?
        </h2>
        
        {/* Top Row - 3 Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px',
          marginBottom: '2rem',
          justifyContent: 'center'
        }}>
          {features.slice(0, 3).map((feature, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Open ${feature.title}`}
              tabIndex={0}
              onClick={() => onSelectFeature && onSelectFeature(featureSectionIds[index])}
              className="card"
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(0)',
                outline: 'none',
                font: 'inherit',
                color: 'var(--text-primary)',
                willChange: 'transform, box-shadow, border-color',
                border: `2px solid var(--border)`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '2rem',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.05)';
                e.currentTarget.style.boxShadow = `0 30px 60px ${feature.color}40`;
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = feature.color;
                e.currentTarget.style.boxShadow = `0 0 0 4px ${feature.color}40`;
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1.5rem',
                color: feature.color,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                fontSize: '1rem',
                fontWeight: '400'
              }}>
                {feature.description}
              </p>
            </button>
          ))}
        </div>

        {/* Bottom Row - 2 Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          width: '100%',
          maxWidth: '800px',
          marginBottom: '3rem',
          justifyContent: 'center'
        }}>
          {features.slice(3, 5).map((feature, index) => (
            <button
              key={index + 3}
              type="button"
              aria-label={`Open ${feature.title}`}
              tabIndex={0}
              onClick={() => onSelectFeature && onSelectFeature(featureSectionIds[index + 3])}
              className="card"
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateY(0)',
                outline: 'none',
                font: 'inherit',
                color: 'var(--text-primary)',
                willChange: 'transform, box-shadow, border-color',
                border: `2px solid var(--border)`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '2rem',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.05)';
                e.currentTarget.style.boxShadow = `0 30px 60px ${feature.color}40`;
                e.currentTarget.style.borderColor = feature.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = feature.color;
                e.currentTarget.style.boxShadow = `0 0 0 4px ${feature.color}40`;
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1.5rem',
                color: feature.color,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                fontSize: '1rem',
                fontWeight: '400'
              }}>
                {feature.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default IntroPage;