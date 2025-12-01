import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import type { Target, NewTargetData } from '../types';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [targets, setTargets] = useState<Target[]>([]);
  const [newTarget, setNewTarget] = useState<NewTargetData>({
    title: '',
    description: '',
    latitude: '',
    longitude: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTarget({
      ...newTarget,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newTarget,
        latitude: parseFloat(newTarget.latitude),
        longitude: parseFloat(newTarget.longitude)
      };

      await api.post('targets/', payload);
      alert('Target created. Waiting for admin verification.');
      setNewTarget({ title: '', description: '', latitude: '', longitude: '' });
    } catch (error) {
      alert('Failed to create target.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Targets Map (Confirmed)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {targets.map(target => (
          <div key={target.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
            <h3>{target.title}</h3>
            <p>{target.description}</p>
            <small>Coords: {target.latitude}, {target.longitude}</small>
          </div>
        ))}
      </div>

      {isAuthenticated ? (
        <>
          <h2>Report New Target</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
            <input name="title" placeholder="Title" value={newTarget.title} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={newTarget.description} onChange={handleChange} required />
            <input name="latitude" type="number" step="any" placeholder="Latitude" value={newTarget.latitude} onChange={handleChange} required />
            <input name="longitude" type="number" step="any" placeholder="Longitude" value={newTarget.longitude} onChange={handleChange} required />
            <button type="submit">Submit Target</button>
          </form>
        </>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Want to report a target?</h3>
          <p>Please <a href="/login">login</a> or <a href="/register">register</a> to submit new targets.</p>
        </div>
      )}
    </div>
  );
};

export default Home;