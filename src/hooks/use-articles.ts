"use client";

import { useCallback, useEffect, useState } from "react";

import type { StoredArticle } from "@/lib/quiz-types";

const STORAGE_KEY = "quiz-app:articles";

function readStorage(): StoredArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredArticle[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(articles: StoredArticle[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

export function useArticles() {
  const [articles, setArticles] = useState<StoredArticle[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setArticles(readStorage());
    setIsHydrated(true);
  }, []);

  const addArticle = useCallback((article: StoredArticle) => {
    setArticles((prev) => {
      const next = [article, ...prev];
      writeStorage(next);
      return next;
    });
  }, []);

  const recordScore = useCallback(
    (
      id: string,
      score: { correct: number; total: number },
      answers: Record<string, number>
    ) => {
      setArticles((prev) => {
        const next = prev.map((a) =>
          a.id === id ? { ...a, lastScore: score, lastAnswers: answers } : a
        );
        writeStorage(next);
        return next;
      });
    },
    []
  );

  const removeArticle = useCallback((id: string) => {
    setArticles((prev) => {
      const next = prev.filter((a) => a.id !== id);
      writeStorage(next);
      return next;
    });
  }, []);

  return { articles, isHydrated, addArticle, recordScore, removeArticle };
}
