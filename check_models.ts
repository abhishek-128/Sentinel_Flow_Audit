
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function listModels() {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API Key not found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // Only check models supported by generateContent
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; // actually need a minimal call or just list if possible.
        // However, the SDK doesn't expose listModels easily in the node client directly without correct admin setup sometimes.
        // Let's try to just infer from a simple generation test on a few likely candidates.

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro",
            "gemini-2.0-flash-exp"
        ];

        console.log("Checking model availability and speed (latency)...");

        for (const modelName of candidates) {
            process.stdout.write(`Testing ${modelName}: `);
            const start = Date.now();
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you there?");
                const response = await result.response;
                const text = response.text();
                const duration = Date.now() - start;
                console.log(`\u2705 AVAILABLE (${duration}ms)`);
            } catch (error: any) {
                if (error.message.includes("404") || error.message.includes("not found")) {
                    console.log(`\u274c NOT FOUND`);
                } else {
                    console.log(`\u274c ERROR: ${error.message.split('\n')[0]}`);
                }
            }
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
