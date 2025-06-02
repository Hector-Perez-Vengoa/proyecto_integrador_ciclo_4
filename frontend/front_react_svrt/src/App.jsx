// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './logic/useAuth';
import { WelcomeProvider } from './context/WelcomeContext';
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
    <WelcomeProvider>
      <div className="app fixed inset-0 w-screen h-screen">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Login onLoginSuccess={login} />
              )
            }
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <Dashboard initialView="dashboard" />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />          <Route
            path="/perfil"
            element={
              isAuthenticated ? (
                <Dashboard initialView="profile" />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/perfil/edit"
            element={
              isAuthenticated ? (
                <Dashboard initialView="profile" editing={true} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          /></Routes>
      </div>
    </WelcomeProvider>
  );
}

export default App;