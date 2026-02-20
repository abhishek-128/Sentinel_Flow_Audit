import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
    {
        icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Forensic Batch Auditing',
        description: 'Process entire agent session logs in a single handshake. Every entry is evaluated for integrity, reasoning health, and constitutional compliance.'
    },
    {
        icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
        ),
        title: 'High-Determinism Mode',
        description: 'Switch between Analyzer (deep qualitative reasoning) and Validator (temperature 0.0, regex-enforced strict firewall) modes on demand.'
    },
    {
        icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        title: 'Protocol Zero Lockdown',
        description: 'When a reasoning health score drops below 10, the system triggers an automatic lockdown — generating a forensic logic trace and countermeasure recommendations.'
    },
    {
        icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        title: 'Axiom 01: PII Firewall',
        description: 'Hard-wired constitutional boundary enforcing zero-tolerance for PII, financial identifiers (IBAN, CC), national IDs (SSN, Passport), and medical data in agent outputs.'
    },
    {
        icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
        title: 'Live Drift Metrics',
        description: 'Real-time dashboard tracking Integrity Score, Reasoning Health, and Drift Profile — visualizing Convenience Bias, Constraint Erosion, and Hallucinated Logic patterns.'
    },
    {
        icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '28px', height: '28px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
        ),
        title: 'Professional Reporting',
        description: 'Export comprehensive forensic audits as structured Markdown files — ready for executive review, compliance archives, or incident response documentation.'
    }
];

const STATS = [
    { value: '01', label: 'Constitutional Axioms' },
    { value: '7+', label: 'PII Pattern Classes' },
    { value: '2', label: 'Audit Engine Modes' },
    { value: '<10', label: 'Lockdown Threshold (Health Score)' },
];

const PRO_FEATURES = [
    'Custom Constitutional Axioms',
    'Markdown Export & Reporting',
    'High-Determinism Validator Mode',
    'Unlimited Batch Size',
    'Priority Reasoning Engine',
];

