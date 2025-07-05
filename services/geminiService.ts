import { GoogleGenAI } from "@google/genai";
import type { AIResponse, FrameworkGuidance, FinalSolution, Answer } from '../types';

if (!process.env.API_KEY) {
  // In a real app, this might be handled more gracefully,
  // but for this context, failing fast is appropriate.
  console.error("API_KEY environment variable not set. Please set it to use the Gemini API.");
  // To prevent the app from crashing entirely on initial load, we will not throw here
  // but the API calls will fail. The UI will show an error message.
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Generic JSON parser with a validator
const parseJsonResponse = <T>(rawText: string, validator: (data: any) => data is T): T | null => {
  let jsonStr = rawText.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsedData = JSON.parse(jsonStr);
    if (validator(parsedData)) {
      return parsedData as T;
    }
    console.error("Parsed JSON does not match expected structure:", parsedData);
    return null;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Raw text:", rawText);
    return null;
  }
};

// Validator for the initial AIResponse
const isAIResponse = (data: any): data is AIResponse => {
    return (
        data &&
        'suggestedFrameworks' in data &&
        'masterStrategy' in data &&
        'finalGoal' in data &&
        Array.isArray(data.suggestedFrameworks) &&
        Array.isArray(data.masterStrategy) &&
        typeof data.finalGoal === 'string'
    );
};

// Validator for the FrameworkGuidance response
const isFrameworkGuidance = (data: any): data is FrameworkGuidance => {
    return (
        data &&
        'title' in data &&
        'description' in data &&
        'keyQuestions' in data &&
        'actionSteps' in data &&
        'expectedOutcome' in data &&
        typeof data.title === 'string' &&
        typeof data.description === 'string' &&
        Array.isArray(data.keyQuestions) &&
        Array.isArray(data.actionSteps) &&
        typeof data.expectedOutcome === 'string'
    );
};

// Validator for the FinalSolution response
const isFinalSolution = (data: any): data is FinalSolution => {
    return (
        data &&
        typeof data.title === 'string' &&
        typeof data.summary === 'string' &&
        Array.isArray(data.recommendations) &&
        data.recommendations.every((rec: any) => 
            typeof rec.title === 'string' && typeof rec.details === 'string'
        )
    );
};


export const fetchSuggestions = async (problem: string, context: string): Promise<AIResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }
  const prompt = `
    Problem: "${problem}"
    Context: "${context}"

    Based on the problem and context provided, generate a response in a valid JSON format.
    Do not include any text, comments, or markdown formatting outside of the JSON object.
    The "suggestedFrameworks" array should contain between 6 and 8 relevant frameworks.
    The "masterStrategy" array should contain 3 to 4 high-level strategic points.

    Example format:
    {
      "suggestedFrameworks": [
        "SWOT Analysis",
        "Root Cause Analysis",
        "Fishbone Diagram",
        "SCAMPER",
        "Cost-Benefit Analysis",
        "Hypothesis Testing"
      ],
      "masterStrategy": [
        "Challenge underlying assumptions about user behavior.",
        "Change perspective from 'retaining users' to 'delivering initial value'.",
        "Combine frameworks like Root Cause Analysis and Hypothesis Testing.",
        "Force prioritization on the highest impact onboarding improvements."
      ],
      "finalGoal": "Reduce first-month user churn by 30% within the next 3 months by revamping the onboarding experience."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });
    
    const text = response.text;
    const parsedData = parseJsonResponse(text, isAIResponse);

    if (!parsedData) {
      throw new Error("Failed to parse a valid response from the AI. The format might be incorrect.");
    }
    
    return parsedData;
  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    throw new Error("Could not get suggestions from the AI. Please check your API key and try again.");
  }
};

export const fetchFrameworkGuidance = async (problem: string, context: string, framework: string): Promise<FrameworkGuidance> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }
  const prompt = `
    Problem: "${problem}"
    Context: "${context}"
    Selected Framework: "${framework}"

    You are an expert business strategist. Your task is to provide a detailed, actionable guide on how to apply the selected framework to the given problem and context.
    
    Generate a response in a valid JSON format. Do not include any text, comments, or markdown formatting outside of the JSON object.

    The response should contain the following fields:
    - "title": A string with a concise title, like "Applying ${framework}".
    - "description": A string with a brief 1-2 sentence description of how this framework helps with the specific problem.
    - "keyQuestions": An array of 3-5 strings, each being a critical question to ask when using this framework.
    - "actionSteps": An array of 3-5 strings, each detailing a concrete step to take. These should be practical and sequential.
    - "expectedOutcome": A string describing the desired outcome of applying this framework successfully.

    Example JSON format:
    {
      "title": "Applying Root Cause Analysis",
      "description": "This framework will help us dig deeper than the surface-level symptom of churn and identify the fundamental reasons why customers are leaving after the first month.",
      "keyQuestions": [
        "What are all the potential reasons a customer might churn in the first month?",
        "Which of these reasons are within our control to influence?",
        "What data do we have or need to validate these potential causes?",
        "Are there different root causes for different customer segments?"
      ],
      "actionSteps": [
        "Brainstorm and map out all possible causes using a Fishbone Diagram.",
        "Analyze user activity data for patterns correlated with churn (e.g., feature usage, support tickets).",
        "Conduct targeted surveys or interviews with churned users to gather qualitative feedback.",
        "Prioritize the most likely root causes based on evidence and potential impact."
      ],
      "expectedOutcome": "A validated list of 2-3 primary root causes of early-stage churn, providing a clear focus for developing solutions."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const text = response.text;
    const parsedData = parseJsonResponse(text, isFrameworkGuidance);

    if (!parsedData) {
      throw new Error("Failed to parse a valid framework guidance response from the AI.");
    }

    return parsedData;
  } catch (error) {
    console.error("Error fetching framework guidance from Gemini API:", error);
    throw new Error("Could not get guidance from the AI. Please try again.");
  }
};


