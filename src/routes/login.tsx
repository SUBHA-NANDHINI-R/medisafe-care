import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/medisave/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Disclaimer } from "@/components/medisave/Disclaimer";
import { useLang } from "@/lib/i18n";
import { useStore, type Role } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — MediSave" },
      { name: "description", content: "Sign in to MediSave as a patient, pharmacy owner or administrator." },
      { property: "og:title", content: "Login to MediSave" },
      { property: "og:description", content: "Secure, role-based access to your MediSave account." },
    ],
  }),
  component: LoginPage,
});

const demo: Record<Role, { email: string; name: string; to: string; pharmacyId?: string }> = {
  patient: { email: "divya@example.com", name: "Divya R.", to: "/dashboard" },
  pharmacy: { email: "care@sribalajimedicals.in", name: "R. Karthik", to: "/pharmacy", pharmacyId: "ph-1" },
  admin: { email: "admin@medisave.health", name: "MediSave Admin", to: "/admin" },
};

function LoginPage() {
  const { t, tx } = useLang();
  const { login } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState(demo.patient.email);
  const [password, setPassword] = useState("demo1234");

  return (
    <AppShell>
      <div className="mx-auto max-w-md px-4 py-14">
        <h1 className="text-3xl font-bold">{t("login")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tx("Role-based access keeps patient, pharmacy and admin data separate.", "பங்கு அடிப்படையிலான அணுகல் தரவை பாதுகாக்கிறது.")}
        </p>

        <Tabs
          value={role}
          onValueChange={(v) => {
            const r = v as Role;
            setRole(r);
            setEmail(demo[r].email);
          }}
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patient">{tx("Patient", "நோயாளி")}</TabsTrigger>
            <TabsTrigger value="pharmacy">{tx("Pharmacy", "மருந்தகம்")}</TabsTrigger>
            <TabsTrigger value="admin">{t("admin")}</TabsTrigger>
          </TabsList>
        </Tabs>

        <form
          className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@") || password.length < 6) {
              toast.error(t("invalid"));
              return;
            }
            const d = demo[role];
            login({
              id: `${role}-demo`,
              name: d.name,
              email,
              phone: "+91 90000 00000",
              role,
              ...(role === "patient" ? { aadhaarMasked: "XXXX XXXX 1234" } : {}),
              ...(d.pharmacyId ? { pharmacyId: d.pharmacyId } : {}),
            });
            toast.success(tx("Signed in successfully.", "வெற்றிகரமாக உள்நுழைந்தீர்கள்."));
            navigate({ to: d.to });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            {t("login")}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {tx("Demo credentials are pre-filled for each role.", "ஒவ்வொரு பங்கிற்கும் டெமோ விவரங்கள் நிரப்பப்பட்டுள்ளன.")}
          </p>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {tx("New to MediSave?", "மெடிசேவ் புதியதா?")}{" "}
          <Link to="/get-started" className="font-medium text-primary hover:underline">
            {t("signup")}
          </Link>
        </p>
        <div className="mt-6">
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}