import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Bookmark, MapPin, Package, ShieldCheck, User } from "lucide-react";
import { AppShell } from "@/components/medisave/AppShell";
import { Disclaimer } from "@/components/medisave/Disclaimer";
import { LanguageSwitcher } from "@/components/medisave/LanguageSwitcher";
import { MedicineCard } from "@/components/medisave/MedicineCard";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { discountPercent, getPharmacy, rupees } from "@/lib/medisave-data";
import { useListableMedicines, useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard | MediSave" },
      { name: "description", content: "Your MediSave dashboard: recommended affordable medicines, saved items, orders, reminders and profile settings." },
      { property: "og:title", content: "Patient Dashboard — MediSave" },
      { property: "og:description", content: "Affordable medicines near you, orders and AI follow-up reminders." },
    ],
  }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const { t, tx } = useLang();
  const { user, orders, saved, medicines, reminders } = useStore();
  const listable = useListableMedicines();

  const recommended = [...listable]
    .sort(
      (a, b) =>
        discountPercent(b.originalPrice, b.discountedPrice) -
        discountPercent(a.originalPrice, a.discountedPrice),
    )
    .slice(0, 4);
  const savedMeds = medicines.filter((m) => saved.includes(m.id));
  const myOrders = orders.filter((o) => !user || o.userId === user.id);
  const nearby = listable.filter((m) => getPharmacy(m.pharmacyId)?.city === "Chennai").slice(0, 4);
  const spent = myOrders.reduce((s, o) => s + o.totalPrice, 0);

  if (!user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold">{tx("Please sign in", "தயவுசெய்து உள்நுழையவும்")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tx("Your dashboard shows orders, saved medicines and reminders.", "உங்கள் டாஷ்போர்டில் ஆர்டர்கள், சேமித்த மருந்துகள் மற்றும் நினைவூட்டல்கள்.")}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild><Link to="/login">{t("login")}</Link></Button>
            <Button asChild variant="outline"><Link to="/get-started">{t("signup")}</Link></Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary">
              <User className="h-5 w-5 text-primary" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold">
                {tx("Hello", "வணக்கம்")}, {user.name}
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {user.email} {user.aadhaarMasked ? `· ${user.aadhaarMasked}` : ""}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </header>

        {user.aadhaarMasked && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
            <ShieldCheck className="h-4 w-4" /> {t("identityVerified")}
          </p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={t("orders")} value={`${myOrders.length}`} Icon={Package} />
          <Stat label={t("saved")} value={`${savedMeds.length}`} Icon={Bookmark} />
          <Stat label={t("reminders")} value={`${reminders.filter((r) => r.status === "active").length}`} Icon={Bell} />
          <Stat label={tx("Total spent", "மொத்த செலவு")} value={rupees(spent)} Icon={ShieldCheck} />
        </div>

        <Block title={t("recommended")}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommended.map((m) => <MedicineCard key={m.id} medicine={m} />)}
          </div>
        </Block>

        <Block
          title={t("nearYou")}
          subtitle={
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Chennai, Tamil Nadu
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {nearby.map((m) => <MedicineCard key={m.id} medicine={m} />)}
          </div>
        </Block>

        {savedMeds.length > 0 && (
          <Block title={t("saved")}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {savedMeds.map((m) => <MedicineCard key={m.id} medicine={m} />)}
            </div>
          </Block>
        )}

        <Block title={t("notifications")}>
          <ul className="space-y-2">
            {[
              tx("Your Metformin reservation is ready for collection at LifeLine Pharmacy.", "உங்கள் மெட்ஃபார்மின் முன்பதிவு LifeLine Pharmacy-யில் தயாராக உள்ளது."),
              tx("A medicine you saved is now 60% off.", "நீங்கள் சேமித்த மருந்து இப்போது 60% தள்ளுபடியில்."),
              tx("Set a follow-up reminder with MediSave AI.", "மெடிசேவ் AI மூலம் பின்தொடர்தல் நினைவூட்டலை அமைக்கவும்."),
            ].map((n) => (
              <li key={n} className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm">
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {n}
              </li>
            ))}
          </ul>
        </Block>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild><Link to="/medicines">{t("browse")}</Link></Button>
          <Button asChild variant="outline"><Link to="/ai">{t("aiFollowUp")}</Link></Button>
          <Button asChild variant="ghost"><Link to="/orders">{t("orders")}</Link></Button>
        </div>

        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Block({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}