const { YoutubeTranscript } = require('./node_modules/youtube-transcript/dist/youtube-transcript.common.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function debug() {
    const url = "https://youtube.com/shorts/I29peidTQxU?si=dKDYfoPNEbenKhY5";
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        console.log("Normalizing...");
        const normalizedUrl = url.includes('/shorts/') 
            ? `https://www.youtube.com/watch?v=${url.split('/shorts/')[1].split(/[?&]/)[0]}` 
            : url;
        console.log("Normalized:", normalizedUrl);

        console.log("Fetching transcript...");
        const transcriptArray = await YoutubeTranscript.fetchTranscript(normalizedUrl);
        const transcriptRaw = transcriptArray.map(t => t.text).join(' ');
        console.log("Transcript extracted.");

        console.log("Running Gemini 2.5 Flash...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Analyze: ${transcriptRaw.substring(0, 1000)}`;
        const result = await model.generateContent(prompt);
        console.log("Gemini works.");
        
        console.log("Success.");
    } catch (e) {
        console.error("DEBUG FAILED:", e.message || e);
    }
}

debug();
