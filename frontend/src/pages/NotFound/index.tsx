import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import './style.css';

function LostPathIllustration() {
  return (
    <div className="not-found-illustration" aria-hidden="true">
      <div className="not-found-illustration__orb not-found-illustration__orb--blue" />
      <div className="not-found-illustration__orb not-found-illustration__orb--green" />
      <svg className="not-found-illustration__art" viewBox="0 0 420 320" fill="none">
        <path
          d="M73 255c33-32 74-42 120-31 45 10 82 8 110-18 27-25 57-29 92-12"
          stroke="#0B4FBF"
          strokeLinecap="round"
          strokeWidth="5"
          opacity=".18"
        />
        <path
          d="M87 246c33-18 67-21 102-9 40 14 72 11 99-12 27-23 58-28 91-15"
          stroke="#099350"
          strokeLinecap="round"
          strokeWidth="5"
          opacity=".2"
        />
        <g transform="rotate(-8 205 148)">
          <rect x="113" y="55" width="185" height="190" rx="14" fill="#fff" />
          <rect x="113" y="55" width="185" height="190" rx="14" stroke="#D9E4F2" strokeWidth="3" />
          <rect x="137" y="84" width="77" height="10" rx="5" fill="#0B4FBF" opacity=".16" />
          <rect x="137" y="111" width="132" height="7" rx="3.5" fill="#CBD5E1" />
          <rect x="137" y="127" width="112" height="7" rx="3.5" fill="#E2E8F0" />
          <circle cx="153" cy="166" r="11" stroke="#0B4FBF" strokeWidth="4" />
          <circle cx="186" cy="166" r="11" stroke="#CBD5E1" strokeWidth="4" />
          <circle cx="219" cy="166" r="11" stroke="#CBD5E1" strokeWidth="4" />
          <path d="m143 207 12 12 22-27" stroke="#099350" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
          <rect x="198" y="198" width="58" height="10" rx="5" fill="#E2E8F0" />
        </g>
        <path
          d="m310 82 8 17 19 3-14 14 3 19-16-9-17 9 3-19-14-14 19-3 9-17Z"
          fill="#F59E0B"
          opacity=".9"
        />
        <path
          d="M88 87c0-18 14-32 32-32s32 14 32 32c0 23-32 51-32 51S88 110 88 87Z"
          fill="#E8F0FE"
          stroke="#0B4FBF"
          strokeWidth="4"
        />
        <circle cx="120" cy="86" r="10" fill="#0B4FBF" />
        <path d="m119 80 3 6-3 6-3-6 3-6Z" fill="#fff" />
      </svg>
    </div>
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <main className="not-found-page">
      <header className="not-found-header">
        <button type="button" className="not-found-brand" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}>
          <img src="/favicon.svg" alt="Logo SimulaENEM" />
          <span>
            Simula<span>ENEM</span>
          </span>
        </button>
        <span className="not-found-header__label">Plataforma de estudos para o ENEM</span>
      </header>

      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-copy">
          <span className="not-found-eyebrow">Erro 404</span>
          <h1 id="not-found-title">Ops! Essa página saiu do caminho.</h1>
          <p>
            O endereço que você acessou não existe ou foi movido. Vamos voltar para um lugar onde você
            possa continuar sua preparação?
          </p>
          <div className="not-found-actions">
            <button type="button" className="btn-primary not-found-actions__primary" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}>
              {isAuthenticated ? 'Voltar ao dashboard' : 'Ir para o login'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Voltar uma página
            </button>
          </div>
        </div>

        <LostPathIllustration />
      </section>
    </main>
  );
}

export default NotFoundPage;
