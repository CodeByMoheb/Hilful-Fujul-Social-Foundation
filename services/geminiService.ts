import { GoogleGenAI, Type } from "@google/genai";
import type { Ayah } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSurahDetails(surahName: string): Promise<Ayah[]> {
    const prompt = `
      Provide the full text of Surah "${surahName}" from the Quran.
      I need every single verse (ayah).
      For each verse, provide the original Arabic text and a simple Bangla translation.
      Return the result as a JSON array.
    `;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                verse: {
                    type: Type.INTEGER,
                    description: 'The verse number.',
                },
                arabic: {
                    type: Type.STRING,
                    description: 'The original Arabic text of the verse.',
                },
                bangla: {
                    type: Type.STRING,
                    description: 'The Bangla translation of the verse.',
                },
            },
            required: ['verse', 'arabic', 'bangla'],
            propertyOrdering: ["verse", "arabic", "bangla"],
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const surahData: Ayah[] = JSON.parse(jsonText);
        return surahData;
    } catch (error) {
        console.error("Error fetching Surah details with Gemini API:", error);
        throw new Error(`Failed to fetch details for Surah ${surahName}.`);
    }
}


export async function generateSuccessStory(projectName: string, topic: string): Promise<string> {
    const prompt = `
        Write a short, heartwarming success story for a charity organization's website.
        The story should be about the "${projectName}" project.
        Focus on the following key points or topic: "${topic}".
        Keep the story concise (around 150 words), uplifting, and suitable for a general audience.
        Do not use markdown formatting. Just return the plain text of the story.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating success story with Gemini API:", error);
        return "We're sorry, but we couldn't generate a story at this time. Please try again later.";
    }
}