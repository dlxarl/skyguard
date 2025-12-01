import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import type { LoginData, AuthResponse } from '../types';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post<AuthResponse>('login/', formData);
      login(response.data.access, response.data.refresh);
      navigate('/');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;