const FREE_FEATURES = [
    'Forensic Batch Auditing',
    'Axiom 01 PII Firewall',
    'Protocol Zero Lockdown',
    'Drift Profile Dashboard',
];

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [tier, setTier] = useState<'FREE' | 'PRO'>('FREE');
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [error, setError] = useState('');

    const handleLaunch = () => {
        if (!apiKey.trim()) {
            setError('API key is required to initialize the engine.');
            return;
        }
        if (!apiKey.startsWith('AIza')) {
            setError('Invalid Gemini API key format. Keys begin with "AIza".');
            return;
        }
        setError('');
        navigate('/app', { state: { apiKey: apiKey.trim(), accountTier: tier } });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
            {/* Grid background */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
            }} />

            {/* Nav */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(6,182,212,0.1)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '36px', height: '36px', background: 'var(--cyan)', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ color: '#000', fontWeight: 900, fontSize: '14px', fontStyle: 'italic' }} className="mono">SF</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.15em', textTransform: 'uppercase' }} className="mono">
                        SENTINEL FLOW
                    </span>
                </div>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 700, letterSpacing: '0.2em' }}>
                    AB LABS // FORENSIC PROTOCOL v2.0
                </span>
            </nav>

            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* Hero */}
                <section style={{
                    minHeight: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    padding: '8rem 2rem 4rem',
                }}>
                    <div className="mono" style={{
                        fontSize: '11px', letterSpacing: '0.3em', color: 'var(--cyan)',
                        fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase',
                    }}>
                        ◆ AB Labs Classified Protocol ◆
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 900,
                        lineHeight: 1.05, marginBottom: '1.5rem', fontStyle: 'italic',
                        textTransform: 'uppercase', letterSpacing: '-0.03em',
                        background: 'linear-gradient(135deg, #fff 40%, var(--cyan) 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        SENTINEL<br />FLOW AUDITOR
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#94a3b8',
                        maxWidth: '600px', lineHeight: 1.7, marginBottom: '3rem',
                    }}>
                        High-precision forensic intelligence for AI agent compliance. Detect logic drift, enforce constitutional axioms, and trigger automatic lockdowns — in real time.
                    </p>

                    {/* Stat strip */}
                    <div style={{
                        display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center',
                        marginBottom: '3rem', background: 'rgba(6,182,212,0.05)',
                        border: '1px solid rgba(6,182,212,0.15)', borderRadius: '1rem', overflow: 'hidden',
                    }}>
                        {STATS.map((s, i) => (
                            <div key={i} style={{
                                padding: '1.5rem 2.5rem', textAlign: 'center',
                                borderRight: i < STATS.length - 1 ? '1px solid rgba(6,182,212,0.1)' : 'none',
                            }}>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--cyan)', fontStyle: 'italic' }} className="mono">{s.value}</div>
                                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }} className="mono">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <a href="#configure" style={{ textDecoration: 'none' }}>
                        <button className="sf-btn sf-btn-cyan" style={{ fontSize: '13px', padding: '14px 32px' }}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            Initialize Protocol
                        </button>
                    </a>
                </section>

                {/* Features */}
                <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--cyan)', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
                            System Capabilities
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            The Forensic Stack
                        </h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '1px',
                        background: 'rgba(6,182,212,0.1)',
                        border: '1px solid rgba(6,182,212,0.1)',
                        borderRadius: '1.5rem', overflow: 'hidden',
                    }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} style={{
                                padding: '2rem', background: 'var(--surface)',
                                transition: '0.3s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6,182,212,0.05)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
                            >
                                <div style={{ color: 'var(--cyan)', marginBottom: '1rem' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{f.title}</h3>
                                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>{f.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tier Selector + API Key */}
                <section id="configure" style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--cyan)', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
                            Step 1 of 2
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            Select Your Protocol Tier
                        </h2>
                    </div>

                    {/* Tier cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>
                        {(['FREE', 'PRO'] as const).map(t => {
                            const selected = tier === t;
                            const isPro = t === 'PRO';
                            const color = isPro ? '#f59e0b' : 'var(--cyan)';
                            return (
                                <div key={t} onClick={() => setTier(t)} style={{
                                    padding: '2rem', borderRadius: '1.25rem', cursor: 'pointer', transition: '0.3s',
                                    border: `2px solid ${selected ? color : 'rgba(255,255,255,0.08)'}`,
                                    background: selected ? (isPro ? 'rgba(245,158,11,0.08)' : 'rgba(6,182,212,0.08)') : 'var(--surface)',
                                    transform: selected ? 'translateY(-4px)' : 'none',
                                    boxShadow: selected ? `0 12px 40px ${isPro ? 'rgba(245,158,11,0.15)' : 'rgba(6,182,212,0.15)'}` : 'none',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div className="mono" style={{ fontSize: '11px', fontWeight: 700, color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                                {isPro ? '⭐ PRO TIER' : 'FREE TIER'}
                                            </div>
                                            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{isPro ? '$29/mo' : '$0'}</div>
                                        </div>
                                        <div style={{
                                            width: '20px', height: '20px', borderRadius: '50%',
                                            border: `2px solid ${selected ? color : '#334155'}`,
                                            background: selected ? color : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            {selected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000' }} />}
                                        </div>
                                    </div>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        {(isPro ? [...FREE_FEATURES, ...PRO_FEATURES] : FREE_FEATURES).map((f, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '13px', color: '#cbd5e1' }}>
                                                <span style={{ color, flexShrink: 0, fontWeight: 900 }}>✓</span> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* API Key */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'var(--cyan)', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
                                Step 2 of 2
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                                Authorize the Engine
                            </h2>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '0.5rem' }}>
                                Your key is never stored or transmitted outside your browser session.
                            </p>
                        </div>

                        <div style={{
                            background: 'var(--surface)', border: '1px solid rgba(6,182,212,0.2)',
                            borderRadius: '1.25rem', padding: '2rem',
                        }}>
                            <label className="mono" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                                Gemini API Key
                            </label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <input
                                        type={showKey ? 'text' : 'password'}
                                        value={apiKey}
                                        onChange={e => { setApiKey(e.target.value); setError(''); }}
                                        placeholder="AIzaSy..."
                                        className="mono sf-textarea"
                                        style={{
                                            width: '100%', padding: '0.85rem 3rem 0.85rem 1rem',
                                            fontSize: '13px', height: 'auto', borderRadius: '0.75rem',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    <button onClick={() => setShowKey(!showKey)} style={{
                                        position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                                        background: 'transparent', border: 'none', cursor: 'pointer',
                                        color: '#64748b', display: 'flex', alignItems: 'center',
                                    }}>
                                        {showKey
                                            ? <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            : <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        }
                                    </button>
                                </div>
                            </div>
                            {error && <p style={{ color: '#f43f5e', fontSize: '12px', marginTop: '0.75rem', fontWeight: 600 }}>{error}</p>}
                            <p style={{ fontSize: '12px', color: '#334155', marginTop: '0.75rem' }} className="mono">
                                Get a free key at{' '}
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>
                                    aistudio.google.com
                                </a>
                            </p>
                        </div>
                    </div>

                    <button onClick={handleLaunch} className="sf-btn sf-btn-cyan" style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '14px', fontWeight: 900, letterSpacing: '0.15em' }}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        INITIALIZE SENTINEL ENGINE
                    </button>
                </section>

                <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="mono" style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.2em' }}>
                        © 2026 AB LABS // SENTINEL FLOW AUDITOR PROTOCOL
                    </p>
                </footer>
            </div>
        </div>
    );
};
