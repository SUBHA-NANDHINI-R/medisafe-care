import { createFileRoute } from "@tanstack/react-router";
import { Bell, Bot, Send, ShieldAlert, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/medisave/AppShell";
import { LanguageSwitcher } from "@/components/medisave/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang, type Lang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "MediSave AI Follow-Up | Reminders in English & Tamil" },
      { name: "description", content: "MediSave AI Follow-Up helps with medicine reminders, purchase follow-ups and general medicine information in English and Tamil. It never diagnoses or prescribes." },
      { property: "og:title", content: "MediSave AI Follow-Up" },
      { property: "og:description", content: "Bilingual reminders and general medicine guidance — never medical advice." },
    ],
  }),
  component: AiFollowUp,
});

type Msg = { role: "user" | "assistant"; text: string };

const UNSAFE = [
  "diagnose", "what disease", "do i have", "prescribe", "increase dose", "reduce dose",
  "stop taking", "double dose", "நோய்", "மருந்து நிறுத்த", "அளவை அதிகரி",
];

function reply(input: string, lang: Lang, name: string): string {
  const q = input.toLowerCase();

  if (UNSAFE.some((k) => q.includes(k))) {
    return lang === "ta"
      ? "மன்னிக்கவும் — நோயறிதல், மருந்து பரிந்துரை அல்லது மருந்தின் அளவை மாற்றுவது குறித்து என்னால் உதவ முடியாது. இது குறித்து தகுதியான மருத்துவர் அல்லது மருந்தாளரிடம் ஆலோசிக்கவும். நான் நினைவூட்டல்கள் மற்றும் பொதுவான தகவல்களில் உதவ முடியும்."
      : "I can't diagnose conditions, prescribe medicines or change a dosage. Please consult a qualified doctor or pharmacist for that. I can help with reminders, purchase follow-ups and general medicine information.";
  }
  if (q.includes("remind") || q.includes("நினைவூட்ட")) {
    return lang === "ta"
      ? "நினைவூட்டலை அமைக்கலாம். கீழே 'நினைவூட்டலை உருவாக்கு' என்பதைப் பயன்படுத்தி நேரத்தையும் வகையையும் தேர்ந்தெடுக்கவும். ஒவ்வொரு நாளும் ஒரே நேரத்தில் மருந்து எடுப்பது நல்லது."
      : "I can set that up. Use \"Create reminder\" below to choose the type and date. Taking medicines at the same time each day makes the routine easier to keep.";
  }
  if (q.includes("expiry") || q.includes("expire") || q.includes("காலாவதி")) {
    return lang === "ta"
      ? "ஒவ்வொரு பட்டியலிலும் தயாரிப்பு மற்றும் காலாவதி தேதி காட்டப்படும். வாங்கும் முன் பொதியில் உள்ள தேதியை சரிபார்க்கவும். காலாவதியான மருந்துகளை மெடிசேவ் அனுமதிக்காது."
      : "Every listing shows the manufacturing and expiry date, and MediSave blocks expired stock. Always double-check the date printed on the pack before you buy or use it.";
  }
  if (q.includes("store") || q.includes("சேமி") || q.includes("storage")) {
    return lang === "ta"
      ? "பெரும்பாலான மருந்துகளை 25°C-க்கு கீழ், வெயில் படாத உலர்ந்த இடத்தில், குழந்தைகளுக்கு எட்டாத இடத்தில் வைக்கவும். சிரப் திறந்த பிறகு பொதியில் உள்ள வழிமுறைகளைப் பின்பற்றவும்."
      : "Most medicines should be stored below 25°C in a dry place away from sunlight and out of reach of children. For syrups, follow the pack instructions after opening.";
  }
  if (q.includes("order") || q.includes("purchase") || q.includes("ஆர்டர்")) {
    return lang === "ta"
      ? `${name}, உங்கள் சமீபத்திய வாங்குதலுக்குப் பிறகு 7 நாட்கள் ஆகிறது. மருத்துவர் அல்லது மருந்தாளரிடம் தொடர்ந்து ஆலோசனை பெறுவதற்கான நினைவூட்டலை அமைக்க விரும்புகிறீர்களா?`
      : `${name}, your medicine purchase was 7 days ago. Would you like to set a reminder to check with your doctor or pharmacist?`;
  }
  return lang === "ta"
    ? "நான் மருந்து நினைவூட்டல்கள், வாங்கிய பின் தொடர்பு, சேமிப்பு மற்றும் காலாவதி பற்றிய பொதுவான தகவல்களில் உதவ முடியும். மருத்துவ ஆலோசனைக்கு தகுதியான மருத்துவர் அல்லது மருந்தாளரை அணுகவும்."
    : "I can help with medicine reminders, purchase follow-ups, storage and expiry questions, and general medicine information. For medical advice, please speak to a qualified doctor or pharmacist.";
}

