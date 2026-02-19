
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
          <section className="sf-card" style={{ borderColor: isAuditing ? 'var(--cyan)' : 'var(--border)' }}>
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
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em' }}>
                Batch Log Ingress
              </h2>
            </div>

            <textarea
              value={logsInput}
              onChange={(e) => setLogsInput(e.target.value)}
              className="sf-textarea"
              placeholder='PASTE_JSON_BATCH_ARRAY_HERE...'
              readOnly={isAuditing}
            />

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="mono" style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                MODE: PHASE_2_FORENSIC_BATCH<br />
                ENGINE: PYTHON_DETERMINISTIC_V3
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {isAuditing && (
                  <div className="mono" style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--cyan)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} className="crt-flicker">
                      {auditStatus}
                    </div>
                    <div style={{ width: '120px', height: '2px', background: '#1e293b', marginTop: '4px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '40%',
                        background: 'var(--cyan)',
                        animation: 'loading-slide 1.5s infinite ease-in-out'
                      }}></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAudit}
                  disabled={isAuditing}
                  className={`sf-btn sf-btn-cyan ${isAuditing ? 'disabled' : ''}`}
                  style={{ opacity: isAuditing ? 0.5 : 1 }}
                >
                  {isAuditing ? 'Executing Trace...' : 'Run Forensic Audit'}
                </button>
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
            <h3 className="mono" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: '1.5rem' }}>System Parameters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Regex Scanning</span>
                <span style={{ color: '#10b981', fontWeight: 800 }}>DETERMINISTIC</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Safety Lockdown</span>
                <span style={{ color: report?.isLockdown ? '#f43f5e' : '#10b981', fontWeight: 800 }}>{report?.isLockdown ? 'TRIGGERED' : 'SECURE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }} className="mono">
                <span style={{ opacity: 0.6 }}>Process Killswitch</span>
                <span style={{ color: '#f43f5e', fontWeight: 800 }}>ARMED_L4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-slide {
          0% { left: -40%; }
          100% { left: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
};

export default App;
