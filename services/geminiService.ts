import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIResponse, FrameworkGuidance, FinalSolution, Answer, ComplexityScore, Framework, AISuggestedSolution } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env file.");
}
const genAI = new GoogleGenerativeAI(API_KEY);

const MAX_RETRIES = 3;

async function generateContentWithRetry(model: any, prompt: string) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error: any) {
      if (error.message.includes('503')) {
        retries++;
        if (retries >= MAX_RETRIES) {
          throw new Error(`The model is overloaded. Please try again later. Failed after ${MAX_RETRIES} retries.`);
        }
        const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
        console.warn(`Model is overloaded. Retrying in ${Math.round(delay / 1000)}s...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("generateContentWithRetry failed after all retries.");
}


export async function fetchSuggestions(problem: string, context: string): Promise<AIResponse> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const prompt = `
    Analyze the following business problem and provide a strategic framework for solving it.

    **Problem:**
    ${problem}

    **Context:**
    ${context}

    **Instructions:**
    1.  **Problem Analysis:** Briefly summarize the core issue and its underlying drivers.
    2.  **Strategic Goals:** Define 2-3 high-level strategic goals to address the problem.
    3.  **Recommended Frameworks:** Suggest 3-4 suitable strategic, analytical, or operational frameworks (e.g., SWOT Analysis, 5 Whys, Porter's Five Forces, PESTLE). For each framework, provide a brief (1-2 sentence) description of how it applies to this specific problem.

    **Output Format:**
    Provide your response as a valid JSON object only, without any surrounding text or markdown.
    The JSON object must follow this exact structure:
    {
      "problemAnalysis": "<string>",
      "strategicGoals": [
        "<string>",
        "<string>"
      ],
      "recommendedFrameworks": [
        {
          "id": "<string>",
          "name": "<string>",
          "description": "<string>"
        }
      ]
    }
  `;

  const result = await generateContentWithRetry(model, prompt);
  const response = await result.response;
  const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
      return JSON.parse(text) as AIResponse;
  } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Invalid JSON response from AI.");
  }
}

export async function fetchFrameworkGuidance(problem: string, context: string, framework: Framework): Promise<FrameworkGuidance> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const isFiveWhys = framework.name.toLowerCase().includes('5 whys');

  const prompt = isFiveWhys
    ? `
      You are an expert business analyst. Your task is to apply the "5 Whys" framework to a given problem.
      Start with the problem statement and drill down to the root cause by asking "Why?" five times.
      Each subsequent question must directly challenge the answer to the previous one.

      **Problem:**
      ${problem}

      **Context:**
      ${context}

      **Instructions:**
      - Generate exactly 5 sequential "Why?" questions.
      - The first question should rephrase the problem statement to start the analysis.
      - Create a concise title for this analysis session.
      - Write a short description of how the 5 Whys will uncover the root cause.

      **Output Format:**
      Provide your response as a valid JSON object only, without any surrounding text or markdown.
      The JSON object must follow this exact structure:
      {
        "title": "5 Whys Analysis: [Problem Summary]",
        "description": "<string>",
        "keyQuestions": [
          "Why is [the problem] happening?",
          "Why is [the reason from answer 1] occurring?",
          "Why is [the reason from answer 2] happening?",
          "Why is [the reason from answer 3] present?",
          "Why is [the reason from answer 4] the case?"
        ]
      }
    `
    : `
    Based on the problem and context, provide guidance for applying the "${framework.name}" framework.

    **Problem:**
    ${problem}

    **Context:**
    ${context}

    **Framework:**
    ${framework.name}

    **Instructions:**
    - Create a concise title for this analysis session.
    - Write a short description of how the framework will be applied to this specific problem.
    - Generate 5-7 key, open-ended questions that will guide the user's analysis. These questions should be specific to the problem and the selected framework.

    **Output Format:**
    Provide your response as a valid JSON object only, without any surrounding text or markdown.
    The JSON object must follow this exact structure:
    {
      "title": "<string>",
      "description": "<string>",
      "keyQuestions": [
        "<string>",
        "<string>"
      ]
    }
  `;

  const result = await generateContentWithRetry(model, prompt);
  const response = await result.response;
  const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    const parsedResponse = JSON.parse(text);
    // Augment the response with the framework object
    const guidance: FrameworkGuidance = {
      ...parsedResponse,
      framework: framework
    };
    return guidance;
  } catch (e) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error('Invalid JSON response from AI.');
  }
}

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

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const result = await generateContentWithRetry(model, prompt);
  const response = await result.response;
  const jsonString = response.text().replace(/```json|```/g, '').trim();
  const parsedResponse: FinalSolution = JSON.parse(jsonString);

  return {
    title: parsedResponse.title,
    summary: parsedResponse.summary,
    recommendations: parsedResponse.recommendations,
  };
};

export async function getComplexityScore(analysisText: string): Promise<ComplexityScore> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const prompt = `
    Analyze the following 5 Whys analysis text and score its complexity on three dimensions.
    The analysis is about a business problem.

    **5 Whys Analysis:**
    ${analysisText}

    **Instructions:**
    Based on the text, evaluate the following three dimensions on a scale from 1 to 5.
    1.  **Cause Ambiguity (Ambiguità causa):** How clear, specific, and actionable is the identified root cause?
        - 1: Very clear, specific, and directly addressable root cause.
        - 3: Moderately clear, but might require some further investigation.
        - 5: Very vague, abstract, or multi-faceted root cause, hard to tackle directly.
    2.  **Interconnections (Interconnessioni):** How many other teams, processes, or systems are impacted by or involved in the problem and its cause?
        - 1: The issue is isolated to a single team or process.
        - 3: The issue affects 2-3 teams or systems.
        - 5: The issue is highly systemic, impacting multiple departments, critical processes, or the entire organization.
    3.  **Business Impact (Impatto sul business):** How critical is the problem to the business's core objectives (financial, operational, reputational)?
        - 1: Low impact, minor inconvenience.
        - 3: Moderate impact, causing noticeable operational issues or moderate financial loss.
        - 5: High to critical impact, threatening core business operations, significant financial loss, or major reputational damage.

    Provide 2-3 concise, actionable, and strategic recommendations to address the problem based on its complexity.

    **Output Format:**
    Provide your response as a valid JSON object only, without any surrounding text or markdown.
    The JSON object must follow this exact structure:
    {
      "causeAmbiguity": {
        "score": <number>,
        "reasoning": "<string>"
      },
      "interconnections": {
        "score": <number>,
        "reasoning": "<string>"
      },
      "businessImpact": {
        "score": <number>,
        "reasoning": "<string>"
      },
      "strategicRecommendations": [
        "<string>",
        "<string>"
      ]
    }
  `;

  const result = await generateContentWithRetry(model, prompt);
  const response = await result.response;
  const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
      return JSON.parse(text) as ComplexityScore;
  } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Invalid JSON response from AI.");
  }
}

export async function fetchAISuggestedSolutions(problem: string, context: string, finalSolution: FinalSolution): Promise<AISuggestedSolution[]> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      Based on the problem, context, and the developed solution, generate three distinct, high-level strategic recommendations to take this solution to the next level.

      **Problem:**
      ${problem}

      **Context:**
      ${context}

      **Final Solution Summary:**
      ${finalSolution.summary}

      **Instructions:**
      For each of the three recommendations, provide the following:
      1.  **A clear, actionable title** for the strategic solution.
      2.  **A concise description** of the solution.
      3.  **A single, high-impact Key Performance Indicator (KPI)** to track its success.
      4.  **A critical alert or risk** to be aware of during implementation, along with a mitigation strategy.
      5.  **An inspiring quote** that aligns with the spirit of the solution.

      **Output Format:**
      Provide your response as a valid JSON object only, without any surrounding text or markdown.
      The JSON object must be an array of three objects, following this exact structure:
      [
        {
          "solutionTitle": "<string>",
          "solutionDescription": "<string>",
          "kpi": { "metric": "<string>", "target": "<string>" },
          "alert": { "risk": "<string>", "mitigation": "<string>" },
          "quote": { "text": "<string>", "author": "<string>" }
        }
      ]
    `;

    const result = await generateContentWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        return JSON.parse(text) as AISuggestedSolution[];
    } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        throw new Error("Invalid JSON response from AI.");
    }
}
