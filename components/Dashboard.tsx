
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
          position: 'relative',
          background: '#020617',
          borderRadius: '1.5rem',
          border: '1px solid #9f1239',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Background FX */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(159, 18, 57, 0.15), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3, pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{
            background: 'linear-gradient(to right, #881337, #4c0519)',
            padding: '1.5rem 3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #9f1239'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '48px', height: '48px', background: '#fff', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#881337', fontSize: '1.5rem', fontWeight: 900
              }} className="crt-flicker">
                !
              </div>
              <div>
                <h2 className="mono" style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff' }}>
                  System Lockdown
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                  <div style={{ width: '6px', height: '6px', backgroundColor: '#fff', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                  <span className="mono" style={{ fontSize: '10px', color: '#fff', letterSpacing: '0.1em' }}>THREAT_LEVEL_CRITICAL // PROTOCOL_ZERO</span>
                </div>
              </div>
            </div>
            <button className="sf-btn"
              style={{
                background: '#fff', color: '#881337', fontWeight: 800, fontSize: '14px',
                padding: '0.75rem 1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              onClick={handleSuspend}
            >
              INITIATE KILL SWITCH
            </button>
          </div>

          {/* Content Grid */}
          <div className="sf-lockdown-grid">
            {/* Left Col: Analysis */}
            <div className="sf-lockdown-col-left">
              <div>
                <h3 className="mono" style={{
                  fontSize: '13px', color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span style={{ width: '12px', height: '1px', background: '#f43f5e' }}></span>
                  Forensic Analysis
                </h3>

                {report.lockdownArtifact && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                      <span className="mono" style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>VIOLATION IDENTITY</span>
                      <p className="sf-overflow-wrap" style={{ margin: 0, fontSize: '14px', fontWeight: 600, lineHeight: 1.4, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                        {report.lockdownArtifact.violationSummary}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {report.lockdownArtifact && (
                <div style={{ marginTop: '3rem' }}>
                  <span className="mono" style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>RECOMMENDED COUNTERMEASURE</span>
                  <div className="sf-overflow-wrap" style={{
                    padding: '1.25rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)',
                    borderRadius: '8px', color: '#fca5a5', fontSize: '14px', fontWeight: 500, lineHeight: 1.5
                  }}>
                    {report.lockdownArtifact.recommendedCountermeasure}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Trace */}
            <div className="sf-lockdown-col-right">
              <h3 className="mono" style={{
                fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.7rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <span style={{ width: '12px', height: '1px', background: '#64748b' }}></span>
                Logic Trace
              </h3>

              {report.lockdownArtifact && (
                <div style={{
                  background: '#0f172a', borderRadius: '12px', border: '1px solid #334155',
                  padding: '1.5rem', display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                  maxHeight: '400px'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', opacity: 0.5 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <pre className="mono sf-logic-trace" style={{
                      margin: 0, fontSize: '12px', color: '#10b981', overflow: 'auto',
                      fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.6,
                      whiteSpace: 'pre'
                    }}>
                      {report.lockdownArtifact.logicTrace}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="sf-metrics-grid">
        <div className="sf-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, padding: '1.5rem' }}>
          <h4 className="mono" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Integrity</h4>
          <div style={{ height: '140px', width: '100%', position: 'relative', minWidth: 0 }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={integrityData} cx="50%" cy="50%" innerRadius={45} outerRadius={55} dataKey="value" stroke="none">
                    <Cell fill={report.overallIntegrityScore > 70 ? '#10b981' : '#f43f5e'} />
                    <Cell fill="#1e293b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.05em' }}>
              {report.overallIntegrityScore}%
            </div>
          </div>
        </div>

        <div className="sf-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, padding: '1.5rem' }}>
          <h4 className="mono" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Reasoning</h4>
          <div style={{ height: '140px', width: '100%', position: 'relative', minWidth: 0 }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={reasoningData} cx="50%" cy="50%" innerRadius={45} outerRadius={55} dataKey="value" stroke="none">
                    <Cell fill={report.reasoningHealthScore > 70 ? '#06b6d4' : '#f59e0b'} />
                    <Cell fill="#1e293b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.05em' }}>
              {report.reasoningHealthScore}%
            </div>
          </div>
        </div>

        <div className="sf-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, padding: '1.5rem' }}>
          <h4 className="mono" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Drift Profile</h4>
          <div style={{ height: '110px', width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={barData}>
                <XAxis dataKey="name" hide />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px', fontFamily: '"Plus Jakarta Sans", monospace' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="sf-card sf-card-wide" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', minWidth: 0, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'left' }}>
              <h4 className="mono" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Compliance</h4>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: report.abLabsCompliance === 'Pass' ? '#10b981' : '#f43f5e', lineHeight: 1 }}>{report.abLabsCompliance}</div>
            </div>
            <div style={{ maxWidth: '600px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
              <p style={{ fontSize: '13px', opacity: 0.7, margin: 0, lineHeight: 1.6, textAlign: 'left' }}>{report.executiveSummary}</p>
            </div>
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
          <div className={`res-badge ${result.complianceStatus === 'Clean' ? 'badge-clean' :
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
                      <div className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Forensic Evidence</div>
                      <code className="mono" style={{ fontSize: '13px', color: '#f43f5e', wordBreak: 'break-all' }}>{f.evidence}</code>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                      <div className="mono" style={{ fontSize: '10px', color: '#10b981', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Suggested Correction</div>
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
