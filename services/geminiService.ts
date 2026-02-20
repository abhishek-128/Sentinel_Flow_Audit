
import { AuditReport, CustomAxiom } from "../types";

export class GeminiService {
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Performs a forensic audit of a batch of logs.
   * @param onStatus Callback to update UI with current engine phase
   */
  async auditLogs(
    logs: any[],
    onStatus?: (msg: string) => void,
    attempt: number = 0,
    isHighDeterminism: boolean = false,
    customAxioms: CustomAxiom[] = []
  ): Promise<AuditReport> {
    onStatus?.(`Initializing ${isHighDeterminism ? 'Deterministic Validator' : 'Analysis Handshake'}...`);

    try {
      onStatus?.(`Executing Forensic Reasoning via Secure Proxy...`);

      const response = await fetch('/.netlify/functions/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs,
          isHighDeterminism,
          customAxioms,
          attempt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      onStatus?.("Validating Schema & Compiling Final Report...");

      const report = await response.json();
      return report as AuditReport;
    } catch (error: any) {
      const errorMsg = error?.message || "";
      const isTransient =
        errorMsg.includes('503') ||
        errorMsg.includes('500') ||
        errorMsg.includes('overloaded') ||
        errorMsg.includes('high demand') ||
        errorMsg.includes('Service Unavailable');

      if (isTransient && attempt < 4) {
        const backoff = Math.pow(2, attempt) * 2000;
        onStatus?.(`Retrying Handshake (Attempt ${attempt + 1})...`);
        await this.delay(backoff);
        return this.auditLogs(logs, onStatus, attempt + 1, isHighDeterminism, customAxioms);
      }

      throw new Error(`Sentinel Audit Failed: ${errorMsg}`);
    }
  }
}

export const geminiService = new GeminiService();
