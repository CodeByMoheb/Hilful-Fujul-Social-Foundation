
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll log an error.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateSuccessStory = async (projectName: string, topic: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is not configured. Story generation is disabled.";
  }

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
