"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useArticles } from "@/hooks/use-articles";

export function AppSidebar() {
  const pathname = usePathname();
  const { articles, isHydrated } = useArticles();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <span className="px-2 text-sm font-medium group-data-[collapsible=icon]:hidden">
            History
          </span>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {!isHydrated ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))
              ) : articles.length === 0 ? (
                <p className="px-2 py-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden"></p>
              ) : (
                articles.map((article) => (
                  <SidebarMenuItem key={article.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/history/${article.id}`}
                      tooltip={article.title}
                    >
                      <Link href={`/history/${article.id}`}>
                        <span>{article.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
