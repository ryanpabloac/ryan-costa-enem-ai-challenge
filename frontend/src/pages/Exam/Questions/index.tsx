import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { api, type ExamDetail } from '../../../services/api';
import { clearStoredExamProgress, getStoredExamProgress, setStoredExamProgress, type ExamAnswerLetter } from '../../../utils/examProgress';
import './style.css';

export const ExamQuestionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, ExamAnswerLetter>>({});

  useEffect(() => {
    if (!id || !token) {
      return;
    }

    let isMounted = true;

    api
      .getExam(token, id)
      .then((examData) => {
        if (!isMounted) {
          return;
        }

        if (examData.status === 'COMPLETED') {
          navigate(`/simulado/${id}/resultado`, { replace: true });
          return;
        }

        const storedProgress = getStoredExamProgress();
        const restoredAnswers = storedProgress && storedProgress.id === id ? storedProgress.answers : {};

        setExam(examData);
        setSelectedAnswers(restoredAnswers);
        setCurrentIndex(0);
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar o simulado.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, navigate, token]);

  const currentQuestion = exam?.questions[currentIndex] ?? null;
  const answeredCount = useMemo(
    () => Object.keys(selectedAnswers).filter((index) => selectedAnswers[Number(index)]).length,
    [selectedAnswers],
  );

  useEffect(() => {
    if (!exam || !id) {
      return;
    }

    setStoredExamProgress({
      id,
      area: exam.area,
      answers: selectedAnswers,
      updatedAt: new Date().toISOString(),
    });
  }, [exam, id, selectedAnswers]);

  function handleSelectAnswer(letter: ExamAnswerLetter) {
    if (!currentQuestion) {
      return;
    }

    setSelectedAnswers((previous) => ({
      ...previous,
      [currentIndex]: letter,
    }));
    setErrorMessage(null);
  }

  async function handleFinishExam() {
    if (!exam || !id || !token) {
      return;
    }

    const missingAnswers = exam.questions.some((_, index) => !selectedAnswers[index]);
    if (missingAnswers) {
      setErrorMessage('Responda todas as questões antes de finalizar o simulado.');
      return;
    }

    try {
      const answers = exam.questions.map((_, index) => ({
        questionIndex: index,
        selectedAnswer: selectedAnswers[index],
      }));

      const result = await api.submitExamAnswers(token, id, { answers });
      clearStoredExamProgress();
      navigate(`/simulado/${id}/resultado`, { state: { result }, replace: true });
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Não foi possível enviar as respostas.';
      setErrorMessage(description);
    }
  }

  if (isLoading) {
    return (
      <div className="exam-page-shell exam-page-shell--centered">
        <div className="exam-page-card exam-page-card--loading">Carregando simulado...</div>
      </div>
    );
  }

  if (!exam || !currentQuestion) {
    return (
      <div className="exam-page-shell exam-page-shell--centered">
        <div className="exam-page-card exam-page-card--loading">
          {errorMessage || 'Não foi possível localizar este simulado.'}
        </div>
      </div>
    );
  }

  return (
    <div className="exam-page-shell">
      <div className="exam-question-layout">
        <aside className="exam-question-sidebar">
          <div className="exam-question-sidebar__header">
            <span className="exam-page-card__eyebrow">Simulado</span>
            <h2>{exam.area}</h2>
          </div>

          <div className="question-progress-grid">
            {exam.questions.map((_, index) => {
              const isCurrent = index === currentIndex;
              const isAnswered = Boolean(selectedAnswers[index]);

              return (
                <button
                  key={`question-index-${index + 1}`}
                  type="button"
                  className={`question-progress-item ${isCurrent ? 'is-current' : ''} ${isAnswered ? 'is-answered' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="question-status-box">
            <strong>{answeredCount}</strong>
            <span>de {exam.questions.length} respondidas</span>
          </div>
        </aside>

        <main className="exam-question-card">
          <div className="exam-question-card__header">
            <div>
              <span className="exam-page-card__eyebrow">Questão {currentIndex + 1}</span>
              <h1>{currentQuestion.discipline}</h1>
            </div>

            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Sair
            </button>
          </div>

          <p className="exam-question-text">{currentQuestion.statement}</p>

          <div className="exam-answer-list">
            {currentQuestion.alternatives.map((alternative) => {
              const isSelected = selectedAnswers[currentIndex] === alternative.letter;

              return (
                <button
                  key={`${currentQuestion.discipline}-${alternative.letter}`}
                  type="button"
                  className={`exam-answer-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectAnswer(alternative.letter)}
                >
                  <span className="exam-answer-option__letter">{alternative.letter}</span>
                  <span>{alternative.text}</span>
                </button>
              );
            })}
          </div>

          {errorMessage && <div className="exam-form-error">{errorMessage}</div>}

          <div className="exam-question-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
              disabled={currentIndex === 0}
            >
              Anterior
            </button>

            {currentIndex < exam.questions.length - 1 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentIndex((value) => Math.min(exam.questions.length - 1, value + 1))}
              >
                Próxima
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={handleFinishExam}>
                Finalizar simulado
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamQuestionsPage;
