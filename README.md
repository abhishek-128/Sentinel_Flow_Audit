# SENTINEL FLOW AUDITOR | AB Labs 🛡️
[![Engine: Gemini 1.5 Pro](https://img.shields.io/badge/Engine-Gemini%201.5%20Pro-blue?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Status: Operational](https://img.shields.io/badge/Status-Operational-06b6d4?style=for-the-badge)](https://github.com/abhishek-128/Sentinel_Flow_Audit)
[![Framework: React 19](https://img.shields.io/badge/Framework-React%2019-20232a?style=for-the-badge&logo=react)](https://react.dev/)

**SENTINEL FLOW AUDITOR** is a high-precision forensic platform designed to monitor, detect, and neutralize logic drift and safety violations in AI agent sessions. Developed for **AB Labs**, it combines advanced LLM reasoning with deterministic Python code execution to ensure strict adherence to safety constitutions (Axioms).

---

## 🚀 Core Functionalities

### 1. Forensic Batch Auditing
Process large arrays of agent logs in a single handshake. The auditor evaluates each entry for integrity, reasoning health, and compliance.

### 2. High-Determinism Mode (Validator vs. Analyzer)
- **Analyzer Mode (Default)**: Leverages deep qualitative reasoning to detect subtle "soft drift" where agents might be exhibiting bias or lazy logic.
- **Validator Mode (Strict)**: Sets LLM temperature to `0.0` and forces a strict "Pass/Fail" protocol. In this mode, the system acts as a deterministic firewall where Python-detected regex matches trigger mandatory violations.

### 3. Axiom 01: Forensic Data Boundary
The system is hard-wired with **Axiom 01 (SENSITIVE_DATA_BOUNDARIES)**, preventing the unencrypted storage of:
- **Financial IDs**: IBANs and 16-digit Credit Card patterns.
- **National Identifiers**: Global Passport formats and SSNs.
- **PII**: Full home addresses and explicit medical keywords.

### 4. Interactive Metrics Dashboard
- **Integrity Score**: A real-time gauge of the agent's defensive posture.
- **Reasoning Health**: Monitors the "Chain of Thought" quality across the batch.
- **Drift Profile**: Visualizes data points like *Convenience Bias*, *Constraint Erosion*, and *Hallucinated Logic*.

### 5. System Lockdown & Killswitch
When a critical violation is detected (Health Score < 10), the system triggers **PROTOCOL ZERO**:
- **Visual Alert**: CRT flicker effects and red scanlines indicate a compromised state.
- **Lockdown Artifact**: Generates a terminal-style "Logic Trace" and recommends immediate architectural counter-measures (e.g., rotating keys, session purging).

---

## 🛠️ Technical Stack
- **Engine**: Google Gemini 1.5 Pro (via `@google/genai`).
- **Forensics**: Integrated Python Code Execution for regex verification.
- **Frontend**: React 19 + TypeScript.
- **Charts**: Recharts (High-performance SVG metrics).
- **Design**: "Plus Jakarta Sans" typography with a surgical dark-mode aesthetic (SaaS-grade).

---

## 📖 Operational Guide

### Running an Audit
1. Paste your JSON-formatted log array into the **Batch Log Ingress**.
2. Toggle **High Determinism** if you require mathematically consistent, repeatable results.
3. Click **Run Forensic Audit**.

### Reading Stats
- **Audit Runtime**: Real-time performance tracking of the reasoning engine.
- **Token Length**: Estimated context consumption of the forensic batch.
- **Audit Mode**: Displays the current logic state (VALIDATOR or ANALYZER).

### System Reset
Click the **"SF" Logo** in the top-left corner anytime to perform a "Full Forensic Wipe," clearing all current reports, logs, and statistics for a fresh session.

---

## ⚙️ Configuration
Requires a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📦 Installation
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build
```

---
**© 2026 AB LABS // SENTINEL FLOW AUDITOR PROTOCOL**
