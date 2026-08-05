import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6L8xhMo8ZIzx-CUJ4auYvIRScVP9S0XioXZIBc7WcFUKQ' });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    });
    console.log(response.text);
  } catch (error) {
    console.error(error);
  }
}
run();
