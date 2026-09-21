import { useState, type FormEvent, type ChangeEvent } from 'react';
import { FormField } from '../../../components/FormField';
import type { LoginPayload } from '../../../services/api';

interface LoginFormProps {
  onSubmit: (data: LoginPayload) => Promise<void>;
  submitting?: boolean;
  errorMessage?: string | null;
}

export function LoginForm({ onSubmit, submitting = false, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError('Por favor, informe seu e-mail.');
      return;
    }

    if (!password) {
      setValidationError('Por favor, informe sua senha.');
      return;
    }

    await onSubmit({ email: email.trim(), password });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {(errorMessage || validationError) && (
        <div className="auth-alert auth-alert--error" role="alert">
          <svg
            className="auth-alert__icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMessage || validationError}</span>
        </div>
      )}

      <FormField
        label="E-mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="seuemail@exemplo.com"
        value={email}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        disabled={submitting}
        required
      />

      <FormField
        label="Senha"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="********"
        value={password}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
        disabled={submitting}
        required
      />

      <button
        type="submit"
        className="auth-submit-btn"
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? (
          <span className="auth-btn-spinner-wrapper">
            <span className="auth-spinner" aria-hidden="true" />
            <span>Entrando...</span>
          </span>
        ) : (
          <span>Entrar na plataforma &rarr;</span>
        )}
      </button>
    </form>
  );
}

export default LoginForm;