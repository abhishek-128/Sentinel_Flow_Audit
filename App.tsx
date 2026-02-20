
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Constitution } from './components/Constitution';
import { geminiService } from './services/geminiService';
import { generateMarkdownReport } from './utils/generateMarkdown';
import { AuditReport, CustomAxiom } from './types';
import { MOCK_LOGS } from './constants';

const App: React.FC = () => {
  const [logsInput, setLogsInput] = useState<string>(MOCK_LOGS);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStatus, setAuditStatus] = useState<string>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [auditRuntime, setAuditRuntime] = useState<number | null>(null);
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [isHighDeterminism, setIsHighDeterminism] = useState(false);
  const [auditMode, setAuditMode] = useState<'ANALYZER' | 'VALIDATOR' | null>(null);
  const [accountTier, setAccountTier] = useState<'FREE' | 'PRO'>('FREE');
  const [customAxioms, setCustomAxioms] = useState<CustomAxiom[]>([]);

  // Cycling status messages during audit to manage perceived latency
  useEffect(() => {
    let interval: any;
    if (isAuditing && auditStatus.includes("Executing Forensic Reasoning")) {
      const loadingStates = [
        "Analyzing Model Weights...",
        "Executing Python Forensics...",
        "Checking Axiom 01 Compliance...",
        "Verifying Deterministic Outputs...",
        "Validating Forensic Artifacts..."
      ];
      let i = 0;
      interval = setInterval(() => {
        setAuditStatus(loadingStates[i % loadingStates.length]);
        i++;
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAuditing, auditStatus]);

  const handleAudit = async () => {
    if (!logsInput.trim()) return;
    setIsAuditing(true);
    setAuditStatus('STARTING_AUDIT');
    setError(null);
    const startTime = Date.now();
    try {
      let parsedLogs;
      try {
        parsedLogs = JSON.parse(logsInput);
        if (!Array.isArray(parsedLogs)) {
          parsedLogs = [parsedLogs];
        }
      } catch (e) {
        throw new Error("Invalid JSON format. Audit requires a valid JSON array.");
      }

      const result = await geminiService.auditLogs(parsedLogs, (msg) => setAuditStatus(msg), 0, isHighDeterminism, customAxioms);
      setReport(result);
      setAuditRuntime((Date.now() - startTime) / 1000);
      setTokenCount(Math.ceil(logsInput.length / 4));
      setAuditMode(isHighDeterminism ? 'VALIDATOR' : 'ANALYZER');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Audit Handshake Failed.');
    } finally {
      setIsAuditing(false);
      setAuditStatus('IDLE');
    }
  };

  const handleReset = () => {
    window.scrollTo(0, 0);
    window.location.reload();
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const md = generateMarkdownReport(report);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SENTINEL_REPORT_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout isLockdown={report?.isLockdown} onReset={handleReset} accountTier={accountTier}>
      <div className="sf-main-grid">
        <div className="sf-main-col">
          <section className="sf-card" style={{
            borderColor: isAuditing ? 'var(--cyan)' : 'var(--border)',
            height: '550px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: isAuditing ? 'var(--cyan)' : 'rgba(6, 182, 212, 0.1)',
                color: isAuditing ? '#000' : '#06b6d4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: '0.3s'
              }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em' }}>
                  Batch Log Ingress
                </h2>
                <div
                  onClick={() => setIsHighDeterminism(!isHighDeterminism)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.4rem 0.8rem',
                    background: isHighDeterminism ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid',
                    borderColor: isHighDeterminism ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    transition: '0.3s',
                    minWidth: '175px',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: isHighDeterminism ? 'var(--cyan)' : '#64748b',
                    boxShadow: isHighDeterminism ? '0 0 10px var(--cyan)' : 'none'
                  }} />
                  <span className="mono" style={{ fontSize: '11px', fontWeight: 800, color: isHighDeterminism ? 'var(--cyan)' : '#64748b' }}>
                    {isHighDeterminism ? 'HIGH_DETERMINISM: ON' : 'HIGH_DETERMINISM: OFF'}
                  </span>
                </div>

                <div
                  onClick={() => setAccountTier(accountTier === 'FREE' ? 'PRO' : 'FREE')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.4rem 0.8rem',
                    background: accountTier === 'PRO' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid',
                    borderColor: accountTier === 'PRO' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    transition: '0.3s',
                    minWidth: '150px',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: accountTier === 'PRO' ? '#f59e0b' : '#64748b',
                    boxShadow: accountTier === 'PRO' ? '0 0 10px #f59e0b' : 'none'
                  }} />
                  <span className="mono" style={{ fontSize: '11px', fontWeight: 800, color: accountTier === 'PRO' ? '#f59e0b' : '#64748b' }}>
                    {accountTier === 'PRO' ? 'DEV_MODE: PRO_TIER' : 'DEV_MODE: FREE_TIER'}
                  </span>
                </div>
              </div>
            </div>

            <textarea
              value={logsInput}
              onChange={(e) => setLogsInput(e.target.value)}
              className="sf-textarea"
              style={{ flex: 1, height: 'auto' }}
              placeholder='PASTE_JSON_BATCH_ARRAY_HERE...'
              readOnly={isAuditing}
              spellCheck="false"
            />

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="mono" style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                MODE: PHASE_2_FORENSIC_BATCH<br />
                ENGINE: PYTHON_DETERMINISTIC_V3
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {isAuditing ? (
                  <div className="mono" style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--cyan)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="crt-flicker">
                      {auditStatus}
                    </div>
                    <div style={{ width: '120px', height: '2px', background: '#1e293b', marginTop: '4px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        animation: 'loading-slide 1.5s infinite ease-in-out'
                      }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setLogsInput('')}
                      className="sf-btn sf-btn-rose"
                      style={{ padding: '14px 20px' }}
                    >
                      Purge System
                    </button>
                    <button
                      onClick={handleAudit}
                      className="sf-btn sf-btn-cyan"
                      style={{ width: '250px', justifyContent: 'center' }}
                    >
                      Execute Protocol
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          {error && (
            <div style={{ padding: '1.5rem', background: 'rgba(244, 63, 94, 0.1)', border: '2px solid #f43f5e', borderRadius: '1rem', color: '#f43f5e', display: 'flex', gap: '1rem' }}>
              <div style={{ fontWeight: 900 }}>[ERROR]</div>
              <div className="mono" style={{ fontSize: '12px' }}>{error}</div>
            </div>
          )}

          {report && (
            <div style={{ animation: 'fadeIn 1s ease' }}>
              <Dashboard report={report} />
            </div>
          )}
        </div>

        <div className="sf-side-col">
          <Constitution
            isLockdown={report?.isLockdown}
            accountTier={accountTier}
            customAxioms={customAxioms}
            onAddAxiom={(axiom) => setCustomAxioms([...customAxioms, axiom])}
            onRemoveAxiom={(id) => setCustomAxioms(customAxioms.filter(a => a.id !== id))}
          />
          <div className="sf-card" style={{ padding: '1.5rem' }}>
            <h3 className="mono" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: '1.5rem' }}>System Parameters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Regex Scanning</span>
                <span style={{ color: '#10b981', fontWeight: 800 }}>DETERMINISTIC</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Safety Lockdown</span>
                <span style={{ color: report?.isLockdown ? '#f43f5e' : '#10b981', fontWeight: 800 }}>{report?.isLockdown ? 'TRIGGERED' : 'SECURE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Process Killswitch</span>
                <span style={{ color: '#f43f5e', fontWeight: 800 }}>ARMED_L4</span>
              </div>
            </div>
          </div>

          <div className="sf-card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="mono" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', margin: 0 }}>Session Statistics</h3>
              {report && (
                <button
                  onClick={handleDownloadReport}
                  className="mono"
                  style={{
                    background: 'transparent',
                    border: '1px solid #334155',
                    color: 'var(--cyan)',
                    fontSize: '10px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: '0.2s'
                  }}
                >
                  <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Export
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Audit Runtime</span>
                <span style={{ fontWeight: 800 }}>{auditRuntime || '0.00'}s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Token Load</span>
                <span style={{ fontWeight: 800 }}>{tokenCount || '0'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Audit Mode</span>
                <span style={{ fontWeight: 800, color: 'var(--cyan)' }}>{auditMode || 'IDLE'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default App;
