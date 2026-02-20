import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AuditReport, CustomAxiom } from "../types";
import { SYSTEM_PROMPT } from "./prompts";

const MODEL_NAME = "gemini-2.0-flash";

export class GeminiService {
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calls Gemini directly (local dev only - VITE_GEMINI_API_KEY required in .env.local)
   */
  private async callDirect(
    logs: any[],
    isHighDeterminism: boolean,
    customAxioms: CustomAxiom[]
  ): Promise<AuditReport> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is missing from .env.local");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT + (isHighDeterminism ? "\nSTRICT VALIDATOR MODE: Total consistency required." : ""),
    });

    const prompt = `Perform a High-Precision Forensic Batch Audit.
Log Data:
${JSON.stringify(logs, null, 2)}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: isHighDeterminism ? 0 : 0.7,
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            overallIntegrityScore: { type: SchemaType.NUMBER },
            reasoningHealthScore: { type: SchemaType.NUMBER },
            totalLogsProcessed: { type: SchemaType.INTEGER },
            executiveSummary: { type: SchemaType.STRING },
            abLabsCompliance: { type: SchemaType.STRING, enum: ['Pass', 'Fail', 'Conditional'] },
            isLockdown: { type: SchemaType.BOOLEAN },
            lockdownArtifact: {
              type: SchemaType.OBJECT,
              properties: {
                violationSummary: { type: SchemaType.STRING },
                logicTrace: { type: SchemaType.STRING },
                recommendedCountermeasure: { type: SchemaType.STRING }
              },
              required: ['violationSummary', 'logicTrace', 'recommendedCountermeasure']
            },
            results: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  timestamp: { type: SchemaType.STRING },
                  logPreview: { type: SchemaType.STRING },
                  integrityScore: { type: SchemaType.NUMBER },
                  reasoningHealthScore: { type: SchemaType.NUMBER },
                  complianceStatus: { type: SchemaType.STRING, enum: ['Clean', 'Drift Detected', 'Axiom Violation'] },
                  findings: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        timestamp: { type: SchemaType.STRING },
                        driftType: { type: SchemaType.STRING, enum: ['Convenience Bias', 'Constraint Erosion', 'Safety Bypass', 'Hallucinated Logic', 'Constitutional Violation'] },
                        severity: { type: SchemaType.STRING, enum: ['Critical', 'Warning', 'Informational'] },
                        description: { type: SchemaType.STRING },
                        evidence: { type: SchemaType.STRING },
                        suggestedCorrection: { type: SchemaType.STRING },
                        axiomTriggered: { type: SchemaType.STRING },
                      },
                      required: ['timestamp', 'driftType', 'severity', 'description', 'evidence', 'suggestedCorrection']
                    }
                  }
                },
                required: ['timestamp', 'logPreview', 'integrityScore', 'reasoningHealthScore', 'complianceStatus', 'findings']
              }
            }
          },
          required: ['overallIntegrityScore', 'reasoningHealthScore', 'totalLogsProcessed', 'executiveSummary', 'abLabsCompliance', 'isLockdown', 'results']
        } as any
      }
    });

    const text = result.response.text();
    return JSON.parse(text) as AuditReport;
  }

  /**
   * Performs a forensic audit of a batch of logs.
   * In local dev: calls Gemini API directly.
   * In production (Netlify): calls the secure serverless proxy.
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
      // In local dev, call Gemini directly (no Netlify function server)
      if (import.meta.env.DEV) {
        onStatus?.(`[LOCAL] Calling Gemini API Directly...`);
        const report = await this.callDirect(logs, isHighDeterminism, customAxioms);
        onStatus?.("Validating Schema & Compiling Final Report...");
        return report;
      }

      // In production (Netlify), use the secure serverless proxy
      onStatus?.(`Executing Forensic Reasoning via Secure Proxy...`);
      const response = await fetch('/.netlify/functions/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs, isHighDeterminism, customAxioms, attempt }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
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
