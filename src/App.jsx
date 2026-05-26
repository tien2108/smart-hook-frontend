// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthLayout, DashboardLayout } from './layouts'
import PrivateRoute from './components/PrivateRoute'
import { Login, Register, Overview, Devices, Settings, ResetPassword } from './pages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public — auth pages, no header */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected — requires valid token */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Fallback — unknown routes go to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}