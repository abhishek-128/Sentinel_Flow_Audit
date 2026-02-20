
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Constitution } from './components/Constitution';
import { geminiService } from './services/geminiService';
import { AuditReport } from './types';
import { MOCK_LOGS } from './constants';

const App: React.FC = () => {
  const [logsInput, setLogsInput] = useState<string>(MOCK_LOGS);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStatus, setAuditStatus] = useState<string>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [auditRuntime, setAuditRuntime] = useState<number | null>(null);
  const [tokenCount, setTokenCount] = useState<number | null>(null);

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

      const result = await geminiService.auditLogs(parsedLogs, (msg) => setAuditStatus(msg));
      setReport(result);
      setAuditRuntime((Date.now() - startTime) / 1000);
      setTokenCount(Math.ceil(logsInput.length / 4));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Audit Handshake Failed.');
    } finally {
      setIsAuditing(false);
      setAuditStatus('IDLE');
    }
  };

  return (
    <Layout isLockdown={report?.isLockdown}>
      <div className="sf-main-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <section className="sf-card" style={{
            borderColor: isAuditing ? 'var(--cyan)' : 'var(--border)',
            height: '488.2px',
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
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em' }}>
                Batch Log Ingress
              </h2>
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
              <div className="mono" style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
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
                    >
                      Clear Logs
                    </button>
                    <button
                      onClick={handleAudit}
                      className="sf-btn sf-btn-cyan"
                    >
                      Run Forensic Audit
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Constitution isLockdown={report?.isLockdown} />
          <div className="sf-card" style={{ padding: '1.5rem' }}>
            <h3 className="mono" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: '1.5rem' }}>System Parameters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Regex Scanning</span>
                <span style={{ color: '#10b981', fontWeight: 800 }}>DETERMINISTIC</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Safety Lockdown</span>
                <span style={{ color: report?.isLockdown ? '#f43f5e' : '#10b981', fontWeight: 800 }}>{report?.isLockdown ? 'TRIGGERED' : 'SECURE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Process Killswitch</span>
                <span style={{ color: '#f43f5e', fontWeight: 800 }}>ARMED_L4</span>
              </div>
            </div>
          </div>

          <div className="sf-card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
            <h3 className="mono" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: '1.5rem' }}>Session Statistics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Audit Runtime</span>
                <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>{auditRuntime ? `${auditRuntime.toFixed(2)}s` : '0.00s'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Token Length</span>
                <span style={{ color: 'var(--text)', fontWeight: 800 }}>{tokenCount ? tokenCount.toLocaleString() : '0'} TK</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Batch Density</span>
                <span style={{ color: 'var(--text)', fontWeight: 800 }}>{report ? report.results.length : 0} ENTRIES</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Model Version</span>
                <span style={{ color: 'var(--text)', fontWeight: 800 }}>GEMINI-1.5-PRO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Layout>
  );
};

export default App;
