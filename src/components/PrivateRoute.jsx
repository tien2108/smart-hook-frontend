// components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-screen">Loading...</div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}