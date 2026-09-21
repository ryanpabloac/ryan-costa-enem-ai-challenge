import { useEffect, useState, type ReactNode } from 'react';
import { api, type LoginPayload, type RegisterPayload, type User } from '../services/api';
import { getAuthCookie, removeAuthCookie, setAuthCookie } from '../utils/cookie';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAuthCookie());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredUser() {
      const storedToken = getAuthCookie();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await api.getMe(storedToken);
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.warn('Sessão expirada ou token inválido:', error);
        removeAuthCookie();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredUser();
  }, []);

  async function login(credentials: LoginPayload) {
    const response = await api.login(credentials);
    const receivedToken = response.token;

    setAuthCookie(receivedToken);
    setToken(receivedToken);

    try {
      const userData = await api.getMe(receivedToken);
      setUser(userData);
    } catch {
      // Se /auth/me falhar momentaneamente, o usuário ainda possui o token para navegar
      setUser({
        name: credentials.email.split('@')[0],
        email: credentials.email,
      });
    }
  }

  async function register(payload: RegisterPayload) {
    await api.register(payload);
  }

  function logout() {
    removeAuthCookie();
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    if (!token) return;
    try {
      const userData = await api.getMe(token);
      setUser(userData);
    } catch {
      // silencioso
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
