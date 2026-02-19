
export interface LogEntry {
  timestamp: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  parameters?: Record<string, any>;
  metadata?: {
    reasoning?: string;
  };
}

export interface DriftEvent {
  timestamp: string;
  driftType: 'Convenience Bias' | 'Constraint Erosion' | 'Safety Bypass' | 'Hallucinated Logic' | 'Constitutional Violation';
  severity: 'Critical' | 'Warning' | 'Informational';
  description: string;
  evidence: string;
  suggestedCorrection: string;
  axiomTriggered?: string;
}

export interface AuditResult {
  timestamp: string;
  logPreview: string;
  integrityScore: number;
  reasoningHealthScore: number;
  findings: DriftEvent[];
  complianceStatus: 'Clean' | 'Drift Detected' | 'Axiom Violation';
}

export interface LockdownArtifact {
  violationSummary: string;
  logicTrace: string; // Forensic terminal output
  recommendedCountermeasure: string;
}

export interface AuditReport {
  overallIntegrityScore: number;
  reasoningHealthScore: number;
  totalLogsProcessed: number;
  results: AuditResult[];
  executiveSummary: string;
  abLabsCompliance: 'Pass' | 'Fail' | 'Conditional';
  isLockdown: boolean;
  lockdownArtifact?: LockdownArtifact;
}
