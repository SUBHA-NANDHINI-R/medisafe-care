import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, Package, ShieldAlert, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/medisave/AppShell";
import { ExpiryBadge, RxBadge, VerifiedBadge } from "@/components/medisave/Badges";
import { Disclaimer } from "@/components/medisave/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";
import {
  discountPercent,
  formatMonthYear,
  getPharmacy,
  rupees,
  shelfLifeLabel,
  shelfStatus,
} from "@/lib/medisave-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/medicines/$id")({
  head: () => ({
    meta: [
      { title: "Medicine Details | MediSave" },
      { name: "description", content: "Full medicine details: manufacturer, batch, manufacturing and expiry dates, shelf life, price and safety information." },
      { property: "og:title", content: "Medicine Details — MediSave" },
      { property: "og:description", content: "Check expiry, shelf life and prescription requirements before you buy." },
    ],
  }),
  component: MedicineDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Medicine not found</h1>
        <Button asChild className="mt-6">
          <Link to="/medicines">Back to marketplace</Link>
        </Button>
      </div>
    </AppShell>
  ),
});

function MedicineDetail() {
  const { id } = Route.useParams();
  const { t, lang, tx } = useLang();
  const { medicines, user, placeOrder } = useStore();
  const [qty, setQty] = useState(1);

  const medicine = medicines.find((m) => m.id === id);
  if (!medicine) throw notFound();
  const pharmacy = getPharmacy(medicine.pharmacyId);
  const off = discountPercent(medicine.originalPrice, medicine.discountedPrice);
  const status = shelfStatus(medicine.expiryDate);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <img
            src={medicine.image}
            alt={medicine.medicineName}
            className="h-72 w-full rounded-3xl object-cover sm:h-96"
          />

          <div className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold">{medicine.medicineName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {medicine.genericName} · {medicine.manufacturer} · {medicine.medicineType}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <VerifiedBadge />
              <ExpiryBadge expiryDate={medicine.expiryDate} />
              <RxBadge required={medicine.prescriptionRequired} />
            </div>

            {status === "expiring" && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-warning bg-warning/15 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-foreground" />
                <div className="text-sm text-warning-foreground">
                  <p className="font-semibold">
                    {tx("Short remaining shelf life", "குறுகிய கால அவகாசம்")} —{" "}
                    {t("expiryDate")}: {formatMonthYear(medicine.expiryDate)}
                  </p>
                  <p>{t("expiryWarning")}</p>
                </div>
              </div>
            )}

            {medicine.prescriptionRequired && (
              <div className="flex items-start gap-3 rounded-2xl border-2 border-danger/40 bg-danger/8 p-4 text-sm text-danger">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  <strong>{t("prescriptionRequired")}.</strong>{" "}
                  {tx(
                    "The pharmacy must verify a valid prescription at collection. MediSave cannot bypass this requirement.",
                    "பெறும்போது மருந்தகம் சரியான மருத்துவ சீட்டை சரிபார்க்க வேண்டும். இதை மெடிசேவ் தவிர்க்க முடியாது.",
                  )}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-bold text-primary">{rupees(medicine.discountedPrice)}</span>
                <span className="text-sm text-muted-foreground line-through">
                  {t("mrp")} {rupees(medicine.originalPrice)}
                </span>
                <span className="rounded-full bg-saving px-2.5 py-1 text-xs font-bold text-primary-foreground">
                  {off}% {t("off")}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Row label={t("batchNumber")} value={medicine.batchNumber} />
                <Row label={t("quantity")} value={`${medicine.quantity}`} />
                <Row label={t("mfgDate")} value={formatMonthYear(medicine.manufacturingDate)} />
                <Row label={t("expiryDate")} value={formatMonthYear(medicine.expiryDate)} highlight />
                <Row
                  label={t("shelfLife")}
                  value={shelfLifeLabel(medicine.expiryDate, lang)}
                />
                <Row label={t("prescriptionRequired")} value={medicine.prescriptionRequired ? t("yes") : t("no")} />
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={medicine.quantity}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(medicine.quantity, Number(e.target.value) || 1)))}
                  className="w-24"
                  aria-label={t("quantity")}
                />
                <Button
                  size="lg"
                  onClick={() => {
                    if (!user) {
                      toast.error(tx("Please log in to place an order.", "ஆர்டர் செய்ய உள்நுழையவும்."));
                      return;
                    }
                    placeOrder({
                      id: `ord-${Date.now()}`,
                      userId: user.id,
                      userName: user.name,
                      pharmacyId: medicine.pharmacyId,
                      medicineId: medicine.id,
                      quantity: qty,
                      totalPrice: qty * medicine.discountedPrice,
                      orderStatus: "placed",
                      createdAt: new Date().toISOString(),
                    });
                    toast.success(
                      tx("Reserved at the pharmacy. Carry your prescription if required.", "மருந்தகத்தில் முன்பதிவு செய்யப்பட்டது. தேவைப்பட்டால் சீட்டை எடுத்து வாருங்கள்."),
                    );
                  }}
                >
                  <Package className="h-4 w-4" /> {t("order")}
                </Button>
              </div>
            </div>

            {pharmacy && (
              <Link
                to="/pharmacies/$id"
                params={{ id: pharmacy.id }}
                className="card-lift flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Store className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{pharmacy.pharmacyName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {pharmacy.address}, {pharmacy.city} — {pharmacy.pincode}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">{t("description")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{medicine.description}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CalendarClock className="h-5 w-5 text-trust" /> {t("safetyInfo")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{medicine.safetyInfo}</p>
          </div>
        </section>

        <div className="mt-6">
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={highlight ? "font-semibold text-danger" : "font-medium"}>{value}</dd>
    </div>
  );
}