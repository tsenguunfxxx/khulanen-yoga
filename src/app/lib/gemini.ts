import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion } from "@/lib/quiz-types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctIndex: { type: Type.INTEGER },
        },
        required: ["question", "options", "correctIndex"],
      },
    },
  },
  required: ["summary", "quiz"],
};

export async function generateSummaryAndQuiz(
  title: string,
  content: string
): Promise<{ summary: string; quiz: QuizQuestion[] }> {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Article title: "${title}"\n\nArticle content:\n${content}\n\nWrite a concise summary (2-4 sentences) of this article in the same language as the article, then create 3 multiple-choice quiz questions (4 options each) that test understanding of it. correctIndex is the 0-based index of the correct option.`,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const parsed = JSON.parse(response.text ?? "{}") as {
    summary: string;
    quiz: { question: string; options: string[]; correctIndex: number }[];
  };

  return {
    summary: parsed.summary,
    quiz: parsed.quiz.map((q, i) => ({ id: `q${i + 1}`, ...q })),
  };
}
