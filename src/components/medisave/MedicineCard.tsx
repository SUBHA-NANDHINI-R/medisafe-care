import { Link } from "@tanstack/react-router";
import { Bookmark, CalendarClock, Store } from "lucide-react";
import { ExpiryBadge, RxBadge, VerifiedBadge } from "./Badges";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import {
  discountPercent,
  formatMonthYear,
  getPharmacy,
  rupees,
  shelfLifeLabel,
  type Medicine,
} from "@/lib/medisave-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { t, lang, tx } = useLang();
  const { saved, toggleSaved } = useStore();
  const pharmacy = getPharmacy(medicine.pharmacyId);
  const off = discountPercent(medicine.originalPrice, medicine.discountedPrice);
  const isSaved = saved.includes(medicine.id);

  return (
    <article className="card-lift flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative">
        <img
          src={medicine.image}
          alt={medicine.medicineName}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
        <span className="absolute top-3 left-3 rounded-full bg-saving px-2.5 py-1 text-xs font-bold text-primary-foreground shadow">
          {off}% {t("off")}
        </span>
        <button
          type="button"
          onClick={() => toggleSaved(medicine.id)}
          aria-label={t("save")}
          className="absolute top-3 right-3 rounded-full bg-card/90 p-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <Bookmark className={cn("h-4 w-4", isSaved && "fill-primary text-primary")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="truncate text-base font-semibold">{medicine.medicineName}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {medicine.genericName} · {medicine.manufacturer}
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <Store className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{pharmacy?.pharmacyName}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <VerifiedBadge />
          <ExpiryBadge expiryDate={medicine.expiryDate} />
        </div>

        <dl className="grid grid-cols-2 gap-1 rounded-xl bg-surface p-2.5 text-[11px]">
          <div>
            <dt className="text-muted-foreground">{tx("Mfg", "தயாரிப்பு")}</dt>
            <dd className="font-medium">{formatMonthYear(medicine.manufacturingDate)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{tx("Expiry", "காலாவதி")}</dt>
            <dd className="font-semibold text-danger">{formatMonthYear(medicine.expiryDate)}</dd>
          </div>
          <div className="col-span-2 flex items-center gap-1.5 pt-1 text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            {t("shelfLife")}: {shelfLifeLabel(medicine.expiryDate, lang)}
          </div>
        </dl>

        <RxBadge required={medicine.prescriptionRequired} />

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-xs text-muted-foreground line-through">
              {t("mrp")} {rupees(medicine.originalPrice)}
            </p>
            <p className="text-lg font-bold text-primary">{rupees(medicine.discountedPrice)}</p>
          </div>
          <Button asChild size="sm">
            <Link to="/medicines/$id" params={{ id: medicine.id }}>
              {t("viewDetails")}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}