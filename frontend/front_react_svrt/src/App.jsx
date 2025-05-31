// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './logic/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/ui/LoadingSpinner';
import './App.css';

function App() {
  const { isAuthenticated, loading, login } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" text="Cargando aplicación..." />;
  }

  return (
    <div className="app fixed inset-0 w-screen h-screen">
      <Routes>        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/perfil" replace />
            ) : (
              <Login onLoginSuccess={login} />
            )
          } 
        />
        <Route 
          path="/perfil" 
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
}

export default App;