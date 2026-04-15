import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { description } = await request.json();

        if (!description) {
            return NextResponse.json({ error: 'Missing strategy description' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are a quantitative marketing expert for an Indian trading platform called Coppr.
        I am providing you a technical description of a trading bot/indicator.
        Please generate EXACTLY 20 unique testimonials/reviews from various fictional retail traders.
        Requirements:
        1. Mix of English and Hinglish (e.g., "Paisa vasool," "Ekdam sharp entries," "Simple logic but very effective").
        2. Testimonials should feel authentic, diverse in tone (some professional, some enthusiastic retail style).
        3. Testimonials must be based on the technical features mentioned in this description: "${description}"
        4. Include a 'name', 'location' (Indian cities/states), 'rating' (4-5 stars), and 'text' for each.
        5. Return ONLY a valid JSON array of objects (no markdown, no code blocks).

        Response Format:
        [
          { "n": "Name", "l": "Location", "r": 5, "t": "Testimonial text" },
          ...
        ]
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean the JSON response 
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        return NextResponse.json(parsed);

    } catch (e: any) {
        console.error('Testimonial Generation Error:', e.message || e);
        return NextResponse.json({ error: 'Failed to generate institutional narratives' }, { status: 500 });
    }
}
