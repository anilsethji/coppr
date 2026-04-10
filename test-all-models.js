import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.5-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
];

async function runTest() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const m of modelsToTry) {
        console.log(`\n--- Testing ${m} (v1) ---`);
        try {
            const model = genAI.getGenerativeModel({ model: m }, { apiVersion: 'v1' });
            const result = await model.generateContent("Hello, respond with SUCCESS");
            console.log(`[SUCCESS] ${m} responded:`, result.response.text());
            return; // Exit on first success
        } catch (e) {
            console.error(`[FAILED] ${m}:`, e.message || e);
        }
    }
    
    console.log("\nNo models reached generation. Checking v1beta...");
    for (const m of modelsToTry) {
        console.log(`\n--- Testing ${m} (v1beta) ---`);
        try {
            const model = genAI.getGenerativeModel({ model: m }, { apiVersion: 'v1beta' });
            const result = await model.generateContent("Hello, respond with SUCCESS");
            console.log(`[SUCCESS] ${m} responded:`, result.response.text());
            return;
        } catch (e) {
            console.error(`[FAILED] ${m}:`, e.message || e);
        }
    }
}

runTest();
