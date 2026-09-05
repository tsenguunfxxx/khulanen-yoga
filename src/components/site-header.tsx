"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 justify-between">
      <Link href="/">
        <h1>Quiz app</h1>
      </Link>
      <UserButton />
    </header>
  );
}
