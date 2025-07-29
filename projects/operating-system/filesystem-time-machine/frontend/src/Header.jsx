import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  // Calculate clock hand angles based on current time
  const getHourAngle = () => {
    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    return (hours * 30) + (minutes * 0.5); // 30 degrees per hour + 0.5 degrees per minute
  };

  const getMinuteAngle = () => {
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return (minutes * 6) + (seconds * 0.1); // 6 degrees per minute + 0.1 degrees per second
  };

  return (
    <header style={{
      background: 'var(--panel)',
      borderBottom: '1px solid var(--border)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent), #A855F7)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Clock Face */}
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
              position: 'relative',
              border: '2px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Folder Icon */}
              <div style={{
                fontSize: '12px',
                color: '#1F2937',
                fontWeight: 'bold'
              }}>📁</div>
              
              {/* Hour Hand */}
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
              
              {/* Minute Hand */}
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
              
              {/* Center Dot */}
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
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, var(--accent), #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Filesystem Time Machine
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>
              Version-Controlled File Management
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#watcher" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}>
            📁 File Watcher
          </a>
          <a href="#snapshots" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}>
            📸 Snapshots
          </a>
          <a href="#timeline" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}>
            📊 Timeline
          </a>
          <a href="#browser" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}>
            📂 Browser
          </a>
          <a href="#diff" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}>
            🔍 Diff
          </a>
          <a href="#anomaly" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            fontWeight: '500'
          }}>
            🛡️ Security
          </a>
        </nav>

        {/* Time Display */}
        <div style={{
          padding: '0.5rem 1rem',
          background: '#2A2A2A',
          borderRadius: '6px',
          border: '1px solid var(--border)',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          🕐 {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
};

export default Header; 