import { createFileRoute } from "@tanstack/react-router";
import { Check, Eye, FileText, ShieldCheck, Trash2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/medisave/AppShell";
import { ExpiryBadge, StatusBadge } from "@/components/medisave/Badges";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLang } from "@/lib/i18n";
import { formatMonthYear, getPharmacy, rupees } from "@/lib/medisave-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | MediSave" },
      { name: "description", content: "Review pharmacy applications and licence documents, approve or reject pharmacies, and moderate medicine listings." },
      { property: "og:title", content: "Admin Dashboard — MediSave" },
      { property: "og:description", content: "Verification and moderation tools for the MediSave platform." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { t, tx } = useLang();
  const { pharmacies, medicines, orders, setPharmacyStatus, removeMedicine } = useStore();
  const applications = pharmacies.filter((p) => p.verificationStatus !== "verified");

  const users = [
    { name: "Divya R.", email: "divya@example.com", role: "patient", status: tx("Aadhaar verified", "ஆதார் சரிபார்க்கப்பட்டது") },
    { name: "Suresh M.", email: "suresh@example.com", role: "patient", status: tx("Aadhaar verified", "ஆதார் சரிபார்க்கப்பட்டது") },
    { name: "R. Karthik", email: "care@sribalajimedicals.in", role: "pharmacy", status: tx("Verified pharmacy", "சரிபார்க்கப்பட்ட மருந்தகம்") },
    { name: "M. Prakash", email: "info@citycaredrug.in", role: "pharmacy", status: tx("Under review", "மதிப்பாய்வில்") },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold">{tx("Admin Dashboard", "நிர்வாக டாஷ்போர்டு")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tx(
            "A pharmacy must be approved here before any of its medicines can be sold on MediSave.",
            "மருந்தகம் இங்கே ஒப்புதல் பெற்ற பிறகே அதன் மருந்துகள் விற்கப்படும்.",
          )}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={tx("Registered users", "பதிவு செய்த பயனர்கள்")} value={`${users.length}`} Icon={Users} />
          <Stat label={tx("Pending applications", "நிலுவை விண்ணப்பங்கள்")} value={`${applications.length}`} Icon={FileText} />
          <Stat label={t("medicines")} value={`${medicines.length}`} Icon={ShieldCheck} />
          <Stat label={t("orders")} value={`${orders.length}`} Icon={Eye} />
        </div>

        <Tabs defaultValue="applications" className="mt-8">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="applications">{tx("Pharmacy applications", "மருந்தக விண்ணப்பங்கள்")}</TabsTrigger>
            <TabsTrigger value="listings">{tx("Listings", "பட்டியல்கள்")}</TabsTrigger>
            <TabsTrigger value="users">{tx("Users", "பயனர்கள்")}</TabsTrigger>
            <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6 space-y-3">
            {pharmacies.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">{p.pharmacyName}</h2>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.ownerName} · {p.city}, {p.state} — {p.pincode} · {p.contact}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-surface px-2 py-1 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" /> licence-{p.id}.pdf ·{" "}
                      {tx("admin-only document", "நிர்வாகிக்கு மட்டும்")}
                    </p>
                  </div>
                  <StatusBadge status={p.verificationStatus} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setPharmacyStatus(p.id, "verified");
                      toast.success(tx("Pharmacy approved.", "மருந்தகம் ஒப்புதல் பெற்றது."));
                    }}
                  >
                    <Check className="h-4 w-4" /> {tx("Approve", "ஒப்புதல்")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPharmacyStatus(p.id, "under_review");
                      toast.info(tx("Marked under review.", "மதிப்பாய்வில் எனக் குறிக்கப்பட்டது."));
                    }}
                  >
                    <Eye className="h-4 w-4" /> {t("underReview")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setPharmacyStatus(p.id, "rejected");
                      toast.error(tx("Application rejected.", "விண்ணப்பம் நிராகரிக்கப்பட்டது."));
                    }}
                  >
                    <X className="h-4 w-4" /> {t("rejected")}
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="listings" className="mt-6 space-y-3">
            {medicines.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.medicineName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {getPharmacy(m.pharmacyId)?.pharmacyName} · {m.batchNumber} ·{" "}
                    {t("expiryDate")}: {formatMonthYear(m.expiryDate)} · {rupees(m.discountedPrice)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ExpiryBadge expiryDate={m.expiryDate} />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      removeMedicine(m.id);
                      toast.success(tx("Listing removed.", "பட்டியல் நீக்கப்பட்டது."));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3">{t("fullName")}</th>
                    <th className="p-3">{t("email")}</th>
                    <th className="p-3">{tx("Role", "பங்கு")}</th>
                    <th className="p-3">{t("verificationStatus")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.email} className="border-t border-border">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3 text-muted-foreground">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3 text-muted-foreground">{u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-border p-3 text-xs text-muted-foreground">
                {tx(
                  "Aadhaar numbers are never stored or displayed — only a masked reference and verification result.",
                  "ஆதார் எண்கள் சேமிக்கப்படுவதோ காட்டப்படுவதோ இல்லை — மறைக்கப்பட்ட குறிப்பு மட்டுமே.",
                )}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{o.id} · {o.userName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {getPharmacy(o.pharmacyId)?.pharmacyName} · {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold text-primary">{rupees(o.totalPrice)}</span>
              </div>
            ))}
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