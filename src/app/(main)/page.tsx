"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ArticleContentDialog } from "@/components/article-content-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useArticles } from "@/hooks/use-articles";
import type { QuizQuestion, StoredArticle } from "@/lib/quiz-types";
import { UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const router = useRouter();
  const { addArticle } = useArticles();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [article, setArticle] = useState<StoredArticle | null>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = title.trim().length > 0 && content.trim().length > 0;

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      if (!res.ok) throw new Error("request failed");
      const { summary, quiz } = (await res.json()) as {
        summary: string;
        quiz: QuizQuestion[];
      };

      const newArticle: StoredArticle = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        summary,
        quiz,
        createdAt: new Date().toISOString(),
      };
      addArticle(newArticle);
      setArticle(newArticle);
      toast.success("Тойм бэлэн боллоо");
    } catch {
      toast.error("Тойм үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleStartOver() {
    setArticle(null);
    setTitle("");
    setContent("");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Article Quiz Generator
          </CardTitle>
          <CardDescription>
            Paste your article below to generate a summarize and quiz question.
            Your articles will be saved in the sidebar for future reference.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Article Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your article..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">Article Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your article content here..."
              className="min-h-40"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            disabled={!canGenerate || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating && <Loader2 className="size-4 animate-spin" />}
            Generate summary
          </Button>
        </CardFooter>
      </Card>

      {article && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Article Quiz Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              Summarized content
            </div>
            <h3 className="text-base font-semibold">{article.title}</h3>
            <p className="text-sm text-muted-foreground">{article.summary}</p>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleStartOver}>
                Start over
              </Button>
              <Button
                variant="outline"
                onClick={() => setContentDialogOpen(true)}
              >
                See content
              </Button>
            </div>
            <Button onClick={() => router.push(`/quiz/${article.id}`)}>
              Take a quiz
            </Button>
          </CardFooter>
          <ArticleContentDialog
            title={article.title}
            content={article.content}
            open={contentDialogOpen}
            onOpenChange={setContentDialogOpen}
          />
        </Card>
      )}
    </div>
  );
}
