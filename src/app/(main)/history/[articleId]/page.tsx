"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FileText, Sparkles, Trash2 } from "lucide-react";

import { ArticleContentDialog } from "@/components/article-content-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/use-articles";

export default function OneArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const router = useRouter();
  const { articles, isHydrated, removeArticle } = useArticles();
  const article = articles.find((a) => a.id === articleId);
  const [contentOpen, setContentOpen] = useState(false);

  const handleDelete = () => {
    if (!article) return;
    if (window.confirm("Энэ article-г устгах уу?")) {
      removeArticle(article.id);
      router.push("/history");
    }
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-4">
        <p className="text-muted-foreground">Article олдсонгүй.</p>
        <Button asChild>
          <Link href="/history">Article history руу буцах</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Article Quiz Generator
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="size-3.5" />
                Summarized content
              </div>
              {article.lastScore && (
                <Badge variant="secondary">
                  Сүүлийн дүн: {article.lastScore.correct}/{article.lastScore.total}
                </Badge>
              )}
            </div>
            <h3 className="text-base font-semibold">{article.title}</h3>
            <p className="text-sm text-muted-foreground">{article.summary}</p>
          </div>

          <div className="flex flex-col gap-1 border-t pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              Article Content
            </div>
            <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
              {article.content}
            </p>
            <button
              type="button"
              onClick={() => setContentOpen(true)}
              className="self-end text-xs font-medium text-primary hover:underline"
            >
              See more
            </button>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button asChild>
            <Link href={`/quiz/${article.id}`}>
              {article.lastScore ? "Дахин тест өгөх" : "Take a quiz"}
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <ArticleContentDialog
        title={article.title}
        content={article.content}
        open={contentOpen}
        onOpenChange={setContentOpen}
      />
    </div>
  );
}
