import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileCheck2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/medisave/AppShell";
import { StatusBadge } from "@/components/medisave/Badges";
import { Disclaimer } from "@/components/medisave/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/register/pharmacy")({
  head: () => ({
    meta: [
      { title: "Pharmacy Registration — MediSave" },
      { name: "description", content: "Register your licensed pharmacy on MediSave and list short shelf-life medicines after admin verification." },
      { property: "og:title", content: "Register Your Pharmacy — MediSave" },
      { property: "og:description", content: "Upload your licence, get verified, and reach people looking for affordable medicines." },
    ],
  }),
  component: PharmacyRegister,
});

const empty = {
  pharmacyName: "",
  ownerName: "",
  contact: "",
  email: "",
  address: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
  password: "",
  confirm: "",
};

function PharmacyRegister() {
  const { t, tx } = useLang();
  const { addPharmacy, login } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [doc, setDoc] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e: Record<string, string> = {};
    (["pharmacyName", "ownerName", "address", "city", "state"] as const).forEach((k) => {
      if (!form[k].trim()) e[k] = t("required");
    });
    if (!/^[6-9]\d{9}$/.test(form.contact.replace(/\s/g, ""))) e["contact"] = tx("Enter a valid 10-digit number.", "சரியான 10 இலக்க எண்.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e["email"] = tx("Enter a valid email address.", "சரியான மின்னஞ்சல்.");
    if (!/^\d{6}$/.test(form.pincode)) e["pincode"] = tx("Pincode must be 6 digits.", "அஞ்சல் குறியீடு 6 இலக்கங்கள்.");
    if (form.password.length < 8) e["password"] = tx("Minimum 8 characters.", "குறைந்தது 8 எழுத்துகள்.");
    if (form.password !== form.confirm) e["confirm"] = tx("Passwords do not match.", "கடவுச்சொற்கள் பொருந்தவில்லை.");
    if (!doc) e["doc"] = tx("Please upload your pharmacy licence.", "உங்கள் மருந்தக உரிமத்தை பதிவேற்றவும்.");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">{t("ctaRegisterPharmacy")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("pharmacyOwnerDesc")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <StatusBadge status="pending" />
          <span>
            {tx(
              "Only verified pharmacies can list medicines for customers.",
              "சரிபார்க்கப்பட்ட மருந்தகங்கள் மட்டுமே மருந்துகளை பட்டியலிட முடியும்.",
            )}
          </span>
        </div>

        <form
          className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!validate()) {
              toast.error(tx("Please fix the highlighted fields.", "குறிக்கப்பட்ட புலங்களை சரிசெய்யவும்."));
              return;
            }
            const id = `ph-${Date.now()}`;
            addPharmacy({
              id,
              pharmacyName: form.pharmacyName,
              ownerName: form.ownerName,
              contact: form.contact,
              email: form.email,
              address: form.address,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              verificationStatus: "under_review",
              rating: 0,
              reviews: [],
              createdAt: new Date().toISOString().slice(0, 10),
            });
            login({
              id: `owner-${id}`,
              name: form.ownerName,
              email: form.email,
              phone: form.contact,
              role: "pharmacy",
              pharmacyId: id,
            });
            toast.success(tx("Application submitted — under review.", "விண்ணப்பம் சமர்ப்பிக்கப்பட்டது — மதிப்பாய்வில்."));
            navigate({ to: "/pharmacy" });
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="pharmacyName" label={t("pharmacyName")} value={form.pharmacyName} onChange={set("pharmacyName")} error={errors["pharmacyName"]} />
            <Field id="ownerName" label={t("ownerName")} value={form.ownerName} onChange={set("ownerName")} error={errors["ownerName"]} />
            <Field id="contact" label={t("contactNumber")} value={form.contact} onChange={set("contact")} error={errors["contact"]} inputMode="numeric" />
            <Field id="email" label={t("email")} type="email" value={form.email} onChange={set("email")} error={errors["email"]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t("address")}</Label>
            <Textarea id="address" value={form.address} onChange={set("address")} rows={3} />
            {errors["address"] && <p className="text-xs text-danger">{errors["address"]}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field id="city" label={t("city")} value={form.city} onChange={set("city")} error={errors["city"]} />
            <Field id="state" label={t("state")} value={form.state} onChange={set("state")} error={errors["state"]} />
            <Field id="pincode" label={t("pincode")} value={form.pincode} onChange={set("pincode")} error={errors["pincode"]} inputMode="numeric" maxLength={6} />
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-surface p-5">
            <Label htmlFor="licence" className="text-base font-semibold">
              {t("licenseUpload")}
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              {tx(
                "PDF or image. Documents are visible only to MediSave administrators — never on your public profile.",
                "PDF அல்லது படம். ஆவணங்கள் நிர்வாகிகளுக்கு மட்டுமே தெரியும்.",
              )}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Input
                id="licence"
                type="file"
                accept="image/*,application/pdf"
                className="max-w-xs"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setDoc(f.name);
                    toast.success(tx("Document uploaded.", "ஆவணம் பதிவேற்றப்பட்டது."));
                  }
                }}
              />
              {doc ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-success">
                  <FileCheck2 className="h-4 w-4" /> {doc}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" /> {tx("No file selected", "கோப்பு தேர்ந்தெடுக்கப்படவில்லை")}
                </span>
              )}
            </div>
            {errors["doc"] && <p className="mt-2 text-xs text-danger">{errors["doc"]}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="password" label={t("password")} type="password" value={form.password} onChange={set("password")} error={errors["password"]} />
            <Field id="confirm" label={t("confirmPassword")} type="password" value={form.confirm} onChange={set("confirm")} error={errors["confirm"]} />
          </div>

          <Button type="submit" size="lg" className="w-full">
            {t("createAccount")}
          </Button>
        </form>

        <div className="mt-6">
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  id,
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}