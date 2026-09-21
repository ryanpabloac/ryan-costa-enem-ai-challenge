export type AuthMode = 'register' | 'login';

interface AuthTabsProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
  disabled?: boolean;
}

export function AuthTabs({ mode, onChange, disabled = false }: AuthTabsProps) {
  return (
    <div className="auth-tabs" role="tablist" aria-label="Modo de autenticação">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'register'}
        className={`auth-tabs__item ${mode === 'register' ? 'auth-tabs__item--active' : ''}`}
        onClick={() => onChange('register')}
        disabled={disabled}
      >
        Criar nova conta de estudante
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'login'}
        className={`auth-tabs__item ${mode === 'login' ? 'auth-tabs__item--active' : ''}`}
        onClick={() => onChange('login')}
        disabled={disabled}
      >
        Já tenho uma conta
      </button>
    </div>
  );
}

export default AuthTabs;