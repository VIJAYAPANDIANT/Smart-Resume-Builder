const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: 'c:/Smart Resume Builder/backend/.env' });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  try {
    const prompt = `Return a strict JSON format: { "message": "hello world" }`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    console.log("Success:", response.text);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
