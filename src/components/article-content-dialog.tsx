"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ArticleContentDialog({
  title,
  content,
  open,
  onOpenChange,
}: {
  title: string;
  content: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm text-muted-foreground">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
