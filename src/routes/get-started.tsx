import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Check, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/medisave/AppShell";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get Started — Choose Your Role | MediSave" },
      { name: "description", content: "Join MediSave as a patient looking for affordable medicines or as a verified pharmacy owner." },
      { property: "og:title", content: "Get Started with MediSave" },
      { property: "og:description", content: "Choose whether you are a patient or a pharmacy owner." },
    ],
  }),
  component: GetStarted,
});

function GetStarted() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [role, setRole] = useState<"patient" | "pharmacy" | null>(null);

  const cards = [
    { key: "patient" as const, emoji: "👤", Icon: UserRound, title: t("patient"), desc: t("patientDesc") },
    { key: "pharmacy" as const, emoji: "🏥", Icon: Building2, title: t("pharmacyOwner"), desc: t("pharmacyOwnerDesc") },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">{t("whoAreYou")}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {t("selectRoleFirst")}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {cards.map((c) => {
            const active = role === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setRole(c.key)}
                aria-pressed={active}
                className={cn(
                  "card-lift relative rounded-3xl border-2 bg-card p-7 text-left transition-colors",
                  active ? "border-primary bg-accent/30" : "border-border",
                )}
              >
                {active && (
                  <span className="absolute top-4 right-4 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <span className="text-4xl" aria-hidden>{c.emoji}</span>
                <h2 className="mt-4 text-xl font-semibold">{c.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              if (!role) {
                toast.error(t("selectRoleFirst"));
                return;
              }
              navigate({ to: role === "patient" ? "/register/patient" : "/register/pharmacy" });
            }}
          >
            {t("continue")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </AppShell>
  );
}