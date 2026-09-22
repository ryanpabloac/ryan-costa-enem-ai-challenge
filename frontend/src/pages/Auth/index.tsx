import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthTabs, type AuthMode } from './Tabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../contexts';
import type { LoginPayload, RegisterPayload } from '../../services/api';
import './auth.css';

export function AuthPage() {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { login, register, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mode: AuthMode = location.pathname === '/login' ? 'login' : 'register';

  // Se já estiver logado, redireciona para a página de dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  function handleModeChange(newMode: AuthMode) {
    setErrorMessage(null);
    setSuccessMessage(null);
    navigate(newMode === 'login' ? '/login' : '/register');
  }

  async function handleLogin(data: LoginPayload) {
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await login(data);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao realizar login.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(data: RegisterPayload) {
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await register(data);
      setSuccessMessage('Conta criada com sucesso! Você já pode realizar o login com seu e-mail e senha.');
      navigate('/login', { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-split-layout">
        {/* Painel Esquerdo: Formulário Minimalista */}
        <section className="auth-main-panel" aria-label="Área de Acesso do Estudante">
          <div className="auth-main-container">
            {/* Cabeçalho e Marca */}
            <div className="auth-brand-row">
              <div className="auth-brand">
                <img
                  src="/favicon.svg"
                  alt="Logo SimulaENEM"
                  className="auth-brand__logo"
                />
                <span className="auth-brand__title">
                  Simula<span className="auth-brand__highlight">ENEM</span>
                </span>
              </div>
            </div>

            {/* Headline com a proposta de valor */}
            <div className="auth-header-copy">
              <span className="auth-pretitle">Plataforma de Estudos para o ENEM utilizando IA</span>
              <h1 className="auth-headline">
                {mode === 'register'
                  ? 'Cadastre-se agora!'
                  : 'Acesse sua conta.'}
              </h1>
              <p className="auth-subheadline">
                {mode === 'register'
                  ? 'Cadastre-se agora e apriveite essa oportunidade!'
                  : 'Digite suas credenciais para acessar seu painel de estudos e simulados.'}
              </p>
            </div>

            {/* Abas de Alternância */}
            <AuthTabs mode={mode} onChange={handleModeChange} disabled={submitting} />

            {/* Alerta de Sucesso */}
            {successMessage && (
              <div className="auth-alert auth-alert--success" role="status">
                <svg
                  className="auth-alert__icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Formulários */}
            {mode === 'register' ? (
              <RegisterForm
                onSubmit={handleRegister}
                submitting={submitting}
                errorMessage={errorMessage}
              />
            ) : (
              <LoginForm
                onSubmit={handleLogin}
                submitting={submitting}
                errorMessage={errorMessage}
              />
            )}

            {/* Alternância Rápida de Rodapé */}
            <p className="auth-footer-switch">
              {mode === 'register' ? (
                <>
                  Já possui cadastro no SimulaENEM?{' '}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => handleModeChange('login')}
                    disabled={submitting}
                  >
                    Fazer login agora
                  </button>
                </>
              ) : (
                <>
                  Ainda não tem conta de estudante?{' '}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => handleModeChange('register')}
                    disabled={submitting}
                  >
                    Criar conta agora
                  </button>
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;