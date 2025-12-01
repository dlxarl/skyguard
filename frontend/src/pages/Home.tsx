import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import MapBackground from '../components/MapBackground';
import type { Target, Shelter, NewTargetData } from '../types';
import defaultAvatar from '../assets/images/profile.svg';

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  trust_rating: number;
  avatar: string | null;
  bio: string;
}

const IconShelter = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M9 18L2 22V6L9 2M9 18L16 22M9 18V2M16 22L22 18V2L16 6M16 22V6M16 6L9 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>);
const IconReport = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M12 10.5V7M12 14H12.01M9.9 19.2L11.36 21.1467C11.5771 21.4362 11.6857 21.5809 11.8188 21.6327C11.9353 21.678 12.0647 21.678 12.1812 21.6327C12.3143 21.5809 12.4229 21.4362 12.64 21.1467L14.1 19.2C14.3931 18.8091 14.5397 18.6137 14.7185 18.4645C14.9569 18.2656 15.2383 18.1248 15.5405 18.0535C15.7671 18 16.0114 18 16.5 18C17.8978 18 18.5967 18 19.1481 17.7716C19.8831 17.4672 20.4672 16.8831 20.7716 16.1481C21 15.5967 21 14.8978 21 13.5V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V13.5C3 14.8978 3 15.5967 3.22836 16.1481C3.53284 16.8831 4.11687 17.4672 4.85195 17.7716C5.40326 18 6.10218 18 7.5 18C7.98858 18 8.23287 18 8.45951 18.0535C8.76169 18.1248 9.04312 18.2656 9.2815 18.4645C9.46028 18.6137 9.60685 18.8091 9.9 19.2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>);
const IconGuide = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M12 21L11.8999 20.8499C11.2053 19.808 10.858 19.287 10.3991 18.9098C9.99286 18.5759 9.52476 18.3254 9.02161 18.1726C8.45325 18 7.82711 18 6.57482 18H5.2C4.07989 18 3.51984 18 3.09202 17.782C2.71569 17.5903 2.40973 17.2843 2.21799 16.908C2 16.4802 2 15.9201 2 14.8V6.2C2 5.07989 2 4.51984 2.21799 4.09202C2.40973 3.71569 2.71569 3.40973 3.09202 3.21799C3.51984 3 4.07989 3 5.2 3H5.6C7.84021 3 8.96031 3 9.81596 3.43597C10.5686 3.81947 11.1805 4.43139 11.564 5.18404C12 6.03968 12 7.15979 12 9.4M12 21V9.4M12 21L12.1001 20.8499C12.7947 19.808 13.142 19.287 13.6009 18.9098C14.0071 18.5759 14.4752 18.3254 14.9784 18.1726C15.5467 18 16.1729 18 17.4252 18H18.8C19.9201 18 20.4802 18 20.908 17.782C21.2843 17.5903 21.5903 17.2843 21.782 16.908C22 16.4802 22 15.9201 22 14.8V6.2C22 5.07989 22 4.51984 21.782 4.09202C21.5903 3.71569 21.2843 3.40973 20.908 3.21799C20.4802 3 19.9201 3 18.8 3H18.4C16.1598 3 15.0397 3 14.184 3.43597C13.4314 3.81947 12.8195 4.43139 12.436 5.18404C12 6.03968 12 7.15979 12 9.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>);
const IconProfile = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>);

