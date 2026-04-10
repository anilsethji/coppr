import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // The listModels method might not be directly on genAI in the SDK version.
        // Usually, you can check it via fetch if needed.
        // But let's try gemini-pro (the older name) or gemini-2.0-flash-exp
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-pro Response:", result.response.text());
    } catch (e) {
        console.error("gemini-pro Failed:", e.message || e);
    }
}

test();
