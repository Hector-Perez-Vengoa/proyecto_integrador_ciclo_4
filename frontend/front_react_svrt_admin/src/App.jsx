import { Outlet } from 'react-router'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  )
}