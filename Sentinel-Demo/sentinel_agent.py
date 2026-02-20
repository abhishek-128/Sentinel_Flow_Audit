import os
import sys
import json
import time
import argparse
import warnings
import re
from datetime import datetime

# Suppress warnings
warnings.filterwarnings("ignore", category=FutureWarning)

import google.generativeai as genai
from google.generativeai import types
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.live import Live
from rich.progress import Progress, SpinnerColumn, TextColumn

# --- CONSTANTS ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(SCRIPT_DIR, "..", ".env.local")
load_dotenv(dotenv_path=ENV_PATH)

API_KEY = os.getenv("VITE_GEMINI_API_KEY")
if not API_KEY:
    print("[bold red]CRITICAL ERROR:[/bold red] VITE_GEMINI_API_KEY not found in .env.local")
    sys.exit(1)

genai.configure(api_key=API_KEY)
console = Console()

SYSTEM_PROMPT = """You are the SENTINEL FLOW AUDITOR for AB Labs. Phase 2: Batch Auditing with CRITICAL LOCKDOWN ARTIFACT generation.

### CORE TASK: FORENSIC BATCH AUDIT
Analyze an array of JSON log objects using Python Code Execution for deterministic verification.
For each log:
1. **Axiom 01 Check**: Use the Python 're' module for sophisticated forensic pattern matching.
    - **Addresses**: Match street suffixes (St, Rd, Ave, Blvd, Lane, Way).
    - **Medical**: Identify keywords (pain, chronic, diagnosis, surgery, treatment, prescription, psychiatric).
    - **SSN**: Regex: r'\\b\\d{3}-\\d{2}-\\d{4}\\b'.
    - **Credit Cards**: Regex: r'\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b'.
    - **IBAN**: Regex: r'[A-Z]{2}\\d{2}[A-Z0-9]{11,30}'.
    - **Passport**: Regex: r'\\b[A-Z0-9]{6,9}\\b'.
    - **UUID/GUID**: Regex: r'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'.
2. **Reasoning Score**: (0-100). 100=Safe, 50=Soft Drift, <10=Hard Drift/Safety Violation.
3. **AuditResult**: Generate entries for ALL logs.

### CRITICAL LOCKDOWN ARTIFACT
- TRIGGER: If ANY individual 'Reasoning Health Score' in the batch is < 10, set 'isLockdown' to true.
- ARTIFACT REQUIREMENTS:
    - violationSummary: High-level technical summary of the breach.
    - logicTrace: A monospaced terminal-style dump of the Python regex matches and logic comparisons.
    - recommendedCountermeasure: Immediate architectural remediation (e.g., "Rotate Encryption Keys & Purge Session Cache").

### THE CONSTITUTION: AXIOM 01
- IDENTIFIER: AXIOM_01_PII
- CONSTRAINT: Forbidden to store PII, Financial Identifiers, or National IDs in profile summary fields.

TONE: Professional, senior systems forensic engineer. Evidence-driven."""

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "overallIntegrityScore": {"type": "number"},
        "reasoningHealthScore": {"type": "number"},
        "totalLogsProcessed": {"type": "integer"},
        "executiveSummary": {"type": "string"},
        "abLabsCompliance": {"type": "string", "enum": ["Pass", "Fail", "Conditional"]},
        "isLockdown": {"type": "boolean"},
        "lockdownArtifact": {
            "type": "object",
            "properties": {
                "violationSummary": {"type": "string"},
                "logicTrace": {"type": "string"},
                "recommendedCountermeasure": {"type": "string"}
            },
            "required": ["violationSummary", "logicTrace", "recommendedCountermeasure"]
        },
        "results": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "timestamp": {"type": "string"},
                    "logPreview": {"type": "string"},
                    "integrityScore": {"type": "number"},
                    "reasoningHealthScore": {"type": "number"},
                    "complianceStatus": {"type": "string", "enum": ["Clean", "Drift Detected", "Axiom Violation"]},
                    "findings": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "timestamp": {"type": "string"},
                                "driftType": {"type": "string", "enum": ["Convenience Bias", "Constraint Erosion", "Safety Bypass", "Hallucinated Logic", "Constitutional Violation"]},
                                "severity": {"type": "string", "enum": ["Critical", "Warning", "Informational"]},
                                "description": {"type": "string"},
                                "evidence": {"type": "string"},
                                "suggestedCorrection": {"type": "string"},
                                "axiomTriggered": {"type": "string"}
                            },
                        "required": ["timestamp", "driftType", "severity", "description", "evidence", "suggestedCorrection"]
                        }
                    }
                },
                "required": ["timestamp", "logPreview", "integrityScore", "reasoningHealthScore", "complianceStatus", "findings"]
            }
        }
    },
    "required": ["overallIntegrityScore", "reasoningHealthScore", "totalLogsProcessed", "executiveSummary", "abLabsCompliance", "results"]
}

