import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/medisave/AppShell";
import { Disclaimer } from "@/components/medisave/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/register/patient")({
  head: () => ({
    meta: [
      { title: "Patient Registration — MediSave" },
      { name: "description", content: "Create a MediSave patient account with secure, masked Aadhaar verification." },
      { property: "og:title", content: "Patient Registration — MediSave" },
      { property: "og:description", content: "Register to find affordable medicines from verified pharmacies." },
    ],
  }),
  component: PatientRegister,
});

function PatientRegister() {
  const { t, tx } = useLang();
  const { login } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [aadhaar, setAadhaar] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const masked = verified ? `XXXX XXXX ${aadhaar.replace(/\s/g, "").slice(-4)}` : "";
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e["name"] = t("required");
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e["phone"] = tx("Enter a valid 10-digit mobile number.", "சரியான 10 இலக்க எண்ணை உள்ளிடவும்.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e["email"] = tx("Enter a valid email address.", "சரியான மின்னஞ்சலை உள்ளிடவும்.");
    if (form.password.length < 8) e["password"] = tx("Password must be at least 8 characters.", "கடவுச்சொல் குறைந்தது 8 எழுத்துகள்.");
    if (form.password !== form.confirm) e["confirm"] = tx("Passwords do not match.", "கடவுச்சொற்கள் பொருந்தவில்லை.");
    if (!verified) e["aadhaar"] = tx("Please complete Aadhaar verification.", "ஆதார் சரிபார்ப்பை முடிக்கவும்.");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">{tx("Patient Registration", "நோயாளி பதிவு")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("patientDesc")}</p>

        <form
          className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!validate()) {
              toast.error(tx("Please fix the highlighted fields.", "குறிக்கப்பட்ட புலங்களை சரிசெய்யவும்."));
              return;
            }
            login({
              id: "patient-demo",
              name: form.name,
              email: form.email,
              phone: form.phone,
              role: "patient",
              aadhaarMasked: masked,
            });
            toast.success(tx("Welcome to MediSave!", "மெடிசேவ்-க்கு வரவேற்கிறோம்!"));
            navigate({ to: "/dashboard" });
          }}
        >
          <Field id="name" label={t("fullName")} value={form.name} onChange={set("name")} error={errors["name"]} />
          <Field id="phone" label={t("mobile")} value={form.phone} onChange={set("phone")} error={errors["phone"]} inputMode="numeric" placeholder="9876543210" />
          <Field id="email" label={t("email")} type="email" value={form.email} onChange={set("email")} error={errors["email"]} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="password" label={t("password")} type="password" value={form.password} onChange={set("password")} error={errors["password"]} />
            <Field id="confirm" label={t("confirmPassword")} type="password" value={form.confirm} onChange={set("confirm")} error={errors["confirm"]} />
          </div>

          {/* Aadhaar */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-trust" />
              <h2 className="text-base font-semibold">{t("aadhaarVerification")}</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {tx(
                "We store only the verification result and a masked reference. Your full Aadhaar number is never displayed or shared.",
                "நாங்கள் சரிபார்ப்பு முடிவையும் மறைக்கப்பட்ட குறிப்பையும் மட்டுமே சேமிக்கிறோம். முழு ஆதார் எண் காட்டப்படாது.",
              )}
            </p>

            {verified ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm font-medium text-success">
                <CheckCircle2 className="h-5 w-5" /> {t("identityVerified")} · {masked}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="1234 5678 9012"
                    aria-label={t("aadhaarNumber")}
                    inputMode="numeric"
                    maxLength={14}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (aadhaar.replace(/\s/g, "").length !== 12) {
                        toast.error(tx("Aadhaar must be 12 digits.", "ஆதார் 12 இலக்கங்கள் இருக்க வேண்டும்."));
                        return;
                      }
                      setOtpSent(true);
                      toast.success(tx("OTP sent to your linked mobile (demo: 123456).", "OTP அனுப்பப்பட்டது (டெமோ: 123456)."));
                    }}
                  >
                    {t("sendOtp")}
                  </Button>
                </div>
                {otpSent && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder={t("enterOtp")}
                      inputMode="numeric"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (otp !== "123456") {
                          toast.error(tx("Incorrect OTP. Try 123456 in this demo.", "தவறான OTP. டெமோவில் 123456 முயற்சிக்கவும்."));
                          return;
                        }
                        setVerified(true);
                        toast.success(t("identityVerified"));
                      }}
                    >
                      {t("verify")}
                    </Button>
                  </div>
                )}
                {errors["aadhaar"] && <p className="text-xs text-danger">{errors["aadhaar"]}</p>}
              </div>
            )}
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
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string | undefined }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}