function AiFollowUp() {
  const { t, tx, lang } = useLang();
  const { user, reminders, addReminder, completeReminder } = useStore();
  const name = user?.name ?? tx("there", "நண்பரே");

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: tx(
        "Hello! I'm MediSave AI Follow-Up. I can set medicine reminders and answer general questions about your medicines. I don't diagnose or prescribe.",
        "வணக்கம்! நான் மெடிசேவ் AI பின்தொடர்தல். மருந்து நினைவூட்டல்களை அமைக்கவும், பொதுவான கேள்விகளுக்கு பதிலளிக்கவும் முடியும். நான் நோயறிதல் செய்வதில்லை.",
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [rType, setRType] = useState("");
  const [rDate, setRDate] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: reply(text, lang, name) }]);
    setInput("");
  }

  const suggestions = [
    tx("Set a reminder for my tablets", "எனது மாத்திரைகளுக்கு நினைவூட்டல் அமைக்கவும்"),
    tx("How should I store this syrup?", "இந்த சிரப்பை எப்படி சேமிக்க வேண்டும்?"),
    tx("Follow up on my last order", "எனது கடைசி ஆர்டரைப் பின்தொடரவும்"),
  ];

  return (
    <AppShell>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="flex min-h-[70vh] flex-col rounded-3xl border border-border bg-card">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-hero-gradient text-primary-foreground">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold">{t("aiTitle")}</h1>
                <p className="truncate text-xs text-muted-foreground">{t("aiSub")}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-2"}>
                {m.role === "assistant" && (
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary">
                    <Bot className="h-4 w-4 text-primary" />
                  </span>
                )}
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[85%] text-sm leading-relaxed"
                  }
                >
                  {m.text}
                </p>
                {m.role === "user" && (
                  <span className="ml-2 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary">
                    <User className="h-4 w-4 text-primary" />
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setMessages((m) => [...m, { role: "user", text: s }, { role: "assistant", text: reply(s, lang, name) }])
                  }
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("aiPlaceholder")}
                aria-label={t("aiPlaceholder")}
              />
              <Button type="submit" size="icon" aria-label={t("send")}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="flex items-start gap-2 rounded-2xl border-2 border-warning/50 bg-warning/12 p-4 text-xs text-warning-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {tx(
                "MediSave AI does not diagnose illnesses, prescribe medicines, or change dosages. Never stop a prescribed medicine without your doctor's advice.",
                "மெடிசேவ் AI நோயறிதல் செய்யாது, மருந்து பரிந்துரைக்காது, அளவை மாற்றாது. மருத்துவர் ஆலோசனை இல்லாமல் மருந்தை நிறுத்த வேண்டாம்.",
              )}
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">{t("addReminder")}</h2>
            <form
              className="mt-3 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!rType.trim() || !rDate) {
                  toast.error(t("required"));
                  return;
                }
                addReminder({
                  id: `rem-${Date.now()}`,
                  userId: user?.id ?? "guest",
                  reminderType: rType,
                  reminderDate: rDate,
                  language: lang,
                  status: "active",
                });
                setRType("");
                setRDate("");
                toast.success(tx("Reminder created.", "நினைவூட்டல் உருவாக்கப்பட்டது."));
              }}
            >
              <Input
                value={rType}
                onChange={(e) => setRType(e.target.value)}
                placeholder={tx("e.g. Take Metformin after dinner", "எ.கா. இரவு உணவுக்குப் பிறகு மெட்ஃபார்மின்")}
                aria-label={tx("Reminder type", "நினைவூட்டல் வகை")}
              />
              <Input type="date" value={rDate} onChange={(e) => setRDate(e.target.value)} aria-label={tx("Reminder date", "நினைவூட்டல் தேதி")} />
              <Button type="submit" className="w-full">
                <Bell className="h-4 w-4" /> {t("addReminder")}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">{t("followUpHistory")}</h2>
            <ul className="mt-3 space-y-2">
              {reminders.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  {tx("No reminders yet.", "இதுவரை நினைவூட்டல்கள் இல்லை.")}
                </li>
              )}
              {reminders.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{r.reminderType}</span>
                    <span className="block text-xs text-muted-foreground">
                      {r.reminderDate} · {r.language.toUpperCase()}
                    </span>
                  </span>
                  {r.status === "active" ? (
                    <Button size="sm" variant="ghost" onClick={() => completeReminder(r.id)}>
                      {tx("Done", "முடிந்தது")}
                    </Button>
                  ) : (
                    <span className="text-xs text-success">✓</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}