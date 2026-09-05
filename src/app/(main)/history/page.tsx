"use client";

import Link from "next/link";
import { FileText, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/use-articles";

export default function ArticleHistoryPage() {
  const { articles, isHydrated, removeArticle } = useArticles();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Энэ article-г устгах уу?")) {
      removeArticle(id);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Article history</h1>
        <p className="text-sm text-muted-foreground">
          Өмнө нь үүсгэсэн article-ууд.
        </p>
      </div>

      {!isHydrated ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <FileText className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Хадгалагдсан article алга байна.{" "}
              <Link href="/" className="text-primary hover:underline">
                Нэгийг үүсгэх үү?
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/history/${article.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{article.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {article.lastScore && (
                        <Badge variant="secondary">
                          {article.lastScore.correct}/{article.lastScore.total}
                        </Badge>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDelete(e, article.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {article.summary}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
