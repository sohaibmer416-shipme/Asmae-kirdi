
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult } from '../types';

export async function evaluateAnswer(
  userInput: string,
  actualAnswer: string,
  context: 'name' | 'classification' | 'role'
): Promise<EvaluationResult> {
  // Always create a new instance with the API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-flash-lite-latest for highest throughput and efficiency
  const modelName = 'gemini-flash-lite-latest';
  
  let systemInstruction = "";

  if (context === 'classification') {
    systemInstruction = `You are a hardware tutor. 
       The user says a category (Internal or External). 
       Target Category: "${actualAnswer}".
       User Voice Input: "${userInput}".
       Is it correct? Return JSON: { "correct": boolean, "reason": "Short explanation" }.`;
  } else if (context === 'name') {
    systemInstruction = `You are a hardware tutor.
       Correct Name: "${actualAnswer}".
       User Voice Input: "${userInput}".
       Check if they named the part correctly. Accept synonyms (e.g., "GPU" for "Graphics Card").
       Return JSON: { "correct": boolean, "reason": "Short explanation" }.`;
  } else if (context === 'role') {
    systemInstruction = `You are a hardware tutor.
       The user is describing the ROLE or FUNCTION of a PC component.
       Component: "${actualAnswer}".
       User Voice Input: "${userInput}".
       Check if their description accurately reflects what this component does in a computer.
       Be encouraging but ensure they mention the core function (e.g., for CPU: processing, brain; for PSU: power, electricity).
       Return JSON: { "correct": boolean, "reason": "Short explanation" }.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Evaluate the user's answer based on the hardware tutor instructions.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correct: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["correct", "reason"],
          propertyOrdering: ["correct", "reason"]
        }
      }
    });

    // Access the text property directly on the response object
    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Evaluation Error:", error);
    // Basic fallback logic if the API fails
    const cleanedInput = userInput.toLowerCase().trim();
    
    // For fallback, we check if they at least gave a substantial answer
    const isSubstantial = cleanedInput.split(' ').length >= 2;
    
    return { 
      correct: isSubstantial, 
      reason: isSubstantial ? "Processing input locally." : "Input too brief." 
    };
  }
}
