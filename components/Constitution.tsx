
import React from 'react';
import { AXIOM_01 } from '../constants';

interface ConstitutionProps {
  isLockdown?: boolean;
}

export const Constitution: React.FC<ConstitutionProps> = ({ isLockdown }) => {
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
          <span className="mono" style={{ fontSize: '9px', fontWeight: 900, padding: '2px 6px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>{AXIOM_01.id}</span>
        </div>
        <p style={{ fontSize: '12px', opacity: 0.8, fontStyle: 'italic', marginBottom: '1rem' }}>{AXIOM_01.description}</p>
        
        <div style={{ marginBottom: '1rem' }}>
          <span className="mono" style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 900, display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Forensic Protocol</span>
          <ul className="mono" style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {AXIOM_01.constraints.map((c, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: isLockdown ? '#f43f5e' : '#f59e0b' }}>▶</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ 
          fontSize: '10px', 
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
    </div>
  );
};
