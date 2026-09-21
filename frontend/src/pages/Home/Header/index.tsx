import { useState } from 'react';
import { useAuth } from '../../../contexts';
import './style.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const displayName = user?.name || 'Estudante';
  const targetDetails = [user?.targetCourse, user?.targetUniversity].filter(Boolean).join(' • ') || 'Ciclo ENEM';

  return (
    <header className="header-container">
      <div className="header-container-left">
        <div className="header-logo-wrapper">
          <img
            src="/favicon.svg"
            alt="Logo SimulaENEM"
            className="logo-image"
          />
          <div className="logo-text">
            <span className="logo-title">Simula</span>
            <span className="logo-title-highlight">ENEM</span>
          </div>
        </div>

        <div className="header-divider" />

        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <span className="breadcrumb-parent">Área do Estudante</span>
          <span className="breadcrumb-separator" aria-hidden="true">
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
          <span className="breadcrumb-current">Dashboard</span>
        </nav>
      </div>

      <div className="header-container-right">
        <div className="header-actions">
          <button type="button" className="btn-primary">
            + Novo Simulado
          </button>
          <button type="button" className="btn-secondary">
            Enviar Redação
          </button>
        </div>

        {/* Perfil do Usuário */}
        <div className="profile-section" style={{ position: 'relative' }}>
          <div className="profile-info">
            <span className="profile-name">{displayName}</span>
            <span className="profile-details">{targetDetails}</span>
          </div>

          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt={displayName}
              className="profile-avatar-img"
            />
          </div>

          {/* Menu Hambúrguer de Opções */}
          <button
            type="button"
            className="profile-menu-btn"
            title="Menu de opções"
            aria-label="Abrir menu de opções do perfil"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg
              className="profile-menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '5.2rem',
                right: 0,
                backgroundColor: '#ffffff',
                borderRadius: '0.8rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                padding: '0.6rem',
                minWidth: '18rem',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <div
                style={{
                  padding: '0.8rem',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '1.2rem',
                  color: '#64748b',
                }}
              >
                Conectado como:
                <br />
                <strong style={{ color: '#0f172a' }}>{user?.email}</strong>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                style={{
                  width: '100%',
                  padding: '0.8rem 1.2rem',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  borderRadius: '0.6rem',
                  color: '#dc2626',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;