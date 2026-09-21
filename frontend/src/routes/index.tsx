import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/Auth';
import { Home } from '../pages/Home';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Rota Padrão / Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
