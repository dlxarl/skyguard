import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import type { Target, NewTargetData } from '../types';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [targets, setTargets] = useState<Target[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [newTarget, setNewTarget] = useState<NewTargetData>({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    target_type: 'drone'
  });

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const response = await api.get<Target[]>('targets/');
      setTargets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTarget({
      ...newTarget,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsSending(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = {
            ...newTarget,
            title: newTarget.target_type.toUpperCase(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          await api.post('targets/', payload);
          alert('Report sent successfully!');
          setNewTarget({ title: '', description: '', latitude: '', longitude: '', target_type: 'drone' });
          fetchTargets();
        } catch (error) {
          alert('Failed to send report.');
        } finally {
          setIsSending(false);
        }
      },
      () => {
        alert('Unable to retrieve location. Please enable GPS.');
        setIsSending(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '40px' }}>
        {targets.map(target => (
          <div key={target.id} style={{ background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{target.title}</h3>
              <span style={{
                background: target.target_type === 'rocket' ? '#ffebee' : '#e3f2fd',
                color: target.target_type === 'rocket' ? '#c62828' : '#1565c0',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {target.target_type}
              </span>
            </div>
            {target.description && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>{target.description}</p>
            )}
            <div style={{ fontSize: '0.8rem', color: '#999', fontFamily: 'monospace' }}>
              {target.latitude.toFixed(4)}, {target.longitude.toFixed(4)}
            </div>
          </div>
        ))}
      </div>

      {isAuthenticated ? (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', left: '20px', display: 'flex', justifyContent: 'center' }}>
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', textAlign: 'center' }}>New Report</h2>

            <select
              name="target_type"
              value={newTarget.target_type}
              onChange={handleChange}
              style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', background: 'white', fontSize: '1rem' }}
            >
                <option value="drone">Drone</option>
                <option value="rocket">Rocket</option>
                <option value="plane">Plane</option>
                <option value="helicopter">Helicopter</option>
                <option value="explosion">Explosion</option>
                <option value="other">Other</option>
            </select>

            <textarea
              name="description"
              placeholder="Description (optional)"
              value={newTarget.description}
              onChange={handleChange}
              rows={2}
              style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', resize: 'none' }}
            />

            <button
              type="submit"
              disabled={isSending}
              style={{
                width: '100%',
                background: isSending ? '#ccc' : '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                cursor: isSending ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'uppercase'
              }}
            >
              {isSending ? 'Locating & Sending...' : 'SEND REPORT'}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Home;