export const fetchFinalSolution = async (problem: string, context: string, framework: string, answers: Answer[]): Promise<FinalSolution> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }

  const qaString = answers.map(a => `Question: ${a.question}\nAnswer: ${a.answer}`).join('\n\n');

  const prompt = `
    You are a world-class business consultant providing a final, actionable solution.
    You have guided a business analyst through a problem-solving process. Now, using all the information gathered, provide a concrete plan.

    **Initial Problem:**
    ${problem}

    **Business Context:**
    ${context}

    **Framework Applied:**
    ${framework}

    **Analyst's Answers to Key Framework Questions:**
    ${qaString}

    ---

    Based on all the above information, generate a final solution in a valid JSON format.
    Do not include any text, comments, or markdown formatting outside of the JSON object.
    The solution should be practical, specific, and directly address the analyst's inputs.

    The JSON response must contain the following fields:
    - "title": A string for the title of the final solution, e.g., "Strategic Plan to Reduce Churn".
    - "summary": A string with a 2-3 sentence executive summary of the proposed solution.
    - "recommendations": An array of 2-4 objects, where each object represents a specific recommendation and has:
      - "title": A string for the title of the recommendation (e.g., "Revamp User Onboarding").
      - "details": A string providing specific, actionable details for implementing the recommendation.

    Example JSON format:
    {
      "title": "Action Plan to Reduce Early-Stage Churn",
      "summary": "Based on the Root Cause Analysis, the primary issue is a confusing user onboarding experience. This plan focuses on simplifying the UI, providing better guidance, and demonstrating value faster to new users.",
      "recommendations": [
        {
          "title": "Implement a 'Getting Started' Checklist",
          "details": "Create an in-app checklist that guides users through the 3 most critical setup steps. Visually reward users for completing each step to build momentum."
        },
        {
          "title": "Launch Proactive In-App Chat Support",
          "details": "Use a service like Intercom to proactively message users who seem stuck on a particular page for more than 60 seconds during their first session. Offer immediate help."
        },
        {
          "title": "Redesign the Initial Project Setup Flow",
          "details": "The current setup is too complex. A/B test a new, wizard-style setup flow that asks users one question at a time, pre-filling information where possible, to reduce cognitive load."
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const text = response.text;
    const parsedData = parseJsonResponse(text, isFinalSolution);

    if (!parsedData) {
      throw new Error("Failed to parse a valid final solution from the AI.");
    }

    return parsedData;

  } catch (error) {
    console.error("Error fetching final solution from Gemini API:", error);
    throw new Error("Could not get the final solution from the AI. Please try again.");
  }
};
