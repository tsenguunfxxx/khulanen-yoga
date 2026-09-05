import { NextResponse } from "next/server";
import { generateSummaryAndQuiz } from "@/app/lib/gemini";

export const POST = async (request: Request) => {
  const { title, content } = await request.json();

  if (!title || !content) {
    return NextResponse.json(
      { message: "title and content are required" },
      { status: 400 }
    );
  }

  try {
    const { summary, quiz } = await generateSummaryAndQuiz(title, content);
    return NextResponse.json({ summary, quiz });
  } catch (error) {
    console.error("Gemini generation failed", error);
    return NextResponse.json(
      { message: "Failed to generate quiz" },
      { status: 500 }
    );
  }
};
