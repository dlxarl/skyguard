import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import droneImg from '../assets/images/ufo.png';
import rocketImg from '../assets/images/rocket.png';
import planeImg from '../assets/images/plane.png';
import helicopterImg from '../assets/images/helicopter.png';

const IconBack = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
);

const IconPlay = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
);

const IconPause = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
  </svg>
);

const IconDrone = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"/>
    <path d="M12 2v4"/>
    <path d="M12 18v4"/>
    <path d="M4.93 4.93l2.83 2.83"/>
    <path d="M16.24 16.24l2.83 2.83"/>
    <path d="M2 12h4"/>
    <path d="M18 12h4"/>
    <path d="M4.93 19.07l2.83-2.83"/>
    <path d="M16.24 7.76l2.83-2.83"/>
  </svg>
);

const IconRocket = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const IconPlane = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
);

const IconHelicopter = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16"/>
    <path d="M12 4v4"/>
    <rect x="6" y="8" width="12" height="6" rx="2"/>
    <path d="M6 14v2"/>
    <path d="M18 14v2"/>
    <path d="M4 16h16"/>
    <path d="M18 11h4"/>
  </svg>
);

const IconHelicopterSmall = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16"/>
    <path d="M12 4v4"/>
    <rect x="6" y="8" width="12" height="6" rx="2"/>
    <path d="M6 14v2"/>
    <path d="M18 14v2"/>
    <path d="M4 16h16"/>
    <path d="M18 11h4"/>
  </svg>
);

interface SoundCardProps {
  title: string;
  description: string;
  characteristics: string[];
  icon: React.ReactNode;
  color: string;
  audioSrc: string;
}

