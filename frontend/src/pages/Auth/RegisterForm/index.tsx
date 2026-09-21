import { useState, type FormEvent, type ChangeEvent } from 'react';
import { FormField } from '../../../components/FormField';
import type { RegisterPayload, Weights } from '../../../services/api';

interface RegisterFormProps {
  onSubmit: (data: RegisterPayload) => Promise<void>;
  submitting?: boolean;
  errorMessage?: string | null;
  onSuccessSwitch?: () => void;
}

const COURSE_PRESETS: Record<string, { university: string; weights: Weights }> = {
  Medicina: {
    university: 'USP - Universidade de São Paulo',
    weights: { science: 4, mathematics: 3, essay: 3, humanities: 2, language: 2 },
  },
  Direito: {
    university: 'USP - Universidade de São Paulo',
    weights: { humanities: 4, language: 3, essay: 4, mathematics: 1, science: 1 },
  },
  'Ciência da Computação': {
    university: 'UNICAMP - Estadual de Campinas',
    weights: { mathematics: 5, science: 3, language: 2, essay: 2, humanities: 1 },
  },
  Engenharia: {
    university: 'USP - Escola Politécnica',
    weights: { mathematics: 4, science: 4, essay: 2, language: 2, humanities: 1 },
  },
};

export function RegisterForm({
  onSubmit,
  submitting = false,
  errorMessage,
}: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetCourse, setTargetCourse] = useState('');
  const [targetUniversity, setTargetUniversity] = useState('');
  const [showWeights, setShowWeights] = useState(false);
  const [weights, setWeights] = useState<Weights>({
    humanities: 1,
    mathematics: 1,
    science: 1,
    language: 1,
    essay: 1,
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  function applyCoursePreset(courseName: string) {
    setTargetCourse(courseName);
    const preset = COURSE_PRESETS[courseName];
    if (preset) {
      if (!targetUniversity) setTargetUniversity(preset.university);
      setWeights(preset.weights);
    }
  }

  function handleWeightChange(field: keyof Weights, value: string) {
    const num = parseFloat(value);
    setWeights((prev) => ({
      ...prev,
      [field]: isNaN(num) || num <= 0 ? 1 : num,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    if (name.trim().length < 3) {
      setValidationError('O nome deve ter no mínimo 3 caracteres.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setValidationError('Informe um e-mail válido.');
      return;
    }

    if (password.length < 8) {
      setValidationError('A senha precisa ter no mínimo 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('As senhas digitadas não coincidem.');
      return;
    }

    const payload: RegisterPayload = {
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      targetCourse: targetCourse.trim() || undefined,
      targetUniversity: targetUniversity.trim() || undefined,
      weights: {
        humanities: Number(weights.humanities) || 1,
        mathematics: Number(weights.mathematics) || 1,
        science: Number(weights.science) || 1,
        language: Number(weights.language) || 1,
        essay: Number(weights.essay) || 1,
      },
    };

    await onSubmit(payload);
  }

  const hasMinLength = password.length >= 8;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

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

      {/* 1. DADOS DO ESTUDANTE */}
      <div className="auth-form-section">
        <span className="auth-form-section__title">1. Dados do Estudante</span>

        <FormField
          label="Nome completo"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Ex: Beatriz Lins"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          disabled={submitting}
          required
        />

        <FormField
          label="E-mail de acesso"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="beatriz.lins@exemplo.com"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          disabled={submitting}
          required
        />
      </div>

      {/* 2. CALIBRAÇÃO DE METAS SISU / UNIVERSIDADE */}
      <div className="auth-form-section">
        <span className="auth-form-section__title">2. Metas de Curso e Faculdade</span>

        <FormField
          label="Carreira / Curso pretendido"
          type="text"
          name="targetCourse"
          placeholder="Ex: Medicina, Direito, Engenharia..."
          value={targetCourse}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetCourse(e.target.value)}
          disabled={submitting}
        />

        <div className="course-suggestions">
          <span className="course-suggestions__label">Sugestões rápidas:</span>
          <div className="course-suggestions__chips">
            {Object.keys(COURSE_PRESETS).map((course) => (
              <button
                key={course}
                type="button"
                className={`course-chip ${targetCourse === course ? 'course-chip--active' : ''}`}
                onClick={() => applyCoursePreset(course)}
                disabled={submitting}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        <FormField
          label="Instituição / Universidade alvo"
          type="text"
          name="targetUniversity"
          placeholder="Ex: USP, UFRJ, UNICAMP, UFMG..."
          value={targetUniversity}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTargetUniversity(e.target.value)}
          disabled={submitting}
        />

        {/* Acordeão de Pesos Opcionais */}
        <div className="weights-accordion">
          <button
            type="button"
            className="weights-accordion__trigger"
            onClick={() => setShowWeights(!showWeights)}
            aria-expanded={showWeights}
          >
            <span className="weights-accordion__title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Personalizar pesos das matérias (Opcional)
            </span>
            <svg
              className={`weights-accordion__chevron ${showWeights ? 'weights-accordion__chevron--open' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showWeights && (
            <div className="weights-grid">
              <div className="weight-item">
                <label className="weight-item__label">Humanas</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  className="weight-item__input"
                  value={weights.humanities ?? 1}
                  onChange={(e) => handleWeightChange('humanities', e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="weight-item">
                <label className="weight-item__label">Matemática</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  className="weight-item__input"
                  value={weights.mathematics ?? 1}
                  onChange={(e) => handleWeightChange('mathematics', e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="weight-item">
                <label className="weight-item__label">Natureza</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  className="weight-item__input"
                  value={weights.science ?? 1}
                  onChange={(e) => handleWeightChange('science', e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="weight-item">
                <label className="weight-item__label">Linguagens</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  className="weight-item__input"
                  value={weights.language ?? 1}
                  onChange={(e) => handleWeightChange('language', e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="weight-item">
                <label className="weight-item__label">Redação</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  className="weight-item__input"
                  value={weights.essay ?? 1}
                  onChange={(e) => handleWeightChange('essay', e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. CREDENCIAIS DE ACESSO */}
      <div className="auth-form-section">
        <span className="auth-form-section__title">3. Credenciais de Acesso</span>

        <div className="auth-form__grid-2">
          <FormField
            label="Definir senha"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            disabled={submitting}
            required
          />

          <FormField
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repita sua senha"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        {/* Indicadores de requisitos de senha */}
        <div className="password-checks">
          <span className={`password-check-item ${hasMinLength ? 'password-check-item--valid' : ''}`}>
            {hasMinLength ? '✓' : '•'} Mínimo 8 caracteres
          </span>
          <span className={`password-check-item ${passwordsMatch ? 'password-check-item--valid' : ''}`}>
            {passwordsMatch ? '✓' : '•'} Senhas coincidem
          </span>
        </div>
      </div>

      {/* Botão de Envio */}
      <button
        type="submit"
        className="auth-submit-btn"
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? (
          <span className="auth-btn-spinner-wrapper">
            <span className="auth-spinner" aria-hidden="true" />
            <span>Criando sua conta...</span>
          </span>
        ) : (
          <span>Criar Conta &rarr;</span>
        )}
      </button>
    </form>
  );
}

export default RegisterForm;