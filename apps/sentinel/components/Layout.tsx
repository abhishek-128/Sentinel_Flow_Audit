
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  isLockdown?: boolean;
  onReset?: () => void;
  accountTier?: string;
  title?: string;
  systemName?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isLockdown,
  onReset,
  accountTier = 'FREE',
  title = 'SENTINEL FLOW',
  systemName = 'SF'
}) => {
  const location = useLocation();
  const currentState = location.state || {};

  return (
    <div className={`sf-layout ${isLockdown ? 'lockdown-active' : ''} ${systemName === 'SD' ? 'theme-synaptic' : ''}`}>
      {isLockdown && <div className="scanline" />}

      <header className="sf-header">
        <div className="sf-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              className="mono"
              onClick={onReset}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                background: isLockdown ? '#fff' : (systemName === 'SD' ? '#00FFAA' : '#06b6d4'),
                color: isLockdown ? '#9f1239' : '#020617',
                transform: isLockdown ? 'scale(1.1)' : 'none',
                transition: '0.5s',
                cursor: 'pointer'
              }}>{systemName}</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                <span
                  onClick={onReset}
                  style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
                >
                  {title} <span style={{ color: isLockdown ? '#fecdd3' : (systemName === 'SD' ? '#00FFAA' : '#06b6d4') }}>
                    {systemName === 'SD' ? 'DISTILLER' : 'AUDITOR'}
                  </span>
                </span>
              </h1>
              <p className="mono" style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>
                Forensic Intelligence / AB Labs
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/"
              state={currentState}
              style={{
                textDecoration: 'none',
                color: '#94a3b8',
                fontWeight: 800,
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: '0.2s',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#334155'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              ⌂ HOME
            </Link>
            {systemName === 'SF' ? (
              <Link
                to="/distiller"
                state={currentState}
                style={{
                  textDecoration: 'none',
                  color: '#00FFAA',
                  fontWeight: 800,
                  fontSize: '12px',
                  border: '1px solid #00FFAA',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background: 'rgba(0, 255, 170, 0.1)'
                }}
              >
                ⚙ Synaptic Distiller
              </Link>
            ) : (
              <Link
                to="/app"
                state={currentState}
                style={{
                  textDecoration: 'none',
                  color: '#06b6d4',
                  fontWeight: 800,
                  fontSize: '12px',
                  border: '1px solid #06b6d4',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background: 'rgba(6, 182, 212, 0.1)'
                }}
              >
                ⌖ Sentinel Flow Auditor
              </Link>
            )}
            <div className="mono" style={{
              padding: '4px 16px',
              borderRadius: '99px',
              border: '2px solid',
              borderColor: isLockdown ? '#fff' : '#334155',
              background: isLockdown ? '#000' : 'transparent',
              color: isLockdown ? '#fff' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}>
              {isLockdown ? 'SYSTEM_LOCKDOWN: ACTIVE' : 'SECURE_LINK: ESTABLISHED'}
            </div>
            <div className="mono" style={{
              padding: '4px 10px',
              borderRadius: '4px',
              background: accountTier === 'PRO' ? '#f59e0b' : '#334155',
              color: accountTier === 'PRO' ? '#000' : '#fff',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              TIER: {accountTier}
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="sf-container">
          {children}
        </div>
      </main>

      <footer style={{
        padding: '1.5rem 0',
        borderTop: '1px solid var(--border)',
        fontSize: '11px',
        textAlign: 'center',
        opacity: 0.6
      }}>
        <div className="sf-container mono" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <span>&copy; 2026 AB LABS // SENTINEL_V1.0</span>
          <span>{isLockdown ? 'CRITICAL_ALERT: BREACH' : 'AXIOM_INTEGRITY: 100%'}</span>
        </div>
      </footer>
    </div>
  );
};
