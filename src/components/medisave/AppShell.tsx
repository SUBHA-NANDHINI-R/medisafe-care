import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}