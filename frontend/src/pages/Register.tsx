import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { RegisterData } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    passport_id: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('register/', formData);
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <input name="passport_id" placeholder="Passport ID" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;