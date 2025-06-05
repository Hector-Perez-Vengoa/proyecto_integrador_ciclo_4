import { Outlet } from 'react-router'
import './index.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div>
      <main className="bg-gray-300 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}