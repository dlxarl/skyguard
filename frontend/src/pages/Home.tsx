import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import MapBackground from '../components/MapBackground';
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
      alert('Geolocation is not supported');
      return;
    }

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
        } catch (error) {
          alert('Failed to send report.');
        } finally {
          setIsSending(false);
        }
      },
      () => {
        alert('Unable to retrieve location.');
        setIsSending(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div>
      <MapBackground targets={targets} />

      <div style={{ position: 'relative', zIndex: 1000, pointerEvents: 'none', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>

        <div style={{ padding: '20px', pointerEvents: 'auto' }}>
        </div>

        {isAuthenticated ? (
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', pointerEvents: 'auto' }}>
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
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
                <option value="artillery">Artillery</option>
                <option value="vehicle">Vehicle</option>
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
                {isSending ? 'Sending...' : 'SEND REPORT'}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;