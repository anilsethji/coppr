import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Using API Key:", apiKey ? "Found" : "Missing");
    if (!apiKey) return;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, respond with 'Success'");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.error("Gemini Failed:", e.message || e);
    }
}

test();
