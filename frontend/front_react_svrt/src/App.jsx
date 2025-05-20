import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Perfil from './components/Perfil.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!userData);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/perfil');
  };

  return (
    <div className="app fixed inset-0 w-screen h-screen">
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/perfil" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
        } />
        <Route path="/perfil" element={
          isAuthenticated ? <Perfil /> : <Navigate to="/" replace />
        } />
      </Routes>
    </div>
  );
}

export default App;
