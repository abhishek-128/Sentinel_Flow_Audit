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

## 📟 Operating the CLI Forensic Agent (Step-by-Step)
For users who prefer the terminal or need to automate audits, follow these simple steps:

### **Step 1: Open your Terminal**
*   **Windows**: Press `Win + R`, type `cmd` or `powershell`, and hit Enter.
*   **Mac/Linux**: Open the **Terminal** app from your applications.

### **Step 2: Navigate to the Project**
Type the following command to enter the demo folder:
```bash
cd Sentinel-Demo
```

### **Step 3: Install Required Tools**
Only needs to be done once. This installs the "brains" of the auditor:
```bash
pip install -r requirements.txt
```

### **Step 4: Run your first Audit**
Choose one of the specialized commands below to start auditing data:

*   **To Audit the Mock Dataset (Easiest)**:
    ```bash
    python sentinel_agent.py --batch mock_logs.json --deterministic
    ```
    *(This runs a strict check on the provided test data to show you how a violation is detected.)*

*   **To Monitor a Live File**:
    ```bash
    python sentinel_agent.py --watch activity.log
    ```
    *(The auditor will stay open and "watch" the file, alerting you the moment a subversion occurs.)*

    > **💡 Windows Pro-Tip**: If you receive a "file is being used by another process" error while trying to update `activity.log`, use this command in a separate PowerShell window to append data:
    > ```powershell
    > '{"content": "your log data"}' | Out-File -FilePath activity.log -Append -Encoding utf8
    > ```

### **What happens next?**
1.  **Handshake**: You'll see `INITIALIZING AUDIT ENGINE`.
2.  **Report**: A clean table will appear showing which logs are `Clean` and which are `Violations`.
3.  **Lockdown**: If a major breach is found, a **Red Panel** will appear, and a file called `LOCKDOWN_TRACE.md` will be created automatically for your review.

---

## ⚙️ Configuration
Requires a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📦 Installation
```bash
# 1. Install Web Dependencies
npm install

# 2. Install CLI Agent Dependencies
pip install -r Sentinel-Demo/requirements.txt

# Start the dev server
npm run dev
```

---
**© 2026 AB LABS // SENTINEL FLOW AUDITOR PROTOCOL**
