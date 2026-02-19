
import React from 'react';
import { AuditReport, AuditResult } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface DashboardProps {
  report: AuditReport;
}

const SEVERITY_COLORS: Record<string, string> = {
  Critical: '#f43f5e',
  Warning: '#f59e0b',
  Informational: '#3b82f6',
};

export const Dashboard: React.FC<DashboardProps> = ({ report }) => {
  const [isSuspended, setIsSuspended] = React.useState(false);

  const integrityData = [
    { name: 'Integrity', value: report.overallIntegrityScore },
    { name: 'Drift Risk', value: 100 - report.overallIntegrityScore },
  ];

  const reasoningData = [
    { name: 'Healthy Reasoning', value: report.reasoningHealthScore },
    { name: 'Drift Reasoning', value: 100 - report.reasoningHealthScore },
  ];

  const statusCounts = report.results.reduce((acc: any, res) => {
    acc[res.complianceStatus] = (acc[res.complianceStatus] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(statusCounts).map(status => ({
    name: status,
    count: statusCounts[status],
  }));

  const handleSuspend = () => {
    if (confirm("INITIATE AGENT KILL-SWITCH? THIS ACTION IS PERMANENT.")) {
      setIsSuspended(true);
    }
  };

  if (isSuspended) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', background: '#000', borderRadius: '2rem', border: '4px solid #9f1239', boxShadow: '0 0 50px rgba(159, 18, 57, 0.3)' }}>
        <h1 className="mono crt-flicker" style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.1em' }}>Agent Purged</h1>
        <p className="mono" style={{ fontSize: '1rem', color: '#f43f5e', opacity: 0.8 }}>[SYSTEM] Weights & buffers cleared. Manual override required.</p>
        <button className="sf-btn" style={{ background: '#fff', color: '#000', marginTop: '2rem' }} onClick={() => window.location.reload()}>Re-Initialize</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {report.isLockdown && (
        <div style={{ 
          background: 'linear-gradient(135deg, #be123c 0%, #881337 100%)', 
          padding: '2.5rem', 
          borderRadius: '1.25rem', 
          border: '2px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          boxShadow: '0 15px 40px -10px rgba(159, 18, 57, 0.6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))', backgroundSize: '100% 4px, 3px 100%', pointerEvents: 'none' }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 1 }}>
             <div className="crt-flicker" style={{ 
               width: '72px', 
               height: '72px', 
               background: 'rgba(255, 255, 255, 0.15)', 
               backdropFilter: 'blur(4px)',
               borderRadius: '1rem', 
               color: '#fff', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               fontSize: '2.5rem',
               fontWeight: 900,
               border: '1px solid rgba(255, 255, 255, 0.3)'
             }}>!</div>
             <div>
                <h2 className="crt-flicker" style={{ 
                  margin: 0, 
                  fontSize: '3rem', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.15em',
                  lineHeight: 1
                }}>Lockdown</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'flicker 0.5s infinite' }}></div>
                  <p className="mono" style={{ margin: 0, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', opacity: 0.9, letterSpacing: '0.1em' }}>Forensic Breach Protocol Active</p>
                </div>
             </div>
          </div>
          <button className="sf-btn" style={{ background: '#fff', color: '#881337', position: 'relative', zIndex: 1, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }} onClick={handleSuspend}>
            Emergency Kill
          </button>
        </div>
      )}

      {report.isLockdown && report.lockdownArtifact && (
        <div className="sf-card" style={{ border: '2px solid var(--rose-deep)', background: 'rgba(5, 0, 0, 0.9)', padding: '2.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, var(--rose-deep))' }}></div>
              <h3 className="mono" style={{ margin: 0, color: 'var(--rose)', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '12px', fontWeight: 900 }}>Forensic Artifact</h3>
              <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, var(--rose-deep))' }}></div>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>Violation Identity</span>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem', color: '#fff', lineHeight: 1.4 }}>{report.lockdownArtifact.violationSummary}</p>
                </div>
                
                <div style={{ background: '#fff', color: '#000', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="mono" style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.6 }}>Recommended Action</span>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {report.lockdownArtifact.recommendedCountermeasure}
                  </div>
                </div>
              </div>
              
              <div style={{ background: '#080000', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(244, 63, 94, 0.2)', position: 'relative' }}>
                <div className="mono" style={{ fontSize: '9px', color: 'var(--rose)', position: 'absolute', top: '0.75rem', right: '1rem', fontWeight: 900, opacity: 0.6 }}>LOG_TRACE_DUMP</div>
                <pre className="mono crt-flicker" style={{ 
                  color: '#10b981', 
                  fontSize: '11px', 
                  margin: 0, 
                  overflow: 'auto', 
                  maxHeight: '300px',
                  lineHeight: 1.6,
                  paddingTop: '1rem'
                }}>
                  {report.lockdownArtifact.logicTrace}
                </pre>
              </div>
           </div>
        </div>
      )}

      <div className="sf-grid-4">
        <div className="sf-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <h4 className="mono" style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>Integrity</h4>
          <div style={{ height: '140px', width: '100%', position: 'relative', minHeight: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={integrityData} cx="50%" cy="50%" innerRadius={45} outerRadius={55} dataKey="value" stroke="none">
                  <Cell fill={report.overallIntegrityScore > 70 ? '#10b981' : '#f43f5e'} />
                  <Cell fill="#1e293b" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.05em' }}>
              {report.overallIntegrityScore}%
            </div>
          </div>
        </div>

        <div className="sf-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <h4 className="mono" style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>Reasoning</h4>
          <div style={{ height: '140px', width: '100%', position: 'relative', minHeight: '140px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={reasoningData} cx="50%" cy="50%" innerRadius={45} outerRadius={55} dataKey="value" stroke="none">
                   <Cell fill={report.reasoningHealthScore > 70 ? '#06b6d4' : '#f59e0b'} />
                   <Cell fill="#1e293b" />
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.05em' }}>
              {report.reasoningHealthScore}%
            </div>
          </div>
        </div>

        <div className="sf-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <h4 className="mono" style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Compliance</h4>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: report.abLabsCompliance === 'Pass' ? '#10b981' : '#f43f5e', lineHeight: 1, marginBottom: '1rem' }}>{report.abLabsCompliance}</div>
          <p style={{ fontSize: '12px', opacity: 0.7, fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>{report.executiveSummary}</p>
        </div>

        <div className="sf-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <h4 className="mono" style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>Drift Profile</h4>
          <div style={{ height: '120px', width: '100%', minHeight: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData}>
                 <XAxis dataKey="name" hide />
                 <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
                 <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
               </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <h2 className="mono" style={{ margin: 0, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Forensic Log Journal</h2>
          <div style={{ height: '1px', flex: 1, background: 'var(--border)' }}></div>
          <div className="mono" style={{ fontSize: '10px', opacity: 0.5 }}>{report.results.length} ENTRIES FOUND</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {report.results.map((result, idx) => (
            <ResultCard key={idx} result={result} index={idx} isLockdown={report.isLockdown} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ResultCard: React.FC<{ result: AuditResult; index: number; isLockdown: boolean }> = ({ result, index, isLockdown }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="res-card" style={{ 
      borderColor: result.complianceStatus === 'Axiom Violation' ? '#f43f5e' : 'var(--border)',
      background: isOpen ? 'rgba(30, 41, 59, 0.4)' : 'rgba(15, 23, 42, 0.4)',
      transition: '0.2s'
    }}>
      <div className="res-header" onClick={() => setIsOpen(!isOpen)} style={{ padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="mono" style={{ 
            width: '40px', 
            height: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)', 
            borderRadius: '0.5rem', 
            fontWeight: 900,
            fontSize: '12px',
            color: result.complianceStatus === 'Axiom Violation' ? 'var(--rose)' : 'var(--text)'
          }}>
            {String(index + 1).padStart(2, '0')}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{result.logPreview}</div>
            <div className="mono" style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '0.05em' }}>
              TS_{result.timestamp.replace(/[:\-TZ]/g, '')} // HEALTH_CORE_{result.reasoningHealthScore}%
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className={`res-badge ${
            result.complianceStatus === 'Clean' ? 'badge-clean' : 
            result.complianceStatus === 'Axiom Violation' ? 'badge-violation' : 'badge-drift'
          }`}>
            {result.complianceStatus}
          </div>
          <div style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s', opacity: 0.4 }}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border)', animation: 'fadeIn 0.3s ease' }}>
          {result.findings.length === 0 ? (
            <div style={{ color: '#10b981', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="mono">
              <span style={{ fontSize: '1.25rem' }}>✓</span> NO_DRIFT_DETECTED_IN_THIS_PHASE
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {result.findings.map((f, fi) => (
                <div key={fi} style={{ borderLeft: '3px solid', borderColor: SEVERITY_COLORS[f.severity], paddingLeft: '2rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: '-6px', width: '9px', height: '9px', borderRadius: '50%', background: SEVERITY_COLORS[f.severity] }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                    <span className="mono" style={{ fontSize: '11px', background: SEVERITY_COLORS[f.severity], color: f.severity === 'Warning' ? '#000' : '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>
                      {f.severity.toUpperCase()}
                    </span>
                    <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem' }}>{f.driftType}</span>
                  </div>
                  <p style={{ margin: '0 0 1.5rem 0', opacity: 0.8, fontSize: '1rem', lineHeight: 1.6, maxWidth: '800px' }}>{f.description}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="mono" style={{ fontSize: '9px', color: 'var(--text-dim)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Forensic Evidence</div>
                      <code className="mono" style={{ fontSize: '11px', color: '#f43f5e', wordBreak: 'break-all' }}>{f.evidence}</code>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                       <div className="mono" style={{ fontSize: '9px', color: '#10b981', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Suggested Correction</div>
                       <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', lineHeight: 1.5 }}>{f.suggestedCorrection}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
