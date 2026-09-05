"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/use-articles";

export default function TakeQuizPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const router = useRouter();
  const { articles, isHydrated, recordScore } = useArticles();
  const article = articles.find((a) => a.id === articleId);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  if (!isHydrated) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-4">
        <p className="text-muted-foreground">Article олдсонгүй.</p>
        <Button asChild>
          <Link href="/">Homescreen руу буцах</Link>
        </Button>
      </div>
    );
  }

  const question = article.quiz[step];
  const selected = answers[question.id];
  const isLast = step === article.quiz.length - 1;

  function handleNext() {
    if (!article) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    const correct = article.quiz.reduce(
      (total, q) => total + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    recordScore(article.id, { correct, total: article.quiz.length }, answers);
    router.push(`/result/${article.id}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Quick test
              </CardTitle>
              <CardDescription>
                Take a quick test about your knowledge from your content
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href={`/history/${article.id}`}>
                <X />
                <span className="sr-only">Cancel quiz</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-balance">
              {question.question}
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {step + 1} / {article.quiz.length}
            </span>
          </div>
          <RadioGroup
            value={selected?.toString()}
            onValueChange={(value) =>
              setAnswers((prev) => ({ ...prev, [question.id]: Number(value) }))
            }
            className="gap-3"
          >
            {question.options.map((option, index) => (
              <Label
                key={index}
                htmlFor={`${question.id}-${index}`}
                className="flex items-center gap-3 rounded-lg border p-3 has-data-checked:border-primary/30 has-data-checked:bg-primary/5"
              >
                <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
                {option}
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button disabled={selected === undefined} onClick={handleNext}>
            {isLast ? "Дуусгах" : "Дараах"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
