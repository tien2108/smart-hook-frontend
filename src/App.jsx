import { Routes, Route, Navigate } from 'react-router-dom';
import DeviceManager from './pages/DeviceManager.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/devices" />} />
      <Route path="/devices" element={<DeviceManager />} />
    </Routes>
  );
}

export default App;