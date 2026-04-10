const { YoutubeTranscript } = require('youtube-transcript');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testExtraction() {
    const url = "https://youtube.com/shorts/I29peidTQxU?si=dKDYfoPNEbenKhY5";
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log("Using API Key:", apiKey ? "Found" : "Missing");

    try {
        console.log(`[1] Extracting transcript for ${url}`);
        const transcriptArray = await YoutubeTranscript.fetchTranscript(url);
        const transcriptRaw = transcriptArray.map(t => t.text).join(' ');
        console.log(`[1] Transcript length: ${transcriptRaw.length} chars`);

        console.log(`[2] Running Gemini...`);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
        You are an elite quantitative trading architect specialized in Pine Script.
        I am providing you an auto-generated closed-caption transcript of a YouTube trading strategy video.
        Please analyze the transcript and return ONLY a JSON object (no markdown formatting, no code blocks) with the following structure:
        {
          "title": "A catchy, premium name for the strategy",
          "description": "A punchy 2-sentence summary of how it trades and its logic",
          "stopLoss": "The extracted SL % or rule",
          "takeProfit": "The extracted TP % or rule",
          "code": "The full syntactically correct Pine Script V5 code implementing the exact indicator crossovers, entries, and exits. Use strategy(), not indicator(). Include 'overlay=true'. Ensure there are no compilation errors."
        }

        Transcript Payload:
        "${transcriptRaw.substring(0, 35000)}"
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        console.log("[3] Gemini Response Text:");
        console.log(responseText);

        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        console.log(`[4] JSON Successfully parsed. Title: ${parsed.title}`);

    } catch (e) {
        console.error("Test Failed:", e.message || e);
    }
}

testExtraction();
