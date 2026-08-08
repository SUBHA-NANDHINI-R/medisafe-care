import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Star, Store } from "lucide-react";
import { AppShell } from "@/components/medisave/AppShell";
import { StatusBadge } from "@/components/medisave/Badges";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/pharmacies/")({
  head: () => ({
    meta: [
      { title: "Verified Pharmacies | MediSave" },
      { name: "description", content: "Browse licence-verified pharmacies on MediSave, with ratings, locations and available affordable medicines." },
      { property: "og:title", content: "Verified Pharmacies — MediSave" },
      { property: "og:description", content: "Every pharmacy is licence-checked before listing medicines." },
    ],
  }),
  component: PharmacyDirectory,
});

function PharmacyDirectory() {
  const { t, tx } = useLang();
  const { pharmacies, medicines } = useStore();
  const verified = pharmacies.filter((p) => p.verificationStatus === "verified");

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold">{t("verifiedPharmacies")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tx(
            "Licence documents are reviewed by MediSave administrators and are never shown publicly.",
            "உரிம ஆவணங்கள் நிர்வாகிகளால் சரிபார்க்கப்படுகின்றன; பொதுவில் காட்டப்படாது.",
          )}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verified.map((p) => {
            const count = medicines.filter(
              (m) => m.pharmacyId === p.id && new Date(m.expiryDate).getTime() > Date.now(),
            ).length;
            return (
              <Link
                key={p.id}
                to="/pharmacies/$id"
                params={{ id: p.id }}
                className="card-lift rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary">
                    <Store className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">{p.pharmacyName}</h2>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" /> {p.city}, {p.state}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StatusBadge status={p.verificationStatus} />
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {p.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {count} {t("medicines")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}