const SoundCard: React.FC<SoundCardProps> = ({ title, description, characteristics, icon, color, audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(prog);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: `2px solid ${color}20`,
    }}>
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '16px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}>
          {icon}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#1a1a1a' }}>{title}</h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>{description}</p>
          
          <div style={{ marginBottom: '12px' }}>
            <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: 600, color: '#444' }}>Key characteristics:</p>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#555' }}>
              {characteristics.map((char, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{char}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '16px',
        background: '#f5f5f5',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={togglePlay}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: color,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0,
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            Sound Example
          </div>
          <div style={{
            height: '6px',
            background: '#ddd',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: color,
              borderRadius: '3px',
              transition: 'width 0.1s',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Guide: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'intro' | 'sounds' | 'tips'>('intro');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/');
    }, 400);
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '20px',
    paddingBottom: '40px',
  };

  const animatedContentStyle: React.CSSProperties = {
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    opacity: isVisible ? 1 : 0,
    transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  };

  const backButtonStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '12px',
    padding: '10px',
    cursor: 'pointer',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.3s',
    background: isActive ? 'white' : 'rgba(255,255,255,0.1)',
    color: isActive ? '#1a1a2e' : 'rgba(255,255,255,0.7)',
  });

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  };

  return (
    <div style={containerStyle}>
      <div style={animatedContentStyle}>
        <div style={headerStyle}>
          <button style={backButtonStyle} onClick={handleBack}>
            <IconBack />
          </button>
          <h1 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>
            Target Detection Guide
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button style={tabStyle(activeSection === 'intro')} onClick={() => setActiveSection('intro')}>
          Intro
        </button>
        <button style={tabStyle(activeSection === 'sounds')} onClick={() => setActiveSection('sounds')}>
          Sounds
        </button>
        <button style={tabStyle(activeSection === 'tips')} onClick={() => setActiveSection('tips')}>
          Tips
        </button>
      </div>

      {activeSection === 'intro' && (
        <>
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1a1a2e' }}>Why This Matters</h2>
            <p style={{ margin: 0, lineHeight: 1.7, color: '#444' }}>
              Early detection of aerial threats can save lives. Every citizen can become part of 
              the early warning system by reporting detected targets. Your reports help others 
              find shelter in time.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1a1a2e' }}>How to Detect Targets</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M19.7479 4.99993C21.1652 6.97016 22 9.38756 22 11.9999C22 14.6123 21.1652 17.0297 19.7479 18.9999M15.7453 7.99993C16.5362 9.13376 17 10.5127 17 11.9999C17 13.4872 16.5362 14.8661 15.7453 15.9999M9.63432 4.36561L6.46863 7.5313C6.29568 7.70425 6.2092 7.79073 6.10828 7.85257C6.01881 7.9074 5.92127 7.9478 5.81923 7.9723C5.70414 7.99993 5.58185 7.99993 5.33726 7.99993H3.6C3.03995 7.99993 2.75992 7.99993 2.54601 8.10892C2.35785 8.20479 2.20487 8.35777 2.10899 8.54594C2 8.75985 2 9.03987 2 9.59993V14.3999C2 14.96 2 15.24 2.10899 15.4539C2.20487 15.6421 2.35785 15.7951 2.54601 15.8909C2.75992 15.9999 3.03995 15.9999 3.6 15.9999H5.33726C5.58185 15.9999 5.70414 15.9999 5.81923 16.0276C5.92127 16.0521 6.01881 16.0925 6.10828 16.1473C6.2092 16.2091 6.29568 16.2956 6.46863 16.4686L9.63431 19.6342C10.0627 20.0626 10.2769 20.2768 10.4608 20.2913C10.6203 20.3038 10.7763 20.2392 10.8802 20.1175C11 19.9773 11 19.6744 11 19.0686V4.9313C11 4.32548 11 4.02257 10.8802 3.88231C10.7763 3.76061 10.6203 3.69602 10.4608 3.70858C10.2769 3.72305 10.0627 3.93724 9.63432 4.36561Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
                <div>
                  <strong>Listen</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Characteristic sound is the first sign. Drones have high-frequency humming, missiles have a whistle.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M10 14.5347C11.2335 13.8218 12.7663 13.8218 13.9999 14.5347M2 15L2.70149 7.98511C2.72808 7.71915 2.74138 7.58617 2.76178 7.47208C3.00222 6.12702 4.1212 5.11436 5.48352 5.00894C5.59907 5 5.73271 5 6 5M22 15L21.2985 7.98511C21.2719 7.71916 21.2586 7.58617 21.2382 7.47208C20.9978 6.12702 19.8788 5.11436 18.5165 5.00894C18.4009 5 18.2673 5 18 5M8.82843 12.1716C10.3905 13.7337 10.3905 16.2663 8.82843 17.8284C7.26634 19.3905 4.73367 19.3905 3.17157 17.8284C1.60948 16.2663 1.60948 13.7337 3.17157 12.1716C4.73366 10.6095 7.26633 10.6095 8.82843 12.1716ZM20.8284 12.1716C22.3905 13.7337 22.3905 16.2663 20.8284 17.8284C19.2663 19.3905 16.7337 19.3905 15.1716 17.8284C13.6095 16.2663 13.6095 13.7337 15.1716 12.1716C16.7337 10.6095 19.2663 10.6095 20.8284 12.1716Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
                <div>
                  <strong>Look</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Watch for movement in the sky. Drones usually fly lower than planes and can hover.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M5 14.2864C3.14864 15.1031 2 16.2412 2 17.5C2 19.9853 6.47715 22 12 22C17.5228 22 22 19.9853 22 17.5C22 16.2412 20.8514 15.1031 19 14.2864M18 8C18 12.0637 13.5 14 12 17C10.5 14 6 12.0637 6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8ZM13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
                <div>
                  <strong>Determine Direction</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Try to understand where the target is coming from and which direction it's moving.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M12 10.5V7M12 14H12.01M9.9 19.2L11.36 21.1467C11.5771 21.4362 11.6857 21.5809 11.8188 21.6327C11.9353 21.678 12.0647 21.678 12.1812 21.6327C12.3143 21.5809 12.4229 21.4362 12.64 21.1467L14.1 19.2C14.3931 18.8091 14.5397 18.6137 14.7185 18.4645C14.9569 18.2656 15.2383 18.1248 15.5405 18.0535C15.7671 18 16.0114 18 16.5 18C17.8978 18 18.5967 18 19.1481 17.7716C19.8831 17.4672 20.4672 16.8831 20.7716 16.1481C21 15.5967 21 14.8978 21 13.5V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V13.5C3 14.8978 3 15.5967 3.22836 16.1481C3.53284 16.8831 4.11687 17.4672 4.85195 17.7716C5.40326 18 6.10218 18 7.5 18C7.98858 18 8.23287 18 8.45951 18.0535C8.76169 18.1248 9.04312 18.2656 9.2815 18.4645C9.46028 18.6137 9.60685 18.8091 9.9 19.2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
                <div>
                  <strong>Report</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Use the app for quick reporting. GPS will automatically determine your location.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1a1a2e' }}>Threat Types</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#fff3e0', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <img src={droneImg} alt="Drone" style={{ width: '40px', height: '40px', margin: '0 auto' }} />
                <p style={{ margin: '8px 0 0 0', fontWeight: 600 }}>Drone</p>
              </div>
              <div style={{ background: '#ffebee', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <img src={rocketImg} alt="Missile" style={{ width: '40px', height: '40px', margin: '0 auto' }} />
                <p style={{ margin: '8px 0 0 0', fontWeight: 600 }}>Missile</p>
              </div>
              <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <img src={planeImg} alt="Aircraft" style={{ width: '40px', height: '40px', margin: '0 auto' }} />
                <p style={{ margin: '8px 0 0 0', fontWeight: 600 }}>Aircraft</p>
              </div>
              <div style={{ background: '#f3e5f5', padding: '16px', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={helicopterImg} alt="Helicopter" style={{ width: '40px', height: '40px', margin: '0 auto' }} />
                <p style={{ margin: '8px 0 0 0', fontWeight: 600 }}>Helicopter</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'sounds' && (
        <>
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
              Learn to Distinguish Sounds
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
              Listen to sound examples of different aerial objects to identify them faster.
            </p>
          </div>

          <SoundCard
            title="Drone (UAV)"
            description="Unmanned aerial vehicle. Kamikaze drones like Shahed are most commonly used."
            characteristics={[
              "Characteristic high-frequency motor humming",
              "Sound similar to a lawnmower or moped",
              "Can hover in place - sound becomes steady",
              "Speed 150-180 km/h, flies relatively low",
            ]}
            icon={<IconDrone />}
            color="#FF9800"
            audioSrc="/sounds/drone.mp3"
          />

          <SoundCard
            title="Cruise Missile"
            description="High-speed missile with jet engine. Extremely dangerous."
            characteristics={[
              "Loud whistle or roar of jet engine",
              "Sound grows very quickly",
              "Often accompanied by characteristic howling",
              "Speed 800-1000 km/h, little time to react",
            ]}
            icon={<IconRocket />}
            color="#F44336"
            audioSrc="/sounds/rocket.mp3"
          />

          <SoundCard
            title="Aircraft"
            description="Military or civilian aircraft. Important to distinguish from civil aviation."
            characteristics={[
              "Deep steady turbine hum",
              "Sound travels over long distances",
              "Military aircraft fly much lower and faster",
              "May be accompanied by sonic boom",
            ]}
            icon={<IconPlane />}
            color="#2196F3"
            audioSrc="/sounds/plane.mp3"
          />

          <SoundCard
            title="Helicopter"
            description="Rotary-wing aircraft. Characteristic sound is easy to recognize."
            characteristics={[
              "Rhythmic 'chopping' sound of blades",
              "Sound pulses at a certain frequency",
              "Can hover in place",
              "Flies at low altitudes, easy to see",
            ]}
            icon={<IconHelicopter />}
            color="#9C27B0"
            audioSrc="/sounds/helicopter.mp3"
          />
        </>
      )}

      {activeSection === 'tips' && (
        <>
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              What to Do When Detected
            </h2>
            <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: 2, color: '#444' }}>
              <li><strong>Don't panic</strong> - stay calm for accurate situation assessment</li>
              <li><strong>Identify the type</strong> - try to identify the object by sound and appearance</li>
              <li><strong>Take cover</strong> - find the nearest shelter or safe place</li>
              <li><strong>Send a report</strong> - use the app to report</li>
              <li><strong>Warn others</strong> - if safe, notify neighbors</li>
            </ol>
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Reaction Time
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#fff3e0', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src={droneImg} alt="Drone" style={{ width: '24px', height: '24px' }} /><strong>Drone</strong></span>
                <span style={{ background: '#FF9800', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>5-10 min</span>
              </div>
              <div style={{ background: '#ffebee', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src={rocketImg} alt="Missile" style={{ width: '24px', height: '24px' }} /><strong>Missile</strong></span>
                <span style={{ background: '#F44336', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>10-30 sec</span>
              </div>
              <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src={planeImg} alt="Aircraft" style={{ width: '24px', height: '24px' }} /><strong>Aircraft</strong></span>
                <span style={{ background: '#2196F3', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>1-3 min</span>
              </div>
              <div style={{ background: '#f3e5f5', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconHelicopterSmall /><strong>Helicopter</strong></span>
                <span style={{ background: '#9C27B0', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>2-5 min</span>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Safe Places
            </h2>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8, color: '#444' }}>
              <li>Metro and underground stations</li>
              <li>Basements of multi-story buildings</li>
              <li>Official shelters (marked with signs)</li>
              <li>Underground parking</li>
              <li>Two-wall rule - two walls between you and the street</li>
            </ul>
          </div>

          <div style={{ ...cardStyle, background: '#e8f5e9', border: '2px solid #4CAF50' }}>
            <h2 style={{ margin: '0 0 12px 0', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Remember
            </h2>
            <p style={{ margin: 0, color: '#1b5e20', lineHeight: 1.7 }}>
              Your report can save someone's life. Even if you're not sure about the object type - 
              it's better to report than to stay silent. The system automatically verifies data from other sources.
            </p>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default Guide;
