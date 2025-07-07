import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIResponse, FrameworkGuidance, FinalSolution, Answer } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env file.");
}
const genAI = new GoogleGenerativeAI(API_KEY);

export const fetchSuggestions = async (problem: string, context: string): Promise<AIResponse> => {
  if (!API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }
  
  const prompt = `
    Analyze the following problem and its context, then provide expert suggestions.

    **Problem:**
    ${problem}

    **Context:**
    ${context}

    **Instructions:**
    1.  Suggest 3-5 relevant problem-solving frameworks (e.g., "SWOT Analysis", "5 Whys", "McKinsey MECE Framework").
    2.  Define a high-level master strategy to approach the solution.
    3.  Formulate a clear, ambitious, and measurable final goal.

    Provide a response in JSON format with the following structure:
    {
      "suggestedFrameworks": ["Framework 1", "Framework 2", "Framework 3"],
      "masterStrategy": ["Key strategy point 1", "Key strategy point 2", "..."],
      "finalGoal": "Measurable final goal"
    }
  `;

  const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }).generateContent(prompt);
  const response = await result.response;
  const jsonString = response.text().replace(/```json|```/g, '').trim();
  const parsedResponse: AIResponse = JSON.parse(jsonString);
  
  return {
    suggestedFrameworks: parsedResponse.suggestedFrameworks,
    masterStrategy: parsedResponse.masterStrategy,
    finalGoal: parsedResponse.finalGoal,
  };
};

export const fetchFrameworkGuidance = async (problem: string, context:string, framework: string): Promise<FrameworkGuidance> => {
  if (!API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }

  const prompt = `
    Given the problem "${problem}" with context "${context}", provide a detailed guide for applying the "${framework}" framework.

    **Instructions:**
    1.  Briefly explain the core concept of the framework.
    2.  Provide a list of 3-5 key questions the user should answer to apply this framework.
    3.  Outline the expected outcomes or insights from using this framework.

    Provide a response in JSON format with the following structure:
    {
      "framework": "${framework}",
      "description": "Brief explanation of the framework.",
      "keyQuestions": ["Question 1?", "Question 2?", "Question 3?"],
      "expectedOutcomes": ["Outcome 1", "Outcome 2"]
    }
  `;

  const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }).generateContent(prompt);
  const response = await result.response;
  const jsonString = response.text().replace(/```json|```/g, '').trim();
  const parsedResponse: FrameworkGuidance = JSON.parse(jsonString);
  
  return {
    title: parsedResponse.title,
    description: parsedResponse.description,
    keyQuestions: parsedResponse.keyQuestions,
    actionSteps: parsedResponse.actionSteps,
    expectedOutcome: parsedResponse.expectedOutcome,
  };
};

export const fetchFinalSolution = async (problem: string, context: string, framework: string, answers: Answer[]): Promise<FinalSolution> => {
  if (!API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }

  const formattedAnswers = answers.map(a => `- ${a.question}\\n  - ${a.answer}`).join('\\n');

  const prompt = `
    Problem: "${problem}"
    Context: "${context}"
    Framework Used: "${framework}"
    User's Answers to Key Questions:
    ${formattedAnswers}

    **Instructions:**
    Based on the problem, context, and the user's answers within the chosen framework, generate a final, actionable solution. The solution should be a strategic roadmap.

    Provide a response in JSON format with the following structure:
    {
      "title": "Final Strategic Roadmap",
      "summary": "A brief summary of the proposed solution.",
      "recommendations": [
        {
          "title": "Action Step 1 Title",
          "details": "Detailed description of what to do in this step."
        },
        {
          "title": "Action Step 2 Title",
          "details": "Detailed description of what to do in this step."
        }
      ]
    }
  `;

  const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }).generateContent(prompt);
  const response = await result.response;
  const jsonString = response.text().replace(/```json|```/g, '').trim();
  const parsedResponse: FinalSolution = JSON.parse(jsonString);

  return {
    title: parsedResponse.title,
    summary: parsedResponse.summary,
    recommendations: parsedResponse.recommendations,
  };
};
