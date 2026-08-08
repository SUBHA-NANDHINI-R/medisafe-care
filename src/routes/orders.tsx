import { createFileRoute, Link } from "@tanstack/react-router";
import { PackageCheck } from "lucide-react";
import { AppShell } from "@/components/medisave/AppShell";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { getPharmacy, rupees } from "@/lib/medisave-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders | MediSave" },
      { name: "description", content: "Track medicines you reserved at verified pharmacies, with prices, quantities and collection status." },
      { property: "og:title", content: "My Orders — MediSave" },
      { property: "og:description", content: "Reservation status for your affordable medicine orders." },
    ],
  }),
  component: OrdersPage,
});

const statusStyles: Record<string, string> = {
  placed: "bg-secondary text-secondary-foreground",
  confirmed: "bg-trust/12 text-trust",
  ready: "bg-warning/25 text-warning-foreground",
  collected: "bg-success/12 text-success",
  cancelled: "bg-danger/12 text-danger",
};

function OrdersPage() {
  const { t, tx } = useLang();
  const { orders, medicines, user } = useStore();
  const mine = user ? orders.filter((o) => o.userId === user.id || user.role !== "patient") : orders;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold">{t("orders")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tx(
            "Orders are reservations collected at the pharmacy counter. Prescription medicines need a valid prescription at collection.",
            "ஆர்டர்கள் மருந்தக கவுண்டரில் பெறப்படும் முன்பதிவுகள். சீட்டு தேவையான மருந்துகளுக்கு சீட்டு அவசியம்.",
          )}
        </p>

        <div className="mt-8 space-y-3">
          {mine.length === 0 && (
            <p className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              {tx("No orders yet.", "இதுவரை ஆர்டர்கள் இல்லை.")}
            </p>
          )}
          {mine.map((o) => {
            const med = medicines.find((m) => m.id === o.medicineId);
            const ph = getPharmacy(o.pharmacyId);
            return (
              <div
                key={o.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary">
                    <PackageCheck className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{med?.medicineName ?? o.medicineId}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ph?.pharmacyName} · {tx("Qty", "அளவு")} {o.quantity} ·{" "}
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{rupees(o.totalPrice)}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[o.orderStatus]}`}>
                    {o.orderStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Button asChild variant="outline" className="mt-8">
          <Link to="/medicines">{t("browse")}</Link>
        </Button>
      </div>
    </AppShell>
  );
}