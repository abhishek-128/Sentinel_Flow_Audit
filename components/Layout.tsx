
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isLockdown?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isLockdown }) => {
  return (
    <div className={`sf-layout ${isLockdown ? 'lockdown-active' : ''}`}>
      {isLockdown && <div className="scanline" />}

      <header className="sf-header">
        <div className="sf-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="mono" style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              background: isLockdown ? '#fff' : '#06b6d4',
              color: isLockdown ? '#9f1239' : '#020617',
              transform: isLockdown ? 'scale(1.1)' : 'none',
              transition: '0.5s'
            }}>SF</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                SENTINEL FLOW <span style={{ color: isLockdown ? '#fecdd3' : '#06b6d4' }}>AUDITOR</span>
              </h1>
              <p className="mono" style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>
                Forensic Intelligence / AB Labs
              </p>
            </div>
          </div>
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
