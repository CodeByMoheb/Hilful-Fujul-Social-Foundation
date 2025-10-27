
import { GoogleGenAI } from "@google/genai";

// The API key is sourced from the environment variable `process.env.API_KEY`.
// It is assumed to be pre-configured and available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateSuccessStory = async (projectName: string, topic: string): Promise<string> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a professional storyteller for a non-profit organization called "Hilful Fuzul Social Foundation". 
    Your task is to write a short, inspiring, and heartwarming success story for our blog and social media.

    Project Name: ${projectName}
    Key Topic/Points: ${topic}

    Please write a story of about 150-200 words. It should be emotionally engaging, highlight the positive impact of our work, and encourage readers to support our cause. Use a positive and hopeful tone.
    `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    // Using the recommended way to get text
    const text = response.text;
    if (text) {
        return text;
    } else {
        return "Could not generate a story. The model returned an empty response.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while generating the story. Please try again later.";
  }
};
