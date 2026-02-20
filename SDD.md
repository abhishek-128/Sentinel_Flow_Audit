# TECHNICAL SPECIFICATION DOCUMENT: SENTINEL FLOW AUDITOR
**Version**: 1.0.0 | **Author**: AB Labs Engineering | **Status**: PROD-READY

## 1. Executive Summary
The **Sentinel Flow Auditor** is a high-precision forensic platform designed to bridge the gap between "Black Box" AI reasoning and deterministic compliance enforcement. It provides a dual-interface solution (Web Dashboard & CLI Agent) for auditing AI session logs against a strict constitutional framework (Axiom 01).

---

## 2. Core Architecture

### 2.1 Technology Stack
- **Engine**: Google Gemini 1.5 Pro (via `@google/genai` & `google-generativeai`)
- **Reasoning Implementation**: `code_execution` (Python Sandbox) for regex validation.
- **Frontend**: React 19 + TypeScript + Vite.
- **CLI**: Python 3.12 + Rich (Terminal UI).
- **Visualization**: Recharts (SVG-based D3 wrapper).

### 2.2 Forensic Logic Engine
The system operates on a **Hybrid Reasoning Model**:
1.  **Qualitative Layer (LLM)**: Parses context, intent, and soft-drift (e.g., "Convenience Bias").
2.  **Deterministic Layer (Python)**: Executes sandboxed regex to mathematically verify the presence of restricted data patterns.

---

## 3. Detailed Feature Specifications

### 3.1 High-Determinism Mode (Audit Logic)
A toggleable state that alters the fundamental behavior of the reasoning engine.

| Feature | Analyzer Mode (Default) | Validator Mode (High Determinism) |
| :--- | :--- | :--- |
| **Temperature** | `0.7` | `0.0` (Fixed) |
| **Prompt Injection** | Standard Forensic Audit | `STRICT VALIDATOR MODE` instruction injected. |
| **Failure Condition** | Contextual logic drift. | **Any** regex match = `CRITICAL_VIOLATION`. |
| **Use Case** | Behavioral Analysis. | Compliance & CI/CD Gating. |

### 3.2 Axiom 01: Data Boundaries
The system is hard-wired to detect and reject the following patterns in `User Profile` fields:
-   **IBAN**: `r'[A-Z]{2}\d{2}[A-Z0-9]{11,30}'`
-   **Passport**: `r'\b[A-Z0-9]{6,9}\b'`
-   **Credit Cards**: `r'\b(?:\d{4}[-\s]?){3}\d{4}\b'`
-   **SSN**: `r'\b\d{3}-\d{2}-\d{4}\b'`

### 3.3 Protocol Zero: System Lockdown
**Trigger**: `ReasoningHealthScore < 10`
**System Response**:
1.  **UI State**: Applies global CRT flicker, scanlines, and Red/Black theme color shift.
2.  **Artifact Generation**:
    -   **Web**: Renders a "Logic Trace" modal with the Python output.
    -   **CLI**: Generates `LOCKDOWN_TRACE.md` file on disk.
3.  **Process Termination**: CLI exits with code `100` to break CI pipelines.

---

## 4. Component Architecture

### 4.1 Frontend (React)
-   **`App.tsx`**: Main controller. Manages `auditMode`, `report`, and global `isLockdown` state.
-   **`Layout.tsx`**: Responsive wrapper with `onReset` handler for the "SF" logo killswitch.
-   **`Dashboard.tsx`**: Renders the **Assessment Matrix**, **Drift Profile** (BarChart), and **Reasoning Health** (LineChart).
-   **`Constitution.tsx`**: Live display of the active Axiom ruleset.

### 4.2 Backend (Gemini Service)
-   **`geminiService.ts`**:
    -   **Dynamic Budgeting**: Calculates token load based on regex complexity.
    -   **Prompt Engineering**: Injects the `SYSTEM_PROMPT` containing the Axiom definitions.
    -   **Code Execution**: Configures the `tools: [{ codeExecution: {} }]` parameter.

### 4.3 CLI Agent (`sentinel_agent.py`)
-   **`SentinelAgent` Class**: Encapsulates the model connection and schema parsing.
-   **`audit_batch()`**: Handles the synchronous audit loop and JSON cleaning.
-   **`watch()`**: Implements file-tailing logic with error handling for Windows file locks.
-   **`Rich` Integration**: Renders determining status tables and error panels.

---

## 5. Deployment Procedures

### 5.1 Web Application
```bash
npm install
npm run dev
# Deploys to localhost:5173
```

### 5.2 CLI Forensic Agent
```bash
pip install -r Sentinel-Demo/requirements.txt
# Batch Mode
python sentinel_agent.py --batch mock_logs.json --deterministic
# Watch Mode
python sentinel_agent.py --watch activity.log
```

---

## 6. Future Roadmap
-   **v1.1**: Integration of "Axiom 02" (Tone & Brand Safety).
-   **v1.2**: Persistent SQLite storage for audit history.
-   **v2.0**: Multi-Agent "Red Teaming" (Attacker/Defender loop).
