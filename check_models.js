
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Manually parse .env.local because dotenv might not be installed in dependencies if user only has dev dependencies or something
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const match = content.match(/VITE_GEMINI_API_KEY=(.*)/);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
    } catch (e) {
        console.error("Error reading .env.local", e);
    }
    return process.env.VITE_GEMINI_API_KEY;
}

async function listModels() {
    const apiKey = loadEnv();

    if (!apiKey) {
        console.error("API Key not found in .env.local");
        return;
    }

    console.log(`Using API Key: ${apiKey.substring(0, 8)}...`);

    const genAI = new GoogleGenerativeAI(apiKey);

    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro",
        "gemini-pro"
    ];

    console.log("Checking model availability and latency...");

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}: `);
        const start = Date.now();
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello.");
            const response = await result.response;
            await response.text();
            const duration = Date.now() - start;
            console.log(`\u2705 AVAILABLE (${duration}ms)`);
        } catch (error) {
            if (error.message.includes("404") || error.message.includes("not found")) {
                console.log(`\u274c NOT FOUND`);
            } else {
                console.log(`\u274c ERROR: ${error.message.split('\n')[0]}`);
            }
        }
    }
}

listModels();
