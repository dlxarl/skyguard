import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import MapBackground from '../components/MapBackground';
import type { Target, Shelter, NewTargetData } from '../types';

const IconShelter = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const IconReport = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconGuide = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);
const IconProfile = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const menuContainerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '30px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  padding: '5px',
  gap: '5px',
  backgroundColor: 'rgba(171,171,171,0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '999px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  zIndex: 9999,
};

const itemStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 30px',
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  color: isActive ? '#000000' : '#494949',
});

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  marginTop: '4px',
  fontWeight: 500,
};

const formCardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  padding: '20px',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  width: '90%',
  maxWidth: '350px',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  textAlign: 'center',
};

const Home: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [targets, setTargets] = useState<Target[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [activeTab, setActiveTab] = useState<'shelters' | 'report' | 'guide' | 'profile'>('shelters');
  const [isSending, setIsSending] = useState(false);
  const [newTarget, setNewTarget] = useState<NewTargetData>({
    title: '', description: '', latitude: '', longitude: '', target_type: 'drone'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [targetsRes, sheltersRes] = await Promise.all([
        api.get<Target[]>('targets/'),
        api.get<Shelter[]>('shelters/')
      ]);
      setTargets(targetsRes.data);
      setShelters(sheltersRes.data);
    } catch (error) { console.error(error); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTarget({ ...newTarget, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.geolocation) return alert('Geolocation not supported');
    setIsSending(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = {
            ...newTarget,
            title: newTarget.target_type.toUpperCase(),
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          };
          await api.post('targets/', payload);
          alert('Report sent!');
          setNewTarget({ title: '', description: '', latitude: '', longitude: '', target_type: 'drone' });
          fetchData();
          setActiveTab('shelters');
        } catch { alert('Failed to send report.'); } finally { setIsSending(false); }
      },
      () => { alert('Unable to retrieve location.'); setIsSending(false); },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', background: '#000' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <MapBackground targets={targets} shelters={shelters} />
      </div>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: '100px',
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {activeTab === 'report' && (
          isAuthenticated ? (
            <div style={{ pointerEvents: 'auto', ...formCardStyle }}>
              <h2 style={{ margin: '0 0 15px 0', fontSize: '1.4rem' }}>New Report</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select name="target_type" value={newTarget.target_type} onChange={handleChange} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}>
                    <option value="drone">Drone</option>
                    <option value="rocket">Rocket</option>
                    <option value="plane">Plane</option>
                    <option value="helicopter">Helicopter</option>
                    <option value="explosion">Explosion</option>
                    <option value="other">Other</option>
                </select>
                <textarea name="description" placeholder="Description (optional)..." value={newTarget.description} onChange={handleChange} rows={3} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd', resize: 'none', fontSize: '1rem' }} />
                <button type="submit" disabled={isSending} style={{ background: '#FF3B30', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                  {isSending ? 'SENDING...' : 'SEND REPORT'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ pointerEvents: 'auto', ...formCardStyle }}>
              <h2 style={{ margin: '0 0 10px 0' }}>Access Restricted</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>You must be logged in to verify reports.</p>
              <button
                onClick={() => navigate('/login')}
                style={{ background: '#007AFF', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
              >
                Log In
              </button>
            </div>
          )
        )}

        {activeTab === 'guide' && (
           <div style={{ pointerEvents: 'auto', ...formCardStyle, textAlign: 'left' }}>
             <h2 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>Guide</h2>
             <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontSize: '0.95rem', color: '#333' }}>
               <li><strong>Shelters:</strong> View safe zones.</li>
               <li><strong>Report:</strong> Send GPS threat data.</li>
               <li><strong>Red:</strong> Confirmed threats.</li>
             </ul>
           </div>
        )}

        {activeTab === 'profile' && (
          isAuthenticated ? (
            <div style={{ pointerEvents: 'auto', ...formCardStyle }}>
              <h2 style={{ margin: '0 0 15px 0', fontSize: '1.4rem' }}>Profile</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>You are currently logged in.</p>
              <button
                onClick={logout}
                style={{ background: '#FF3B30', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
              >
                Log Out
              </button>
            </div>
          ) : (
             <div style={{ pointerEvents: 'auto', ...formCardStyle }}>
              <h2 style={{ margin: '0 0 10px 0' }}>Profile</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>Please log in to view your profile.</p>
              <button
                onClick={() => navigate('/login')}
                style={{ background: '#007AFF', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
              >
                Log In
              </button>
            </div>
          )
        )}
      </div>

      <div style={menuContainerStyle}>
        <button onClick={() => setActiveTab('shelters')} style={itemStyle(activeTab === 'shelters')}>
          <IconShelter />
          <span style={labelStyle}>Map</span>
        </button>

        <button onClick={() => setActiveTab('report')} style={itemStyle(activeTab === 'report')}>
          <IconReport />
          <span style={labelStyle}>Report</span>
        </button>

        <button onClick={() => setActiveTab('guide')} style={itemStyle(activeTab === 'guide')}>
          <IconGuide />
          <span style={labelStyle}>Guide</span>
        </button>

        <button onClick={() => setActiveTab('profile')} style={itemStyle(activeTab === 'profile')}>
          <IconProfile />
          <span style={labelStyle}>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Home;