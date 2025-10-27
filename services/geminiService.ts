import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { Ayah } from '../types';

// Initialize the Google Gemini API client.
// The API key is sourced from the `process.env.API_KEY` environment variable as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a success story using the Gemini API based on a project name and topic.
 * @param projectName - The name of the project for the story.
 * @param topic - Key points or a topic for the story.
 * @returns A promise that resolves to the generated story as a string.
 */
export const generateSuccessStory = async (projectName: string, topic:string): Promise<string> => {
    try {
        const prompt = `
            You are a professional storyteller for a non-profit organization called "Hilful Fuzul Social Foundation".
            Your task is to write a short, heartwarming, and engaging success story for one of our projects.

            Project Name: "${projectName}"

            Key points or topic to focus on: "${topic}"

            Instructions:
            1. Write a story of about 150-200 words.
            2. The tone should be positive, inspiring, and emotional.
            3. Highlight the impact of the project on an individual, family, or community.
            4. Make it feel personal and relatable.
            5. Conclude with a gentle call to action or a message of hope.
            6. Do not use markdown or any special formatting. Just plain text.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Extract text from the response as per the guidelines.
        return response.text;
    } catch (error) {
        console.error("Error generating success story with Gemini API:", error);
        // Provide a user-friendly error message.
        if (error instanceof Error) {
            return `An error occurred while generating the story: ${error.message}. Please check your API key and network connection.`;
        }
        return "An unknown error occurred while generating the story.";
    }
};


/**
 * Generates audio for a given Arabic verse using the Gemini Text-to-Speech API.
 * @param arabicText - The Arabic text of the Ayah to be converted to speech.
 * @returns A promise that resolves to the base64 encoded audio string.
 */
export const getAyahAudio = async (arabicText: string): Promise<string> => {
    try {
        const recitationPrompt = `Recite the following Ayah in a clear, melodious Quranic recitation (Tilawa) style, with proper Tajweed: ${arabicText}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: recitationPrompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        // Using 'Zephyr', a clear male voice suitable for recitation.
                        prebuiltVoiceConfig: { voiceName: 'Zephyr' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data was returned from the API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating audio with Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate audio: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating audio.");
    }
};