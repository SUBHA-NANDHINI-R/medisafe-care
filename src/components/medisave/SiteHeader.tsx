import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Bot, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { Brand } from "./Brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t } = useLang();
  const { user, logout } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/", label: t("home") },
    { to: "/medicines", label: t("medicines") },
    { to: "/pharmacies", label: t("pharmacies") },
    { to: "/ai", label: t("aiFollowUp") },
    { to: "/orders", label: t("orders") },
  ] as const;

  const dashboardPath =
    user?.role === "pharmacy" ? "/pharmacy" : user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-6">
          <Brand />
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  pathname === l.to && "bg-secondary text-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="secondary" size="sm">
                <Link to={dashboardPath}>
                  <LayoutDashboard className="h-4 w-4" /> {t("dashboard")}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">{t("login")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/get-started">{t("signup")}</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <div className="mt-6 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                >
                  {t("dashboard")}
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                >
                  {t("admin")}
                </Link>
              </div>
              <div className="mt-6 space-y-3">
                <LanguageSwitcher />
                {user ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    {t("logout")}
                  </Button>
                ) : (
                  <div className="grid gap-2">
                    <Button asChild variant="outline">
                      <Link to="/login" onClick={() => setOpen(false)}>
                        {t("login")}
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link to="/get-started" onClick={() => setOpen(false)}>
                        {t("getStarted")}
                      </Link>
                    </Button>
                  </div>
                )}
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link to="/ai" onClick={() => setOpen(false)}>
                    <Bot className="h-4 w-4" /> {t("aiFollowUp")}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}