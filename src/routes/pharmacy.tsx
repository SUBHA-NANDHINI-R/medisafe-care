import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, IndianRupee, Package, Plus, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/medisave/AppShell";
import { ExpiryBadge, StatusBadge } from "@/components/medisave/Badges";
import { Disclaimer } from "@/components/medisave/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLang } from "@/lib/i18n";
import {
  daysUntil,
  formatMonthYear,
  rupees,
  shelfLifeLabel,
  type MedicineType,
} from "@/lib/medisave-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/pharmacy")({
  head: () => ({
    meta: [
      { title: "Pharmacy Dashboard | MediSave" },
      { name: "description", content: "Manage listings, inventory, orders and verification status for your pharmacy on MediSave." },
      { property: "og:title", content: "Pharmacy Dashboard — MediSave" },
      { property: "og:description", content: "Add medicines, track expiry and manage orders." },
    ],
  }),
  component: PharmacyDashboard,
});

const TYPES: MedicineType[] = ["Tablet", "Capsule", "Syrup", "Cream", "Other"];

function PharmacyDashboard() {
  const { t, tx, lang } = useLang();
  const { user, pharmacies, medicines, orders, addMedicine, removeMedicine } = useStore();
  const pharmacyId = user?.pharmacyId ?? "ph-1";
  const pharmacy = pharmacies.find((p) => p.id === pharmacyId);
  const mine = medicines.filter((m) => m.pharmacyId === pharmacyId);
  const myOrders = orders.filter((o) => o.pharmacyId === pharmacyId);
  const isVerified = pharmacy?.verificationStatus === "verified";

  const active = mine.filter((m) => daysUntil(m.expiryDate) > 0);
  const expiring = mine.filter((m) => daysUntil(m.expiryDate) > 0 && daysUntil(m.expiryDate) <= 90);
  const sales = myOrders.reduce((s, o) => s + o.totalPrice, 0);

  const [form, setForm] = useState({
    medicineName: "",
    genericName: "",
    manufacturer: "",
    medicineType: "Tablet" as MedicineType,
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    quantity: "",
    originalPrice: "",
    discountedPrice: "",
    description: "",
    image: "",
  });
  const [rx, setRx] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const previewShelf = form.expiryDate ? shelfLifeLabel(form.expiryDate, lang) : "—";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.medicineName.trim()) err["medicineName"] = t("required");
    if (!form.genericName.trim()) err["genericName"] = t("required");
    if (!form.manufacturer.trim()) err["manufacturer"] = t("required");
    if (!form.batchNumber.trim()) err["batchNumber"] = t("required");

    const mfg = form.manufacturingDate ? new Date(form.manufacturingDate) : null;
    const exp = form.expiryDate ? new Date(form.expiryDate) : null;
    if (!mfg) err["manufacturingDate"] = t("required");
    if (!exp) err["expiryDate"] = t("required");
    if (mfg && mfg.getTime() > Date.now())
      err["manufacturingDate"] = tx("Manufacturing date cannot be in the future.", "தயாரிப்பு தேதி எதிர்காலத்தில் இருக்கக்கூடாது.");
    if (exp && exp.getTime() <= Date.now())
      err["expiryDate"] = tx("Expired medicines can never be listed.", "காலாவதியான மருந்துகளை பட்டியலிட முடியாது.");
    if (mfg && exp && exp <= mfg)
      err["expiryDate"] = tx("Expiry must be after the manufacturing date.", "காலாவதி தேதி தயாரிப்பு தேதிக்குப் பிறகு இருக்க வேண்டும்.");

    const qty = Number(form.quantity);
    const mrp = Number(form.originalPrice);
    const price = Number(form.discountedPrice);
    if (!Number.isFinite(qty) || qty <= 0) err["quantity"] = tx("Quantity must be greater than zero.", "அளவு பூஜ்ஜியத்திற்கு மேல் இருக்க வேண்டும்.");
    if (!Number.isFinite(mrp) || mrp <= 0) err["originalPrice"] = tx("Enter a valid price.", "சரியான விலையை உள்ளிடவும்.");
    if (!Number.isFinite(price) || price <= 0) err["discountedPrice"] = tx("Enter a valid price.", "சரியான விலையை உள்ளிடவும்.");
    if (price > 0 && mrp > 0 && price >= mrp)
      err["discountedPrice"] = tx("Discounted price must be lower than MRP.", "தள்ளுபடி விலை MRP-ஐ விட குறைவாக இருக்க வேண்டும்.");

    setErrors(err);
    if (Object.keys(err).length) {
      toast.error(tx("Please fix the highlighted fields.", "குறிக்கப்பட்ட புலங்களை சரிசெய்யவும்."));
      return;
    }
    if (!isVerified) {
      toast.error(tx("Only verified pharmacies can list medicines.", "சரிபார்க்கப்பட்ட மருந்தகங்கள் மட்டுமே பட்டியலிட முடியும்."));
      return;
    }

    addMedicine({
      id: `med-${Date.now()}`,
      pharmacyId,
      medicineName: form.medicineName,
      genericName: form.genericName,
      manufacturer: form.manufacturer,
      medicineType: form.medicineType,
      batchNumber: form.batchNumber,
      manufacturingDate: form.manufacturingDate,
      expiryDate: form.expiryDate,
      quantity: qty,
      originalPrice: mrp,
      discountedPrice: price,
      prescriptionRequired: rx,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=70",
      description: form.description,
      safetyInfo:
        "Store below 25°C in a dry place, away from sunlight and out of reach of children. Check the seal and expiry date before use.",
      createdAt: new Date().toISOString(),
    });
    toast.success(tx("Medicine listed successfully.", "மருந்து வெற்றிகரமாக பட்டியலிடப்பட்டது."));
    setForm({ ...form, medicineName: "", genericName: "", batchNumber: "", quantity: "", originalPrice: "", discountedPrice: "", description: "" });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold sm:text-3xl">{pharmacy?.pharmacyName}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {pharmacy?.city}, {pharmacy?.state} · {tx("Owner", "உரிமையாளர்")}: {pharmacy?.ownerName}
            </p>
          </div>
          {pharmacy && <StatusBadge status={pharmacy.verificationStatus} />}
        </header>

        {!isVerified && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border-2 border-warning/50 bg-warning/12 p-4 text-sm text-warning-foreground">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              {tx(
                "Your pharmacy is not verified yet. An administrator is reviewing your licence document — you can prepare listings, but they go live only after approval.",
                "உங்கள் மருந்தகம் இன்னும் சரிபார்க்கப்படவில்லை. உரிமம் மதிப்பாய்வில் உள்ளது — ஒப்புதலுக்குப் பிறகே பட்டியல்கள் நேரலைக்கு வரும்.",
              )}
            </p>
          </div>
        )}

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="add">{t("addMedicine")}</TabsTrigger>
            <TabsTrigger value="mine">{t("myMedicines")}</TabsTrigger>
            <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
            <TabsTrigger value="inventory">{t("inventory")}</TabsTrigger>
            <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label={t("activeMedicines")} value={`${active.length}`} Icon={Package} />
              <Stat label={t("expiringSoon")} value={`${expiring.length}`} Icon={AlertTriangle} />
              <Stat label={t("ordersReceived")} value={`${myOrders.length}`} Icon={TrendingUp} />
              <Stat label={t("totalSales")} value={rupees(sales)} Icon={IndianRupee} />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Bell className="h-4 w-4 text-primary" /> {t("notifications")}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  • {expiring.length} {tx("listings are approaching expiry and need review.", "பட்டியல்கள் காலாவதியை நெருங்குகின்றன — மதிப்பாய்வு தேவை.")}
                </li>
                <li>• {tx("Keep discounted prices below MRP to stay compliant.", "தள்ளுபடி விலையை MRP-க்கு கீழே வைத்திருங்கள்.")}</li>
                <li>• {tx("Prescription medicines must be handed over against a valid prescription.", "சீட்டு தேவையான மருந்துகளை சரியான சீட்டுடன் மட்டுமே வழங்கவும்.")}</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <F id="medicineName" label={t("medicineName")} value={form.medicineName} onChange={set("medicineName")} error={errors["medicineName"]} />
                <F id="genericName" label={t("genericName")} value={form.genericName} onChange={set("genericName")} error={errors["genericName"]} />
                <F id="manufacturer" label={t("manufacturer")} value={form.manufacturer} onChange={set("manufacturer")} error={errors["manufacturer"]} />
                <div className="space-y-2">
                  <Label>{t("medicineType")}</Label>
                  <Select
                    value={form.medicineType}
                    onValueChange={(v) => setForm((f) => ({ ...f, medicineType: v as MedicineType }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TYPES.map((ty) => <SelectItem key={ty} value={ty}>{ty}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <F id="batchNumber" label={t("batchNumber")} value={form.batchNumber} onChange={set("batchNumber")} error={errors["batchNumber"]} />
                <F id="quantity" label={t("quantity")} type="number" min={1} value={form.quantity} onChange={set("quantity")} error={errors["quantity"]} />
                <F id="manufacturingDate" label={t("mfgDate")} type="date" value={form.manufacturingDate} onChange={set("manufacturingDate")} error={errors["manufacturingDate"]} />
                <F id="expiryDate" label={t("expiryDate")} type="date" value={form.expiryDate} onChange={set("expiryDate")} error={errors["expiryDate"]} />
                <F id="originalPrice" label={t("originalPrice")} type="number" min={1} value={form.originalPrice} onChange={set("originalPrice")} error={errors["originalPrice"]} />
                <F id="discountedPrice" label={t("discountedPrice")} type="number" min={1} value={form.discountedPrice} onChange={set("discountedPrice")} error={errors["discountedPrice"]} />
                <F id="image" label={`${t("medicineImage")} (URL)`} value={form.image} onChange={set("image")} placeholder="https://…" />
                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <Label htmlFor="rx" className="text-sm">{t("prescriptionRequired")}</Label>
                  <Switch id="rx" checked={rx} onCheckedChange={setRx} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">{t("description")}</Label>
                <Textarea id="desc" rows={3} value={form.description} onChange={set("description")} />
              </div>

              <div className="rounded-xl bg-surface p-4 text-sm">
                <p className="font-medium">
                  {t("shelfLife")}: <span className="text-primary">{previewShelf}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tx(
                    "Calculated automatically from the expiry date. Expired medicines are rejected by the system.",
                    "காலாவதி தேதியிலிருந்து தானாக கணக்கிடப்படுகிறது. காலாவதியான மருந்துகள் நிராகரிக்கப்படும்.",
                  )}
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto">
                <Plus className="h-4 w-4" /> {t("addMedicine")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="mine" className="mt-6 space-y-3">
            {mine.map((m) => (
              <div key={m.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.medicineName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.batchNumber} · {t("expiryDate")}: {formatMonthYear(m.expiryDate)} · {shelfLifeLabel(m.expiryDate, lang)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ExpiryBadge expiryDate={m.expiryDate} />
                    <span className="text-xs text-muted-foreground">
                      {rupees(m.discountedPrice)} / {rupees(m.originalPrice)} · {m.quantity} {tx("units", "அலகுகள்")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/medicines/$id" params={{ id: m.id }}>{t("viewDetails")}</Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { removeMedicine(m.id); toast.success(tx("Listing removed.", "பட்டியல் நீக்கப்பட்டது.")); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-3">
            {myOrders.length === 0 && (
              <p className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                {tx("No orders yet.", "இதுவரை ஆர்டர்கள் இல்லை.")}
              </p>
            )}
            {myOrders.map((o) => {
              const med = medicines.find((m) => m.id === o.medicineId);
              return (
                <div key={o.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{med?.medicineName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.userName} · {tx("Qty", "அளவு")} {o.quantity} · {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{rupees(o.totalPrice)}</p>
                    <p className="text-xs text-muted-foreground">{o.orderStatus}</p>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3">{t("medicineName")}</th>
                    <th className="p-3">{t("batchNumber")}</th>
                    <th className="p-3">{t("quantity")}</th>
                    <th className="p-3">{t("expiryDate")}</th>
                    <th className="p-3">{t("verificationStatus")}</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map((m) => (
                    <tr key={m.id} className="border-t border-border">
                      <td className="p-3 font-medium">{m.medicineName}</td>
                      <td className="p-3 text-muted-foreground">{m.batchNumber}</td>
                      <td className="p-3">{m.quantity}</td>
                      <td className="p-3">{formatMonthYear(m.expiryDate)}</td>
                      <td className="p-3"><ExpiryBadge expiryDate={m.expiryDate} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">{t("profile")}</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Info label={t("pharmacyName")} value={pharmacy?.pharmacyName ?? "—"} />
                <Info label={t("ownerName")} value={pharmacy?.ownerName ?? "—"} />
                <Info label={t("contactNumber")} value={pharmacy?.contact ?? "—"} />
                <Info label={t("email")} value={pharmacy?.email ?? "—"} />
                <Info label={t("address")} value={`${pharmacy?.address}, ${pharmacy?.city} — ${pharmacy?.pincode}`} />
                <Info label={t("verificationStatus")} value={pharmacy?.verificationStatus ?? "—"} />
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                {tx(
                  "Your licence document is stored securely and shown only to MediSave administrators.",
                  "உங்கள் உரிம ஆவணம் பாதுகாப்பாக சேமிக்கப்பட்டு நிர்வாகிகளுக்கு மட்டுமே காட்டப்படும்.",
                )}
              </p>
            </div>
            <Disclaimer />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, Icon }: { label: string; value: string; Icon: React.ComponentType<{ className?: string }> }) {
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium break-words">{value}</dd>
    </div>
  );
}

function F({
  id,
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string | undefined }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}