const Home: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [targets, setTargets] = useState<Target[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [activeTab, setActiveTab] = useState<'shelters' | 'report' | 'guide' | 'profile'>('shelters');
  const [isSending, setIsSending] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ first_name: '', last_name: '', email: '', bio: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newTarget, setNewTarget] = useState<NewTargetData>({
    title: '', description: '', latitude: '', longitude: '', target_type: 'drone'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      const res = await api.get<UserData>('me/');
      setUserData(res.data);
      setEditData({
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        email: res.data.email || '',
        bio: res.data.bio || ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const res = await api.post<UserData>('me/avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUserData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const res = await api.patch<UserData>('me/', editData);
      setUserData(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

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

  const getRatingClass = () => {
    if (!userData) return 'neutral';
    if (userData.trust_rating < 0) return 'negative';
    if (userData.trust_rating > 0) return 'positive';
    return 'neutral';
  };

  return (
    <div className="home-container">
      <div className="map-wrapper">
        <MapBackground targets={targets} shelters={shelters} />
      </div>

      <div className="content-overlay">
        {activeTab === 'report' && (
          isAuthenticated ? (
            <div className="form-card">
              <h2>New Report</h2>
              <form onSubmit={handleSubmit}>
                <select name="target_type" value={newTarget.target_type} onChange={handleChange} className="form-select">
                  <option value="drone">Drone</option>
                  <option value="rocket">Rocket</option>
                  <option value="plane">Plane</option>
                  <option value="helicopter">Helicopter</option>
                  <option value="explosion">Explosion</option>
                  <option value="other">Other</option>
                </select>
                <textarea name="description" placeholder="Description (optional)..." value={newTarget.description} onChange={handleChange} rows={3} className="form-textarea" />
                <button type="submit" disabled={isSending} className="btn btn-danger btn-full">
                  {isSending ? 'SENDING...' : 'SEND REPORT'}
                </button>
              </form>
            </div>
          ) : (
            <div className="form-card">
              <h2>Access Restricted</h2>
              <p>You must be logged in to verify reports.</p>
              <button onClick={() => navigate('/login')} className="btn btn-primary btn-full">Log In</button>
            </div>
          )
        )}

        {activeTab === 'guide' && (
          <div className="form-card" style={{ textAlign: 'left' }}>
            <h2 style={{ textAlign: 'center' }}>Guide</h2>
            <ul className="guide-list">
              <li><strong>Shelters:</strong> View safe zones.</li>
              <li><strong>Report:</strong> Send GPS threat data.</li>
              <li><strong>Red:</strong> Confirmed threats.</li>
            </ul>
          </div>
        )}

        {activeTab === 'profile' && (
          isAuthenticated ? (
            <div className="profile-fullscreen">
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
              {userData && (
                <div className="profile-content">
                  <div className="profile-header">
                    <div className="avatar-container" onClick={handleAvatarClick}>
                      <img src={userData.avatar ? `http://127.0.0.1:8000${userData.avatar}` : defaultAvatar} alt="Avatar" />
                      <div className="avatar-overlay">
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 11.5V14.6C22 16.8402 22 17.9603 21.564 18.816C21.1805 19.5686 20.5686 20.1805 19.816 20.564C18.9603 21 17.8402 21 15.6 21H8.4C6.15979 21 5.03969 21 4.18404 20.564C3.43139 20.1805 2.81947 19.5686 2.43597 18.816C2 17.9603 2 16.8402 2 14.6V9.4C2 7.15979 2 6.03969 2.43597 5.18404C2.81947 4.43139 3.43139 3.81947 4.18404 3.43597C5.03969 3 6.15979 3 8.4 3H12.5M19 8V2M16 5H22M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <p className="profile-username">@{userData.username}</p>
                    {(userData.first_name || userData.last_name) && (
                      <p className="profile-name">{userData.first_name} {userData.last_name}</p>
                    )}
                    <p className="profile-email">{userData.email}</p>
                  </div>

                  {isEditing ? (
                    <div className="edit-form-container">
                      <h3>Edit Profile</h3>
                      <div className="edit-form">
                        <input type="text" name="first_name" placeholder="First Name" value={editData.first_name} onChange={handleEditChange} className="form-input" />
                        <input type="text" name="last_name" placeholder="Last Name" value={editData.last_name} onChange={handleEditChange} className="form-input" />
                        <input type="email" name="email" placeholder="Email" value={editData.email} onChange={handleEditChange} className="form-input" />
                        <textarea name="bio" placeholder="Bio" value={editData.bio} onChange={handleEditChange} rows={3} className="form-textarea" />
                        <div className="edit-form-buttons">
                          <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                          <button onClick={handleSaveProfile} className="btn btn-primary">Save</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {userData.bio && <p className="profile-bio">{userData.bio}</p>}
                      <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-full" style={{ marginBottom: '20px' }}>Edit Profile</button>
                    </>
                  )}

                  <div className="trust-rating-container">
                    <h3>Trust Rating</h3>
                    <div className="trust-rating-bar">
                      <div className="trust-rating-center" />
                      <div className="trust-rating-marker" style={{ left: `${((userData.trust_rating + 5) / 10) * 100}%` }} />
                    </div>
                    <div className="trust-rating-labels">
                      <span>-5</span>
                      <span>0</span>
                      <span>+5</span>
                    </div>
                    <p className={`trust-rating-value ${getRatingClass()}`}>
                      {userData.trust_rating > 0 ? '+' : ''}{userData.trust_rating}
                    </p>
                  </div>
                </div>
              )}
              <button onClick={logout} className="btn btn-danger btn-full" style={{ maxWidth: '400px' }}>Log Out</button>
            </div>
          ) : (
            <div className="profile-fullscreen centered">
              <h2>Profile</h2>
              <p style={{ color: '#666', marginBottom: '30px' }}>Please log in to view your profile.</p>
              <button onClick={() => navigate('/login')} className="btn btn-primary btn-full" style={{ maxWidth: '400px' }}>Log In</button>
            </div>
          )
        )}
      </div>

      <div className="menu-container">
        <button onClick={() => setActiveTab('shelters')} className={`menu-item ${activeTab === 'shelters' ? 'active' : ''}`}>
          <IconShelter />
          <span className="menu-item-label">Map</span>
        </button>
        <button onClick={() => setActiveTab('report')} className={`menu-item ${activeTab === 'report' ? 'active' : ''}`}>
          <IconReport />
          <span className="menu-item-label">Report</span>
        </button>
        <button onClick={() => setActiveTab('guide')} className={`menu-item ${activeTab === 'guide' ? 'active' : ''}`}>
          <IconGuide />
          <span className="menu-item-label">Guide</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}>
          <IconProfile />
          <span className="menu-item-label">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Home;