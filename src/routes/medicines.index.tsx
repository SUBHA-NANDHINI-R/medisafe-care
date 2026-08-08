import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/medisave/AppShell";
import { Disclaimer } from "@/components/medisave/Disclaimer";
import { MedicineCard } from "@/components/medisave/MedicineCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLang } from "@/lib/i18n";
import { daysUntil, discountPercent, getPharmacy } from "@/lib/medisave-data";
import { useListableMedicines, useStore } from "@/lib/store";

type SearchParams = { q?: string };

export const Route = createFileRoute("/medicines/")({
  validateSearch: (search: Record<string, unknown>): SearchParams =>
    typeof search["q"] === "string" && search["q"] ? { q: search["q"] } : {},
  head: () => ({
    meta: [
      { title: "Browse Affordable Medicines | MediSave" },
      { name: "description", content: "Search and filter genuine medicines from verified pharmacies with clear expiry dates and large discounts." },
      { property: "og:title", content: "Browse Affordable Medicines — MediSave" },
      { property: "og:description", content: "Filter by price, discount, expiry, type and location." },
    ],
  }),
  component: Marketplace,
});

const TYPES = ["Tablet", "Capsule", "Syrup", "Cream", "Other"] as const;

function Marketplace() {
  const { t, tx } = useLang();
  const { q: initialQ } = Route.useSearch();
  const listable = useListableMedicines();
  const { pharmacies } = useStore();

  const [q, setQ] = useState(initialQ ?? "");
  const [maxPrice, setMaxPrice] = useState(200);
  const [minDiscount, setMinDiscount] = useState(0);
  const [types, setTypes] = useState<string[]>([]);
  const [expiryWindow, setExpiryWindow] = useState("any");
  const [city, setCity] = useState("all");
  const [rxOnly, setRxOnly] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [sort, setSort] = useState("discount");
  const [showFilters, setShowFilters] = useState(false);

  const cities = useMemo(
    () => Array.from(new Set(pharmacies.map((p) => p.city))).sort(),
    [pharmacies],
  );

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = listable.filter((m) => {
      const ph = getPharmacy(m.pharmacyId);
      if (
        term &&
        ![m.medicineName, m.genericName, m.manufacturer, ph?.pharmacyName ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
        return false;
      if (m.discountedPrice > maxPrice) return false;
      if (discountPercent(m.originalPrice, m.discountedPrice) < minDiscount) return false;
      if (types.length && !types.includes(m.medicineType)) return false;
      if (rxOnly && !m.prescriptionRequired) return false;
      if (inStock && m.quantity <= 0) return false;
      if (city !== "all" && ph?.city !== city) return false;
      if (expiryWindow !== "any") {
        const d = daysUntil(m.expiryDate);
        if (expiryWindow === "90" && d > 90) return false;
        if (expiryWindow === "180" && d > 180) return false;
        if (expiryWindow === "365" && d > 365) return false;
      }
      return true;
    });

    out = [...out].sort((a, b) => {
      if (sort === "price") return a.discountedPrice - b.discountedPrice;
      if (sort === "expiry") return daysUntil(a.expiryDate) - daysUntil(b.expiryDate);
      if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      return (
        discountPercent(b.originalPrice, b.discountedPrice) -
        discountPercent(a.originalPrice, a.discountedPrice)
      );
    });
    return out;
  }, [listable, q, maxPrice, minDiscount, types, rxOnly, inStock, city, expiryWindow, sort]);

  const filters = (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{t("filters")}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMaxPrice(200);
            setMinDiscount(0);
            setTypes([]);
            setExpiryWindow("any");
            setCity("all");
            setRxOnly(false);
            setInStock(true);
          }}
        >
          {t("clearFilters")}
        </Button>
      </div>

      <div className="space-y-3">
        <Label>
          {t("priceRange")}: ₹0 – ₹{maxPrice}
        </Label>
        <Slider value={[maxPrice]} min={10} max={200} step={5} onValueChange={([v]) => setMaxPrice(v ?? 200)} />
      </div>

      <div className="space-y-3">
        <Label>
          {t("minDiscount")}: {minDiscount}%
        </Label>
        <Slider value={[minDiscount]} min={0} max={80} step={5} onValueChange={([v]) => setMinDiscount(v ?? 0)} />
      </div>

      <div className="space-y-2">
        <Label>{t("medicineType")}</Label>
        <div className="space-y-2">
          {TYPES.map((ty) => (
            <label key={ty} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={types.includes(ty)}
                onCheckedChange={(c) =>
                  setTypes((prev) => (c ? [...prev, ty] : prev.filter((x) => x !== ty)))
                }
              />
              {ty}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("expiryPeriod")}</Label>
        <Select value={expiryWindow} onValueChange={setExpiryWindow}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{tx("Any", "எதுவும்")}</SelectItem>
            <SelectItem value="90">{tx("Within 3 months", "3 மாதங்களுக்குள்")}</SelectItem>
            <SelectItem value="180">{tx("Within 6 months", "6 மாதங்களுக்குள்")}</SelectItem>
            <SelectItem value="365">{tx("Within 12 months", "12 மாதங்களுக்குள்")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t("location")}</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tx("All cities", "அனைத்து நகரங்கள்")}</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={rxOnly} onCheckedChange={(c) => setRxOnly(!!c)} />
          {t("prescriptionRequired")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={inStock} onCheckedChange={(c) => setInStock(!!c)} />
          {t("available")}
        </label>
      </div>
    </div>
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold">{t("affordableMedicines")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tx(
            "Only listings from licence-verified pharmacies, always within expiry date.",
            "உரிமம் சரிபார்க்கப்பட்ட மருந்தகங்களின் பட்டியல்கள் மட்டுமே, எப்போதும் காலாவதிக்குள்.",
          )}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("search")}
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="sm:w-56"><SelectValue placeholder={t("sortBy")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="price">{t("lowestPrice")}</SelectItem>
              <SelectItem value="discount">{t("highestDiscount")}</SelectItem>
              <SelectItem value="expiry">{t("nearestExpiry")}</SelectItem>
              <SelectItem value="newest">{t("newestListed")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal className="h-4 w-4" /> {t("filters")}
          </Button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={showFilters ? "block" : "hidden lg:block"}>{filters}</aside>
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              {results.length} {tx("medicines found", "மருந்துகள் கிடைத்தன")}
            </p>
            {results.length === 0 ? (
              <p className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                {t("noResults")}
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((m) => (
                  <MedicineCard key={m.id} medicine={m} />
                ))}
              </div>
            )}
            <div className="mt-8">
              <Disclaimer />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}