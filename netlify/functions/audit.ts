import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../../services/prompts";

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { logs, isHighDeterminism, customAxioms, attempt = 0 } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "GEMINI_API_KEY is not configured on Netlify." }),
            };
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Use gemini-1.5-flash for speed to avoid 10s Netlify timeout
        const modelName = "gemini-1.5-flash";
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPT + (isHighDeterminism ? "\nSTRICT VALIDATOR MODE: Total consistency required." : ""),
        });

        const prompt = `Perform a High-Precision Forensic Batch Audit.
      
      Using Python Code Execution, implement regex checks on the 'parameters' field for PII (IBAN, Passport, SSN).
      
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
                }
            },
            tools: [{ codeExecution: {} }] as any,
        });

        const text = result.response.text();

        return {
            statusCode: 200,
            body: text,
        };
    } catch (error: any) {
        console.error("Audit Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Internal server error during audit." }),
        };
    }
};
