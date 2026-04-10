// Using global fetch

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
    
    try {
        const resp = await fetch(url);
        const json = await resp.json();
        console.log("Models:", JSON.stringify(json, null, 2));
    } catch (e) {
        console.error("List Models Failed:", e);
    }
}

listModels();
