import './style.css';
import Header from './Header';
import { useAuth } from '../../contexts';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <Header />
      {/* Conteúdo Principal */}
      <main className="home-main">
        <div style={{ maxWidth: '112rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
          {/* Banner de Boas-Vindas */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.2rem',
              padding: '2.4rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.6rem',
            }}
          >
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0b4fbf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Painel do Estudante
              </span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>
                Olá, {user?.name || 'Estudante'}!
              </h1>
              <p style={{ fontSize: '1.4rem', color: '#64748b', marginTop: '0.4rem' }}>
                Sua meta atual: <strong>{user?.targetCourse || 'Não informado'}</strong> na{' '}
                <strong>{user?.targetUniversity || 'Faculdade alvo'}</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => alert('Módulo de configuração de simulados será o próximo passo!')}
              >
                Configurar Simulado &rarr;
              </button>
            </div>
          </div>

          {/* Grid de Informações dos Pesos e Diagnóstico */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(28rem, 1fr))', gap: '1.6rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '1.2rem',
                padding: '2rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.2rem' }}>
                Pesos Cadastrados no SISU
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '1.3rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Ciências Humanas:</span>
                  <strong>{user?.weights?.humanities ?? 1}x</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Matemática e Exatas:</span>
                  <strong>{user?.weights?.mathematics ?? 1}x</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Ciências da Natureza:</span>
                  <strong>{user?.weights?.science ?? 1}x</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Linguagens e Códigos:</span>
                  <strong>{user?.weights?.language ?? 1}x</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Redação:</span>
                  <strong>{user?.weights?.essay ?? 1}x</strong>
                </li>
              </ul>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '1.2rem',
                padding: '2rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.2rem' }}>
                Diagnóstico Pedagógico
              </h2>
              <p style={{ fontSize: '1.3rem', color: '#64748b', lineHeight: 1.5 }}>
                Nenhum simulado finalizado ainda. Inicie seu primeiro simulado para calibrar sua pontuação inicial na régua oficial do Inep com cálculo TRI.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;