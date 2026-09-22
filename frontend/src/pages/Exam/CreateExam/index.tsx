import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { api, type ExamArea } from '../../../services/api';
import './style.css';

const areaOptions: Array<{ value: ExamArea; label: string; description: string }> = [
  { value: 'linguagens', label: 'Linguagens', description: 'Leitura, gramática e língua estrangeira' },
  { value: 'humanas', label: 'Ciências Humanas', description: 'História, geografia e filosofia' },
  { value: 'natureza', label: 'Ciências da Natureza', description: 'Biologia, química e física' },
  { value: 'matematica', label: 'Matemática', description: 'Álgebra, geometria e estatística' },
];

const languageOptions = [
  { value: 'ingles', label: 'Inglês' },
  { value: 'espanhol', label: 'Espanhol' },
] as const;

export const CreateExamPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [selectedArea, setSelectedArea] = useState<ExamArea>('linguagens');
  const [selectedLanguage, setSelectedLanguage] = useState<(typeof languageOptions)[number]['value']>('ingles');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showLanguageSelector = useMemo(() => selectedArea === 'linguagens', [selectedArea]);

  async function handleCreateExam() {
    if (!token) {
      setErrorMessage('Você precisa estar autenticado para iniciar um simulado.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        area: selectedArea,
        ...(selectedArea === 'linguagens' ? { foreignLanguage: selectedLanguage } : {}),
      };

      const examCreated = await api.createExam(token, payload);
      navigate(`/simulado/${examCreated.id}`);
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Não foi possível criar o simulado.';
      setErrorMessage(description);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="exam-page-shell">
      <div className="exam-page-card">
        <div className="exam-page-card__header">
          <div>
            <span className="exam-page-card__eyebrow">Novo simulado</span>
            <h1>Configuração do exame</h1>
          </div>

          <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Voltar ao dashboard
          </button>
        </div>

        <p className="exam-page-card__intro">
          Escolha uma área para iniciar seu simulado. Em Linguagens, também é necessário definir a língua estrangeira.
        </p>

        <div className="exam-area-grid">
          {areaOptions.map((area) => (
            <button
              key={area.value}
              type="button"
              className={`exam-area-option ${selectedArea === area.value ? 'is-selected' : ''}`}
              onClick={() => setSelectedArea(area.value)}
            >
              <span className="exam-area-option__title">{area.label}</span>
              <span className="exam-area-option__description">{area.description}</span>
            </button>
          ))}
        </div>

        {showLanguageSelector && (
          <div className="exam-language-block">
            <label className="exam-language-label" htmlFor="foreign-language">
              Língua estrangeira
            </label>
            <div className="exam-language-options" id="foreign-language">
              {languageOptions.map((language) => (
                <button
                  key={language.value}
                  type="button"
                  className={`exam-language-option ${selectedLanguage === language.value ? 'is-selected' : ''}`}
                  onClick={() => setSelectedLanguage(language.value)}
                >
                  {language.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {errorMessage && <div className="exam-form-error">{errorMessage}</div>}

        <div className="exam-page-card__actions">
          <button type="button" className="btn-primary" onClick={handleCreateExam} disabled={isSubmitting}>
            {isSubmitting ? 'Criando simulado...' : 'Começar simulado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExamPage;
