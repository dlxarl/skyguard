import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import MapBackground from '../components/MapBackground';
import type { Target, NewTargetData } from '../types';

const IconShelter = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M9 18L2 22V6L9 2M9 18L16 22M9 18V2M16 22L22 18V2L16 6M16 22V6M16 6L9 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
);
const IconReport = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M12 10.5V7M12 14H12.01M9.9 19.2L11.36 21.1467C11.5771 21.4362 11.6857 21.5809 11.8188 21.6327C11.9353 21.678 12.0647 21.678 12.1812 21.6327C12.3143 21.5809 12.4229 21.4362 12.64 21.1467L14.1 19.2C14.3931 18.8091 14.5397 18.6137 14.7185 18.4645C14.9569 18.2656 15.2383 18.1248 15.5405 18.0535C15.7671 18 16.0114 18 16.5 18C17.8978 18 18.5967 18 19.1481 17.7716C19.8831 17.4672 20.4672 16.8831 20.7716 16.1481C21 15.5967 21 14.8978 21 13.5V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V13.5C3 14.8978 3 15.5967 3.22836 16.1481C3.53284 16.8831 4.11687 17.4672 4.85195 17.7716C5.40326 18 6.10218 18 7.5 18C7.98858 18 8.23287 18 8.45951 18.0535C8.76169 18.1248 9.04312 18.2656 9.2815 18.4645C9.46028 18.6137 9.60685 18.8091 9.9 19.2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
);
const IconGuide = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M12 21L11.8999 20.8499C11.2053 19.808 10.858 19.287 10.3991 18.9098C9.99286 18.5759 9.52476 18.3254 9.02161 18.1726C8.45325 18 7.82711 18 6.57482 18H5.2C4.07989 18 3.51984 18 3.09202 17.782C2.71569 17.5903 2.40973 17.2843 2.21799 16.908C2 16.4802 2 15.9201 2 14.8V6.2C2 5.07989 2 4.51984 2.21799 4.09202C2.40973 3.71569 2.71569 3.40973 3.09202 3.21799C3.51984 3 4.07989 3 5.2 3H5.6C7.84021 3 8.96031 3 9.81596 3.43597C10.5686 3.81947 11.1805 4.43139 11.564 5.18404C12 6.03968 12 7.15979 12 9.4M12 21V9.4M12 21L12.1001 20.8499C12.7947 19.808 13.142 19.287 13.6009 18.9098C14.0071 18.5759 14.4752 18.3254 14.9784 18.1726C15.5467 18 16.1729 18 17.4252 18H18.8C19.9201 18 20.4802 18 20.908 17.782C21.2843 17.5903 21.5903 17.2843 21.782 16.908C22 16.4802 22 15.9201 22 14.8V6.2C22 5.07989 22 4.51984 21.782 4.09202C21.5903 3.71569 21.2843 3.40973 20.908 3.21799C20.4802 3 19.9201 3 18.8 3H18.4C16.1598 3 15.0397 3 14.184 3.43597C13.4314 3.81947 12.8195 4.43139 12.436 5.18404C12 6.03968 12 7.15979 12 9.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
 </svg>
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

  backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
  color: isActive ? '#000' : '#5e5e5e',
});

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  marginTop: '4px',
  fontWeight: 500,
};

const formCardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  padding: '20px',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  width: '90%',
  maxWidth: '350px',
  border: '1px solid rgba(255, 255, 255, 0.4)',
};

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [targets, setTargets] = useState<Target[]>([]);
  const [activeTab, setActiveTab] = useState<'shelters' | 'report' | 'guide'>('shelters');
  const [isSending, setIsSending] = useState(false);
  const [newTarget, setNewTarget] = useState<NewTargetData>({
    title: '', description: '', latitude: '', longitude: '', target_type: 'drone'
  });

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const response = await api.get<Target[]>('targets/');
      setTargets(response.data);
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
          fetchTargets();
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
        <MapBackground targets={targets} />
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

        {activeTab === 'report' && isAuthenticated && (
          <div style={{ pointerEvents: 'auto', ...formCardStyle }}>
            <h2 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '1.2rem' }}>New Report</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select name="target_type" value={newTarget.target_type} onChange={handleChange} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}>
                <option value="drone">Drone</option>
                <option value="rocket">Rocket</option>
                <option value="artillery">Artillery</option>
                <option value="vehicle">Vehicle</option>
              </select>
              <textarea name="description" placeholder="Optional description..." value={newTarget.description} onChange={handleChange} rows={3} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd', resize: 'none' }} />
              <button type="submit" disabled={isSending} style={{ background: '#FF3B30', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                {isSending ? 'SENDING...' : 'SEND REPORT'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'guide' && (
           <div style={{ pointerEvents: 'auto', ...formCardStyle }}>
             <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Guide</h2>
             <ul style={{ paddingLeft: '20px', lineHeight: '1.6', fontSize: '0.9rem', color: '#333' }}>
               <li><strong>Shelters:</strong> Shows map with verified points.</li>
               <li><strong>Report:</strong> Send GPS location of threats.</li>
               <li><strong>Red:</strong> Confirmed danger zones.</li>
             </ul>
           </div>
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

      </div>
    </div>
  );
};

export default Home;