import { YoutubeTranscript } from './node_modules/youtube-transcript/dist/youtube-transcript.esm.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = "https://youtube.com/shorts/I29peidTQxU?si=dKDYfoPNEbenKhY5";

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Using API Key:", apiKey ? "Found" : "Missing");
    if (!apiKey) return;

    try {
        console.log(`[1] Normalizing and Extracting transcript for ${url}`);
        const normalizedUrl = url.includes('/shorts/') ? `https://www.youtube.com/watch?v=${url.split('/shorts/')[1].split(/[?&]/)[0]}` : url;
        const transcriptArray = await YoutubeTranscript.fetchTranscript(normalizedUrl);
        const transcriptRaw = transcriptArray.map(t => t.text).join(' ');
        console.log(`[1] Transcript length: ${transcriptRaw.length} chars`);

        console.log(`[2] Running Gemini 2.0 Flash-Lite (v1)...`);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }, { apiVersion: 'v1' });

        const prompt = `
        Analyze the following transcript and return ONLY a JSON object:
        {
          "title": "Strategy Name",
          "description": "Short summary",
          "code": "Pine Script V5 code"
        }

        Transcript:
        "${transcriptRaw.substring(0, 5000)}"
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("[3] Success! Title extracted:", JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim()).title);

    } catch (e) {
        console.error("Final Test Failed:", e.message || e);
    }
}

test();
