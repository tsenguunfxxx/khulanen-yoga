export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export type StoredArticle = {
  id: string;
  title: string;
  content: string;
  summary: string;
  quiz: QuizQuestion[];
  createdAt: string;
  lastScore?: { correct: number; total: number };
  lastAnswers?: Record<string, number>;
};
