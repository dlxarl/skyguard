import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Router>
      <nav style={{ padding: '15px', borderBottom: '1px solid #eee', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        </div>

        <div>
          {!isAuthenticated ? (
            <>
              <Link to="/register" style={{ marginRight: '15px' }}>Register</Link>
              <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;