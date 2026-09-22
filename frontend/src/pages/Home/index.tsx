import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.css';
import Header from './Header';
import { useAuth } from '../../contexts';
import { api, type ExamArea, type ExamSummary } from '../../services/api';

const areaLabels: Record<ExamArea, string> = {
  linguagens: 'Linguagens',
  matematica: 'Matemática',
  natureza: 'Ciências da Natureza',
  humanas: 'Ciências Humanas',
};

const formatDate = (value: string): string => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [exams, setExams] = useState<ExamSummary[] | null>(token ? null : []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    api
      .getExams(token)
      .then((userExams) => {
        if (isMounted) {
          setExams(userExams);
        }
      })
      .catch((error) => {
        console.warn('Não foi possível carregar o histórico de simulados.', error);
        if (isMounted) {
          setExams([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, location.pathname]);

  const isLoading = token !== null && exams === null;
  const completedExams = useMemo(
    () => (exams ?? []).filter((exam) => exam.status === 'COMPLETED'),
    [exams],
  );
  const pendingExam = useMemo(
    () => exams?.find((exam) => exam.status === 'IN_PROGRESS') ?? null,
    [exams],
  );

  const areaMetrics = useMemo(
    () =>
      (Object.keys(areaLabels) as ExamArea[]).map((areaKey) => {
        const areaExams = completedExams.filter((exam) => exam.area === areaKey);
        const average =
          areaExams.length > 0
            ? Math.round(
                areaExams.reduce((sum, exam) => sum + (exam.result?.scorePercentage ?? 0), 0) /
                  areaExams.length,
              )
            : 0;

        return {
          label: areaLabels[areaKey],
          average,
          exams: areaExams.length,
        };
      }),
    [completedExams],
  );

  const overallTriAverage =
    completedExams.length > 0
      ? Math.round(
          completedExams.reduce((sum, exam) => sum + (exam.result?.triScore ?? 0), 0) /
            completedExams.length,
        )
      : 0;

  const recentSimulations = completedExams
    .slice(0, 5)
    .map((exam) => ({
      id: exam.id,
      area: areaLabels[exam.area],
      date: formatDate(exam.createdAt),
      percentage: exam.result?.scorePercentage ?? 0,
    }));

  return (
    <div className="home-container">
      <Header />

      <main className="home-main">
        <div className="dashboard-container">
          <section className="overview-card">
            <div className="overview-card__content">
              <span className="overview-card__eyebrow">Média TRI geral</span>

              <div className="overview-card__score-wrap">
                <span className="overview-card__score">{isLoading ? '-' : overallTriAverage}</span>
                <span className="overview-card__score-unit">pts</span>
              </div>

              <p className="overview-card__description">
                {completedExams.length > 0
                  ? `${user?.name || 'Estudante'} está com média consolidada em todas as áreas do ENEM.`
                  : 'Você ainda não concluiu nenhum simulado. Inicie o primeiro para acompanhar seu TRI.'}
              </p>
            </div>

            <div className="overview-card__cta">
              <button type="button" className="btn-primary" onClick={() => navigate('/simulado/novo')}>
                Iniciar simulado
              </button>
            </div>
          </section>

          {pendingExam && (
            <section className="pending-exam-banner">
              <div>
                <span className="pending-exam-banner__eyebrow">Simulado em andamento</span>
                <h3>Você tem um simulado de {areaLabels[pendingExam.area]} em progresso.</h3>
              </div>

              <button type="button" className="btn-primary" onClick={() => navigate(`/simulado/${pendingExam.id}`)}>
                Continuar simulado
              </button>
            </section>
          )}

          <section className="area-grid" aria-label="Médias por área de conhecimento">
            {areaMetrics.map((area) => (
              <article key={area.label} className="area-card">
                <div className="area-card__header">
                  <span className="area-card__label">{area.label}</span>
                  <span className="area-card__count">{area.exams} simulados</span>
                </div>

                <div className="area-card__value-wrap">
                  <span className="area-card__value">{area.average}</span>
                  <span className="area-card__suffix">%</span>
                </div>

                <p className="area-card__meta">
                  {area.exams > 0 ? 'Média de acertos' : 'Sem dados ainda'}
                </p>
              </article>
            ))}
          </section>

          <section className="history-section">
            <div className="section-header">
              <div>
                <span className="section-header__eyebrow">Histórico</span>
                <h2>Últimos simulados</h2>
              </div>

              <span className="section-header__summary">{completedExams.length} concluídos</span>
            </div>

            {recentSimulations.length > 0 ? (
              <div className="history-list" aria-label="Histórico de simulados realizados">
                {recentSimulations.map((simulation) => (
                  <article key={simulation.id} className="history-item">
                    <div className="history-item__date">
                      <span>{simulation.date}</span>
                    </div>

                    <div className="history-item__area">
                      <span className="history-item__badge">{simulation.area}</span>
                    </div>

                    <div className="history-item__score">
                      <strong>{simulation.percentage}%</strong>
                      <span>acerto</span>
                    </div>

                    <button
                      type="button"
                      className="btn-secondary history-item__action"
                      onClick={() => navigate(`/simulado/${simulation.id}/resultado`)}
                    >
                      Ver gabarito
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="history-empty">
                Nenhum simulado concluído até o momento.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
