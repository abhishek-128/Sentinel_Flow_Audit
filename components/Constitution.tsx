
import React from 'react';
import { AXIOM_01 } from '../constants';
import { CustomAxiom } from '../types';

interface ConstitutionProps {
  isLockdown?: boolean;
  accountTier?: string;
  customAxioms?: CustomAxiom[];
  onAddAxiom?: (axiom: CustomAxiom) => void;
  onRemoveAxiom?: (id: string) => void;
}

export const Constitution: React.FC<ConstitutionProps> = ({
  isLockdown,
  accountTier = 'FREE',
  customAxioms = [],
  onAddAxiom,
  onRemoveAxiom
}) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newDesc, setNewDesc] = React.useState('');

  const handleAdd = () => {
    if (!newTitle || !newDesc || !onAddAxiom) return;
    onAddAxiom({
      id: `AXIOM_CUST_${Date.now().toString().slice(-4)}`,
      title: newTitle,
      description: newDesc,
      severity: 'Critical'
    });
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };
  return (
    <div className="sf-card" style={{
      borderColor: isLockdown ? '#f43f5e' : '#f59e0b',
      background: isLockdown ? 'rgba(159, 18, 57, 0.05)' : 'rgba(245, 158, 11, 0.05)',
      padding: '1.5rem'
    }}>
      <h3 className="mono" style={{
        margin: '0 0 1.5rem 0',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: isLockdown ? '#f43f5e' : '#f59e0b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        Constitution
      </h3>

      <div style={{ borderLeft: '3px solid', borderColor: isLockdown ? '#f43f5e' : '#f59e0b', paddingLeft: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ margin: 0, fontWeight: 900, textTransform: 'uppercase', fontSize: '1rem' }}>{AXIOM_01.title}</h4>
          <span className="mono" style={{ fontSize: '9px', fontWeight: 900, padding: '2px 6px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', visibility: 'hidden' }}>{AXIOM_01.id}</span>
        </div>
        <p style={{ fontSize: '13px', opacity: 0.8, fontStyle: 'italic', marginBottom: '1rem' }}>{AXIOM_01.description}</p>

        <div style={{ marginBottom: '1rem' }}>
          <span className="mono" style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: 900, display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Forensic Protocol</span>
          <ul className="mono" style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {AXIOM_01.constraints.map((c, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: isLockdown ? '#f43f5e' : '#f59e0b' }}>▶</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          fontSize: '12px',
          fontWeight: 900,
          textTransform: 'uppercase',
          color: isLockdown ? '#fff' : '#f43f5e',
          background: isLockdown ? '#f43f5e' : 'transparent',
          padding: isLockdown ? '8px' : '0',
          borderRadius: '4px'
        }}>
          Violator Action: {AXIOM_01.action}
        </div>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', opacity: accountTier === 'FREE' ? 0.5 : 1, pointerEvents: accountTier === 'FREE' ? 'none' : 'auto' }}>
        <h4 className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px' }}>Custom Axioms</span>
          <span style={{ fontSize: '11px', background: accountTier === 'PRO' ? '#f59e0b' : '#334155', color: accountTier === 'PRO' ? '#000' : '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
            {accountTier === 'PRO' ? 'ACTIVE' : 'PRO ONLY'}
          </span>
        </h4>

        {accountTier === 'FREE' ? (
          <div style={{ padding: '1rem', border: '1px dashed #334155', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Upgrade to Sentinel Pro to enforce custom constitutional boundaries.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {customAxioms.map(axiom => (
              <div key={axiom.id} style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="mono" style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 800 }}>{axiom.id}</span>
                  <button
                    onClick={() => onRemoveAxiom && onRemoveAxiom(axiom.id)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '0.25rem' }}>{axiom.title}</div>
                <div style={{ fontSize: '13px', opacity: 0.7, lineHeight: 1.4 }}>{axiom.description}</div>
              </div>
            ))}

            {isAdding ? (
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid #334155' }}>
                <input
                  placeholder="Axiom Title (e.g. No Competitor Mentions)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #334155', color: '#fff', fontSize: '13px', padding: '4px 0', marginBottom: '0.5rem', outline: 'none' }}
                />
                <textarea
                  placeholder="Description of rule..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '13px', padding: '4px 0', marginBottom: '1rem', outline: 'none', minHeight: '40px', fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleAdd} className="sf-btn" style={{ flex: 1, padding: '4px', fontSize: '11px', background: '#f59e0b', color: '#000', textAlign: 'center', justifyContent: 'center' }}>Save</button>
                  <button onClick={() => setIsAdding(false)} className="sf-btn" style={{ flex: 1, padding: '4px', fontSize: '11px', background: '#334155', textAlign: 'center', justifyContent: 'center' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="sf-btn"
                style={{ width: '100%', padding: '0.5rem', fontSize: '11px', background: 'rgba(255,255,255,0.05)', border: '1px dashed #334155', color: '#94a3b8' }}
              >
                + Add New Axiom
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
