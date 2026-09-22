import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { api, type ExamDetail } from '../../../services/api';
import './style.css';

export const ExamResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const resultState = location.state as { result?: ExamDetail } | null;
  const [exam, setExam] = useState<ExamDetail | null>(resultState?.result ?? null);
  const [isLoading, setIsLoading] = useState(!resultState?.result);

  useEffect(() => {
    if (!id || !token) {
      return;
    }

    let isMounted = true;

    const loadExam = async () => {
      try {
        const examData = await api.getExam(token, id);
        if (isMounted) {
          setExam(examData);
        }
      } catch (error) {
        console.warn('Não foi possível carregar o resultado do simulado.', error);
        if (isMounted) {
          setExam(resultState?.result ?? null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadExam();

    return () => {
      isMounted = false;
    };
  }, [id, resultState?.result, token]);

  const stats = useMemo(() => {
    if (!exam?.result) {
      return null;
    }

    return exam.result;
  }, [exam]);

  if (isLoading) {
    return (
      <div className="exam-page-shell exam-page-shell--centered">
        <div className="exam-page-card exam-page-card--loading">Carregando resultado...</div>
      </div>
    );
  }

  if (!exam || !stats) {
    return (
      <div className="exam-page-shell exam-page-shell--centered">
        <div className="exam-page-card exam-page-card--loading">Resultado do simulado não disponível.</div>
      </div>
    );
  }

  return (
    <div className="exam-page-shell">
      <div className="result-page-card">
        <div className="result-page-card__header">
          <div>
            <span className="exam-page-card__eyebrow">Resultado</span>
            <h1>Seu desempenho</h1>
          </div>

          <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard', { replace: true })}>
            Voltar ao dashboard
          </button>
        </div>

        <div className="result-summary-grid">
          <article className="result-summary-card result-summary-card--primary">
            <span>Acertos</span>
            <strong>{stats.correctCount}</strong>
          </article>

          <article className="result-summary-card result-summary-card--warning">
            <span>Erros</span>
            <strong>{stats.wrongCount}</strong>
          </article>

          <article className="result-summary-card result-summary-card--success">
            <span>Porcentagem</span>
            <strong>{stats.scorePercentage}%</strong>
          </article>

          <article className="result-summary-card result-summary-card--accent">
            <span>TRI</span>
            <strong>{stats.triScore}</strong>
          </article>
        </div>

        <div className="result-questions-list">
          {exam.questions.map((question, index) => {
            const selectedAnswer = question.selectedAnswer ?? exam.answers?.find((answer) => answer.questionIndex === index)?.selectedAnswer;
            const isCorrect = selectedAnswer === question.correctAnswer;

            return (
              <article key={`${question.statement}-${index}`} className={`result-question-item ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                <div className="result-question-item__header">
                  <span>Questão {index + 1}</span>
                  <span className="result-question-item__badge">{isCorrect ? 'Acertou' : 'Errou'}</span>
                </div>

                <p className="result-question-item__statement">{question.statement}</p>

                <div className="result-answer-lines">
                  <div className="result-answer-line">
                    <span>Sua resposta:</span>
                    <strong>{selectedAnswer ?? 'Sem resposta'}</strong>
                  </div>
                  <div className="result-answer-line">
                    <span>Resposta correta:</span>
                    <strong>{question.correctAnswer}</strong>
                  </div>
                </div>

                <p className="result-question-item__explanation">
                  <strong>Explicação:</strong> {question.explanation}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
