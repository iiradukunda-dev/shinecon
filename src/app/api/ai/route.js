import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const { messages, context } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        content: `I'm currently running in limited mode. To unlock my full AI capabilities and allow me to answer complex questions, please add your \`GEMINI_API_KEY\` to the \`.env\` file.\n\nYou can get a free key from [Google AI Studio](https://aistudio.google.com/).`
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Format context for the system prompt
    const systemInstruction = `
      You are the SM Connect AI Assistant, a highly helpful, deeply knowledgeable, and spiritually uplifting assistant for "Shining Ministries". 
      Always maintain a polite, respectful, and slightly formal but warm tone. Use Christian greetings and blessings naturally but not excessively.
      
      Here is the real-time data for the current user and church:
      USER DATA:
      Name: ${context.user?.name}
      Email: ${context.user?.email}
      
      CHURCH CAMPAIGNS (Active):
      ${context.campaigns?.map(c => `- ${c.title} (Goal: ${c.goalAmount} RWF, Raised: ${c.raisedAmount} RWF)`).join('\n') || 'None'}
      
      UPCOMING EVENTS:
      ${context.events?.map(e => `- ${e.title} on ${new Date(e.date).toLocaleDateString()}`).join('\n') || 'None'}
      
      USER CONTRIBUTIONS:
      ${context.contributions?.map(c => `- ${c.amount} ${c.currency} on ${new Date(c.date).toLocaleDateString()} for ${c.type}`).join('\n') || 'None'}
      
      Use this context to accurately and concisely answer the user's questions. 
      Format your response beautifully using markdown (bolding key numbers and dates). Do NOT make up data that is not in the context.
    `;

    // Convert message history to Google GenAI format (requires 'user' and 'model' roles)
    const formattedHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: lastMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({
      content: response.text
    });

  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response. Check your API key and network connection.' },
      { status: 500 }
    );
  }
}
