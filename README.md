# SENTINEL FLOW AUDITOR | Forensic Logic Suite 🛡️🧪

[![Engine: Gemini 1.5 Pro](https://img.shields.io/badge/Engine-Gemini%201.5%20Pro-blue?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Status: Operational](https://img.shields.io/badge/Status-Operational-06b6d4?style=for-the-badge)](https://github.com/abhishek-128/Sentinel_Flow_Audit)
[![Framework: React 19](https://img.shields.io/badge/Framework-React%2019-20232a?style=for-the-badge&logo=react)](https://react.dev/)

**SENTINEL FLOW AUDITOR** is a dual-engine forensic platform designed for high-density auditing and logical distillation of AI agent sessions. Developed for **AB Labs**, it bridges the gap between probabilistic AI reasoning and deterministic constitutional enforcement.

---

## 🏛️ System Architecture: The Two Pillars

The platform is split into two specialized modules, each governed by a core "Axiom" protocol.

### 🔵 Pillar 1: Sentinel Auditor (Axiom-01)
The primary "Forensic Firewall." It monitors live and batch log ingest for constitutional violations.
- **Axiom-01 (Data Boundaries)**: Hard-wired protection against IBANs, Passports, PII, and sensitive medical data.
- **High-Determinism Mode**: Leverages **Validator Mode** (Temperature 0.0) for strict, repeatable compliance checks.
- **Protocol Zero**: Automated system lockdown with CRT flicker alerts and "Logic Trace" generation upon critical breaches (Health < 10).

### 🟢 Pillar 2: Synaptic Distiller (Axiom-02)
The "Propositional Engine." It processes high-density documentation to extract a "Logical Skeleton."
- **Axiom-02 (Logical Integrity)**: Uses a custom C++ CDCL-inspired engine to identify and prune redundant clauses.
- **Neural Logic Stream**: Visualizes document propositions as a spatial graph, showing unique facts and their narrative flow.
- **SAT-Heuristics**: Employs **Subsumption Logic** and **Jaccard Similarity** to achieve 2000x compression ratios on technical manuals.

---

## 🚀 Key Features

### 🔍 Forensic Batch Auditing
Process legacy log arrays through the **Batch Log Ingress**. Detect "Soft Drift" (Bias/Lazy Logic) using thematic analysis or "Hard Violations" using sandboxed Python regex execution.

### 🧪 Neural Logic Mapping
Upload high-density PDFs (Manuals/Reports) to the **Synaptic Distiller**. The engine extracts "Atomic Propositions" and uses Conflict-Driven Clause Learning to ensure no two nodes represent the same logical rule.

### 💎 Sentinel PRO Features
- **Custom Axioms**: Define bespoke rules (e.g., "Project Apollo Confidentiality") in real-time.
- **Forensic Export**: Save detailed session audits as professional Markdown reports.
- **Universal Zero-Reset**: Click the "SD" or "SF" logos to perform a full forensic memory wipe and start a fresh session.

---

## 🛠️ Technical Implementation

### **The Synaptic Engine (C++)**
The heart of Axiom-02 is a high-performance logic core written in C++20.
- **Subsumption Path**: The core identifies if Rule A is a logical subset of Rule B. If $A \implies B$ and $A$ contains no unique delta, $A$ is pruned.
- **Cross-Service Binding**: Integrated via `pybind11` for seamless communication between the React frontend, Python middleware, and C++ logic tier.

### **The Sentinel Guard (Python/Gemini)**
- **Hybrid Reasoning**: Combines Google Gemini 1.5 Pro's contextual depth with a Deterministic Python Sandbox for regex verification.

---

## 📦 Installation & Setup

### **1. Web Dashboard**
```bash
# Install dependencies
npm install

# Configure environment
# Create .env.local with: VITE_GEMINI_API_KEY=your_key

# Start the Titan UI
npm run dev
```

### **2. Forensic CLI Agent**
```bash
# Install Python dependencies
pip install -r apps/sentinel/requirements.txt

# Run a batch audit
python apps/sentinel/sentinel_agent.py --batch logs.json --deterministic

# Watch a live file
python apps/sentinel/sentinel_agent.py --watch activity.log
```

---

## 📟 Step-by-Step Operating Guide

1.  **Handshake**: Feed JSON logs to the **Batch Log Ingress** or upload a PDF to the **Neural Logic Stream**.
2.  **Analysis**: Observe the real-time **Integrity Score** and **Compression Metrics**.
3.  **Wipe**: Click the top branding to reset session state instantly.
4.  **Export**: Save findings for executive review via the **Forensic Export** tool.

---
**© 2026 AB LABS // SENTINEL FLOW AUDITOR // AXIOM-01 & AXIOM-02**