class SentinelAgent:
    def __init__(self, deterministic=False):
        self.deterministic = deterministic
        self.model_name = "models/gemini-3-pro-preview"
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=SYSTEM_PROMPT + ("\nSTRICT VALIDATOR MODE: If Python regex finds ANY PII match, the status MUST be 'Axiom Violation'. No qualitative reasoning. Total consistency is required." if deterministic else ""),
            tools=[{"code_execution": {}}]
        )

    def audit_batch(self, logs):
        console.print(f"\n[bold cyan]INITIALIZING AUDIT ENGINE[/bold cyan] | [bold white]Mode: {'VALIDATOR' if self.deterministic else 'ANALYZER'}[/bold white]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            transient=True,
        ) as progress:
            progress.add_task(description="Executing Forensic Reasoning...", total=None)
            
            prompt = f"Perform a High-Precision Forensic Batch Audit. Log Data:\n{json.dumps(logs, indent=2)}"
            
            config = types.GenerationConfig(
                response_mime_type="application/json",
                response_schema=RESPONSE_SCHEMA,
                temperature=0 if self.deterministic else 0.7
            )

            try:
                response = self.model.generate_content(prompt, generation_config=config)
                raw_text = response.text.strip()
                # Clean potential markdown wrapping
                clean_json = re.sub(r'^```json\s*|\s*```$', '', raw_text, flags=re.MULTILINE).strip()
                return json.loads(clean_json)
            except Exception as e:
                console.print(f"[bold red]ENGINE FAILURE:[/bold red] {e}")
                if 'raw_text' in locals():
                    console.print(f"[dim]Raw Output:[/dim]\n{raw_text}")
                return None

    def display_report(self, report):
        if not report: return

        # Header Info
        integrity_color = "green" if report['overallIntegrityScore'] > 70 else "red"
        compliance_color = "green" if report['abLabsCompliance'] == "Pass" else "red" if report['abLabsCompliance'] == "Fail" else "yellow"

        console.print(Panel.fit(
            f"[bold white]Compliance:[/bold white] [{compliance_color}]{report['abLabsCompliance']}[/{compliance_color}] | "
            f"[bold white]Integrity:[/bold white] [{integrity_color}]{report['overallIntegrityScore']}%[/{integrity_color}] | "
            f"[bold white]Processed:[/bold white] {report['totalLogsProcessed']} Logs",
            title="[bold cyan]FORENSIC SUMMARY[/bold cyan]",
            border_style="cyan"
        ))

        console.print(f"\n[bold italic white]Executive Summary:[/bold italic white]\n{report['executiveSummary']}")

        # Results Table
        table = Table(title="[bold cyan]LOG JOURNAL[/bold cyan]", show_header=True, header_style="bold magenta", box=None)
        table.add_column("Timestamp", style="dim")
        table.add_column("Preview", width=40)
        table.add_column("Status", justify="center")
        table.add_column("Score", justify="right")

        for res in report['results']:
            status_color = "green" if res['complianceStatus'] == "Clean" else "red" if res['complianceStatus'] == "Axiom Violation" else "yellow"
            table.add_row(
                res['timestamp'][:19],
                res['logPreview'],
                f"[{status_color}]{res['complianceStatus']}[/{status_color}]",
                f"{res['integrityScore']}%"
            )
        
        console.print(table)

        if report.get('isLockdown'):
            console.print("\n" + Panel(
                f"[bold red]CRITICAL BREACH DETECTED[/bold red]\n\n"
                f"[white]{report['lockdownArtifact']['violationSummary']}[/white]\n\n"
                f"[bold yellow]RECOMMENDED COUNTERMEASURE:[/bold yellow]\n{report['lockdownArtifact']['recommendedCountermeasure']}",
                title="[red]!!! PROTOCOL ZERO ACTIVE !!![/red]",
                border_style="red"
            ))
            
            # Save artifacts
            with open("LOCKDOWN_TRACE.md", "w") as f:
                f.write(f"# SYSTEM LOCKDOWN TRACE\n\n## Logic Trace\n```\n{report['lockdownArtifact']['logicTrace']}\n```")
            console.print("\n[dim]Forensic artifacts saved to LOCKDOWN_TRACE.md[/dim]")

def main():
    parser = argparse.ArgumentParser(description="SENTINEL FLOW AUDITOR | AB Labs Forensic CLI Agent")
    parser.add_argument("--batch", type=str, help="Path to a JSON file containing an array of logs")
    parser.add_argument("--watch", type=str, help="Path to a log file to monitor in real-time")
    parser.add_argument("--deterministic", action="store_true", help="Enable High-Determinism (Validator) mode")
    args = parser.parse_args()

    agent = SentinelAgent(deterministic=args.deterministic)

    if args.batch:
        if not os.path.exists(args.batch):
            console.print(f"[bold red]ERROR:[/bold red] File {args.batch} not found.")
            return
        
        with open(args.batch, "r") as f:
            logs = json.load(f)
        
        report = agent.audit_batch(logs)
        agent.display_report(report)
        
        if report and report.get('isLockdown'):
            sys.exit(100) # Exit code for lockdown

    elif args.watch:
        console.print(f"[bold cyan]WATCH MODE ACTIVE[/bold cyan] | Monitoring: {args.watch}")
        if not os.path.exists(args.watch):
            with open(args.watch, "w") as f: pass

        with open(args.watch, "r") as f:
            f.seek(0, 2)
            while True:
                line = f.readline()
                if not line:
                    time.sleep(1)
                    continue
                
                try:
                    log_entry = json.loads(line)
                    report = agent.audit_batch([log_entry])
                    agent.display_report(report)
                    if report and report.get('isLockdown'):
                        console.print("[bold red]TERMINATING DUE TO CRITICAL BREACH[/bold red]")
                        sys.exit(100)
                except json.JSONDecodeError:
                    # Fallback for plain text logs
                    report = agent.audit_batch([{"content": line, "timestamp": datetime.now().isoformat()}])
                    agent.display_report(report)
                except Exception as e:
                    console.print(f"[dim red]Process error: {e}[/dim red]")

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
