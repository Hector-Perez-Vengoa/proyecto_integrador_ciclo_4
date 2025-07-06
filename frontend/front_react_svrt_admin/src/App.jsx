import { Outlet } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      </div>
    </AuthProvider>
  )
}