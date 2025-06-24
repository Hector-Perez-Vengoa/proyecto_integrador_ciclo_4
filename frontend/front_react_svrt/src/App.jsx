// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { WelcomeProvider } from './context/WelcomeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import {
  DashboardHome,
  ProfilePage,
  ProfileEditPage,
  AulasPage,
  MisReservasPage,
  CalendarioPage,
  ReglamentoPage
} from './pages/dashboard/index.js';
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
          {/* Ruta pública - Login */}
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
          
          {/* Rutas protegidas anidadas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Ruta por defecto del dashboard */}
            <Route index element={<DashboardHome />} />
            
            {/* Rutas de perfil */}
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="perfil/edit" element={<ProfileEditPage />} />
            
            {/* Rutas de reservas */}
            <Route path="aulas" element={<AulasPage />} />
            <Route path="mis-reservas" element={<MisReservasPage />} />
            <Route path="calendario" element={<CalendarioPage />} />
            
            {/* Ruta de reglamento */}
            <Route path="reglamento" element={<ReglamentoPage />} />
          </Route>

          {/* Rutas legacy - Redireccionamientos para compatibilidad */}
          <Route path="/perfil" element={<Navigate to="/home/perfil" replace />} />
          <Route path="/perfil/edit" element={<Navigate to="/home/perfil/edit" replace />} />
          <Route path="/dashboard/aulavirtual" element={<Navigate to="/home/aulas" replace />} />
          
          {/* Ruta catch-all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </WelcomeProvider>
  );
}

export default App;