import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';
import { getAuthCookie } from '../utils/cookie';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const hasCookieToken = !!getAuthCookie();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          gap: '1.6rem',
        }}
      >
        <div
          style={{
            width: '4rem',
            height: '4rem',
            border: '3px solid #e2e8f0',
            borderTopColor: '#0b4fbf',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '1.4rem', color: '#64748b', fontWeight: 500 }}>
          Carregando sua sessão...
        </span>
      </div>
    );
  }

  // Verifica tanto o estado de autenticação quanto a presença do cookie
  if (!isAuthenticated || !hasCookieToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
