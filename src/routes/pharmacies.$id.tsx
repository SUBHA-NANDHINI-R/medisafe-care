import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Star, Store } from "lucide-react";
import { AppShell } from "@/components/medisave/AppShell";
import { StatusBadge } from "@/components/medisave/Badges";
import { Disclaimer } from "@/components/medisave/Disclaimer";
import { MedicineCard } from "@/components/medisave/MedicineCard";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/pharmacies/$id")({
  head: () => ({
    meta: [
      { title: "Pharmacy Profile | MediSave" },
      { name: "description", content: "Verified pharmacy profile with address, contact details, ratings and currently listed affordable medicines." },
      { property: "og:title", content: "Pharmacy Profile — MediSave" },
      { property: "og:description", content: "See verification status, ratings and available medicines." },
    ],
  }),
  component: PharmacyProfile,
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Pharmacy not found</h1>
        <Button asChild className="mt-6">
          <Link to="/pharmacies">Back to pharmacies</Link>
        </Button>
      </div>
    </AppShell>
  ),
});

function PharmacyProfile() {
  const { id } = Route.useParams();
  const { t, tx } = useLang();
  const { pharmacies, medicines } = useStore();
  const pharmacy = pharmacies.find((p) => p.id === id);
  if (!pharmacy) throw notFound();

  const listings = medicines.filter(
    (m) => m.pharmacyId === pharmacy.id && new Date(m.expiryDate).getTime() > Date.now(),
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-3xl border border-border bg-card p-6 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary">
              <Store className="h-6 w-6 text-primary" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">{pharmacy.pharmacyName}</h1>
              <p className="truncate text-sm text-muted-foreground">
                {tx("Owner", "உரிமையாளர்")}: {pharmacy.ownerName}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={pharmacy.verificationStatus} />
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-warning text-warning" /> {pharmacy.rating.toFixed(1)}
            </span>
          </div>
        </header>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <InfoCard Icon={MapPin} label={t("address")} value={`${pharmacy.address}, ${pharmacy.city}, ${pharmacy.state} — ${pharmacy.pincode}`} />
          <InfoCard Icon={Phone} label={t("contactNumber")} value={pharmacy.contact} />
          <InfoCard Icon={Mail} label={t("email")} value={pharmacy.email} />
        </div>

        <p className="mt-4 rounded-xl border border-border bg-surface p-3 text-xs text-muted-foreground">
          {tx(
            "Verification documents for this pharmacy are stored securely and are visible only to MediSave administrators.",
            "இந்த மருந்தகத்தின் சரிபார்ப்பு ஆவணங்கள் பாதுகாப்பாக சேமிக்கப்பட்டு நிர்வாகிகளுக்கு மட்டுமே தெரியும்.",
          )}
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">{t("medicines")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {listings.map((m) => (
              <MedicineCard key={m.id} medicine={m} />
            ))}
          </div>
        </section>

        {pharmacy.reviews.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">{tx("Ratings & reviews", "மதிப்பீடுகள் & விமர்சனங்கள்")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {pharmacy.reviews.map((r) => (
                <div key={r.author} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{r.author}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-warning text-warning" /> {r.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}

function InfoCard({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" /> {label}
      </p>
      <p className="mt-1 text-sm font-medium break-words">{value}</p>
    </div>
  );
}