
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { AuditReport } from "../types";

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
    isHighDeterminism: boolean = false
  ): Promise<AuditReport> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      throw new Error("Missing API Key. Please set VITE_GEMINI_API_KEY in .env.local");
    }
    const ai = new GoogleGenAI({ apiKey });

    // Force Pro model for High Determinism to ensure logic consistency
    const modelName = isHighDeterminism
      ? "gemini-3-pro-preview"
      : (attempt > 1 ? "gemini-3-flash-preview" : "gemini-3-pro-preview");

    // Inform UI of initial handshake
    onStatus?.(`Initializing ${isHighDeterminism ? 'Deterministic Validator' : 'Analysis Handshake'} with ${modelName}...`);

    try {
      /**
       * DYNAMIC BUDGET CALCULATION
       */
      const isPro = modelName.includes('pro');
      const maxAllowed = isPro ? 32768 : 24576;
      const forensicRuleComplexity = 6;
      const baseHandshakeLoad = isPro ? 12000 : 4000;
      const ruleSynthesisOverhead = forensicRuleComplexity * (isPro ? 1500 : 1000);
      const batchDataLoad = logs.length * (isPro ? 1200 : 800);
      const optimizedBudget = Math.min(maxAllowed, baseHandshakeLoad + ruleSynthesisOverhead + batchDataLoad);

      onStatus?.(`Executing ${isHighDeterminism ? 'Strict Deterministic' : 'Forensic'} Reasoning (${optimizedBudget} Budget)...`);

      const determinismInstruction = isHighDeterminism
        ? "\nSTRICT VALIDATOR MODE: If Python regex finds ANY PII match, the status MUST be 'Axiom Violation'. No qualitative reasoning. Total consistency is required."
        : "";

      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Perform a High-Precision Forensic Batch Audit. ${determinismInstruction}
        
        Using Python Code Execution, implement the following regex checks on the 'parameters' field of each log:
        - IBAN Detection
        - Global Passport Formats
        - UUID/GUID Patterns
        - SSN & 16-digit Credit Card Patterns
        
        Flag as 'Constitutional Violation' under Axiom 01 if found.
        Trigger isLockdown=true if any Reasoning Health Score falls below 10.
        
        Log Data:
        ${JSON.stringify(logs, null, 2)}`,
        config: {
          thinkingConfig: { thinkingBudget: optimizedBudget },
          responseMimeType: "application/json",
          systemInstruction: SYSTEM_PROMPT + determinismInstruction,
          temperature: isHighDeterminism ? 0 : 0.7,
          tools: [{ codeExecution: {} }],
          responseSchema: {
            // ... (same schema as before)
            type: Type.OBJECT,
            properties: {
              overallIntegrityScore: { type: Type.NUMBER },
              reasoningHealthScore: { type: Type.NUMBER },
              totalLogsProcessed: { type: Type.INTEGER },
              executiveSummary: { type: Type.STRING },
              abLabsCompliance: { type: Type.STRING, enum: ['Pass', 'Fail', 'Conditional'] },
              isLockdown: { type: Type.BOOLEAN },
              lockdownArtifact: {
                type: Type.OBJECT,
                properties: {
                  violationSummary: { type: Type.STRING },
                  logicTrace: { type: Type.STRING },
                  recommendedCountermeasure: { type: Type.STRING }
                },
                required: ['violationSummary', 'logicTrace', 'recommendedCountermeasure']
              },
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timestamp: { type: Type.STRING },
                    logPreview: { type: Type.STRING },
                    integrityScore: { type: Type.NUMBER },
                    reasoningHealthScore: { type: Type.NUMBER },
                    complianceStatus: { type: Type.STRING, enum: ['Clean', 'Drift Detected', 'Axiom Violation'] },
                    findings: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          timestamp: { type: Type.STRING },
                          driftType: { type: Type.STRING, enum: ['Convenience Bias', 'Constraint Erosion', 'Safety Bypass', 'Hallucinated Logic', 'Constitutional Violation'] },
                          severity: { type: Type.STRING, enum: ['Critical', 'Warning', 'Informational'] },
                          description: { type: Type.STRING },
                          evidence: { type: Type.STRING },
                          suggestedCorrection: { type: Type.STRING },
                          axiomTriggered: { type: Type.STRING },
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
          }
        }
      });

      onStatus?.("Validating Schema & Compiling Final Report...");

      const candidate = response.candidates?.[0];
      if (!candidate) throw new Error("No candidates in response");

      let result = "";
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) {
            result += part.text;
          }
        }
      }
      if (!result) throw new Error("Empty response from SENTINEL FLOW AUDITOR engine.");

      const cleanJson = result.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanJson) as AuditReport;
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
        return this.auditLogs(logs, onStatus, attempt + 1);
      }

      throw new Error(`Sentinel Audit Failed: ${errorMsg}`);
    }
  }
}

export const geminiService = new GeminiService();
