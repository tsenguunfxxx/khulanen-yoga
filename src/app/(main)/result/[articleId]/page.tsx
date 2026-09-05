"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Sparkles, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/use-articles";

export default function SeeResultPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const { articles, isHydrated } = useArticles();
  const article = articles.find((a) => a.id === articleId);

  if (!isHydrated) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!article || !article.lastScore) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-4">
        <p className="text-muted-foreground">Дүн олдсонгүй.</p>
        <Button asChild>
          <Link href="/">Homescreen руу буцах</Link>
        </Button>
      </div>
    );
  }

  const { correct, total } = article.lastScore;
  const answers = article.lastAnswers ?? {};

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Quiz completed
          </CardTitle>
          <CardDescription>Let&apos;s see what you did</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm font-medium">
            Your score:{" "}
            <span className="text-base font-semibold">
              {correct} / {total}
            </span>
          </p>

          <ul className="flex flex-col gap-3">
            {article.quiz.map((q, index) => {
              const userIndex = answers[q.id];
              const isCorrect = userIndex === q.correctIndex;
              return (
                <li key={q.id} className="flex gap-2 text-sm">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <p className="font-medium">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-muted-foreground">
                      Your answer:{" "}
                      {userIndex !== undefined ? q.options[userIndex] : "—"}
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-600">
                        Correct: {q.options[q.correctIndex]}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline" asChild>
            <Link href={`/quiz/${article.id}`}>Restart quiz</Link>
          </Button>
          <Button asChild>
            <Link href={`/history/${article.id}`}>Save and leave</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
