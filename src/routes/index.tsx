import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bot,
  ClipboardCheck,
  HeartHandshake,
  IndianRupee,
  PackageSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero-pharmacy.jpg";
import { AppShell } from "@/components/medisave/AppShell";
import { MedicineCard } from "@/components/medisave/MedicineCard";
import { StatusBadge, VerifiedBadge } from "@/components/medisave/Badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLang } from "@/lib/i18n";
import { useListableMedicines, useStore } from "@/lib/store";
import { discountPercent } from "@/lib/medisave-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediSave — Affordable Medicines from Verified Pharmacies" },
      {
        name: "description",
        content:
          "Find genuine medicines from verified pharmacies at affordable prices, especially medicines with shorter remaining shelf life.",
      },
      { property: "og:title", content: "MediSave — Affordable Medicines. Trusted Pharmacies." },
      {
        property: "og:description",
        content: "Verified pharmacies. Clear expiry dates. Up to 60% lower prices.",
      },
    ],
  }),
  component: Landing,
});

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Landing() {
  const { t, tx } = useLang();
  const navigate = useNavigate();
  const listable = useListableMedicines();
  const { pharmacies } = useStore();
  const [q, setQ] = useState("");

  const featured = [...listable]
    .sort(
      (a, b) =>
        discountPercent(b.originalPrice, b.discountedPrice) -
        discountPercent(a.originalPrice, a.discountedPrice),
    )
    .slice(0, 4);
  const verified = pharmacies.filter((p) => p.verificationStatus === "verified");

  const steps = [
    {
      Icon: ClipboardCheck,
      title: tx("Pharmacies get verified", "மருந்தகங்கள் சரிபார்க்கப்படுகின்றன"),
      body: tx(
        "Every pharmacy uploads its licence. Our team reviews it before any listing goes live.",
        "ஒவ்வொரு மருந்தகமும் உரிமத்தை பதிவேற்றுகிறது. பட்டியலிடும் முன் எங்கள் குழு சரிபார்க்கிறது.",
      ),
    },
    {
      Icon: PackageSearch,
      title: tx("Short shelf-life stock is listed", "குறுகிய கால மருந்துகள் பட்டியலிடப்படுகின்றன"),
      body: tx(
        "Genuine, sealed medicines nearing expiry are offered at a large discount with dates shown.",
        "காலாவதி நெருங்கும் உண்மையான மருந்துகள் தேதிகளுடன் பெரிய தள்ளுபடியில் வழங்கப்படுகின்றன.",
      ),
    },
    {
      Icon: IndianRupee,
      title: tx("You save on essentials", "நீங்கள் மிச்சம் பிடிக்கிறீர்கள்"),
      body: tx(
        "Compare MRP with the MediSave price, check the expiry, and reserve at a nearby pharmacy.",
        "MRP-யுடன் மெடிசேவ் விலையை ஒப்பிட்டு, காலாவதியை சரிபார்த்து, அருகிலுள்ள மருந்தகத்தில் முன்பதிவு செய்யுங்கள்.",
      ),
    },
    {
      Icon: Truck,
      title: tx("Collect and follow up", "பெற்று பின்தொடருங்கள்"),
      body: tx(
        "Pick up from the pharmacy and let MediSave AI remind you about doses and doctor follow-ups.",
        "மருந்தகத்தில் பெற்று, மருந்து மற்றும் மருத்துவர் பின்தொடர்தல் நினைவூட்டல்களை AI அளிக்கும்.",
      ),
    },
  ];

  const faqs = [
    {
      q: tx("Are short shelf-life medicines safe?", "குறுகிய கால மருந்துகள் பாதுகாப்பானவையா?"),
      a: tx(
        "Yes — they are genuine, sealed and within their expiry date. MediSave never allows expired medicines to be listed, and every pack shows its manufacturing and expiry date. Always check the pack before use.",
        "ஆம் — அவை உண்மையானவை, சீல் செய்யப்பட்டவை மற்றும் காலாவதிக்குள் உள்ளவை. காலாவதியான மருந்துகளை மெடிசேவ் ஒருபோதும் அனுமதிக்காது. பயன்படுத்தும் முன் பொதியை சரிபார்க்கவும்.",
      ),
    },
    {
      q: tx("Why are prices lower?", "விலை ஏன் குறைவாக உள்ளது?"),
      a: tx(
        "Pharmacies would otherwise have to destroy unsold stock close to expiry. Selling it early at a discount reduces waste and helps people who cannot afford full price.",
        "காலாவதி நெருங்கும் விற்காத மருந்துகளை மருந்தகங்கள் அழிக்க வேண்டியிருக்கும். முன்கூட்டியே தள்ளுபடியில் விற்பது வீணாவதைக் குறைக்கிறது.",
      ),
    },
    {
      q: tx("Do I need a prescription?", "மருத்துவ சீட்டு தேவையா?"),
      a: tx(
        "For medicines marked 'Prescription Required' yes — the pharmacy must see a valid prescription at collection. MediSave never bypasses this requirement.",
        "'மருத்துவ சீட்டு தேவை' எனக் குறிக்கப்பட்ட மருந்துகளுக்கு ஆம் — பெறும்போது மருந்தகம் சரியான சீட்டைப் பார்க்க வேண்டும்.",
      ),
    },
    {
      q: tx("Is my Aadhaar information safe?", "எனது ஆதார் தகவல் பாதுகாப்பானதா?"),
      a: tx(
        "We only store a verification result and a masked reference such as XXXX XXXX 1234. Full Aadhaar numbers and pharmacy licence documents are never shown publicly.",
        "நாங்கள் சரிபார்ப்பு முடிவையும் XXXX XXXX 1234 போன்ற மறைக்கப்பட்ட குறிப்பையும் மட்டுமே சேமிக்கிறோம். முழு ஆதார் எண்கள் பொதுவில் காட்டப்படாது.",
      ),
    },
  ];

  return (
    <AppShell>
      {/* HERO */}
      <section className="bg-soft-gradient">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-20">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-trust">
              <ShieldCheck className="h-3.5 w-3.5" /> {tx("Licence-verified pharmacies only", "உரிமம் சரிபார்க்கப்பட்ட மருந்தகங்கள் மட்டும்")}
            </span>
            <h1 className="text-3xl leading-tight font-bold sm:text-5xl">{t("tagline")}</h1>
            <p className="max-w-xl text-base text-muted-foreground">{t("heroIntro")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/medicines">{t("ctaFind")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register/pharmacy">{t("ctaRegisterPharmacy")}</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/get-started">{t("getStarted")}</Link>
              </Button>
            </div>
            <dl className="grid max-w-md grid-cols-3 gap-4 pt-2">
              {[
                [tx("Verified pharmacies", "சரிபார்க்கப்பட்ட மருந்தகங்கள்"), `${verified.length * 42}+`],
                [tx("Avg. saving", "சராசரி சேமிப்பு"), "54%"],
                [tx("Families helped", "உதவிய குடும்பங்கள்"), "18,400"],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-xl font-bold text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Pharmacist handing medicine to a customer"
              width={1600}
              height={1104}
              className="rounded-3xl object-cover shadow-[var(--shadow-lift)]"
            />
            <div className="absolute bottom-4 left-4 rounded-2xl border border-border bg-card/95 p-3 backdrop-blur">
              <VerifiedBadge />
              <p className="mt-1 text-xs text-muted-foreground">
                {tx("Every listing shows batch, mfg & expiry", "ஒவ்வொரு பட்டியலிலும் தொகுதி, தயாரிப்பு & காலாவதி")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-auto -mt-6 max-w-4xl px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/medicines", search: { q } });
          }}
          className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 px-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("search")}
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" size="lg">
            {t("search")}
          </Button>
        </form>
      </section>

      {/* HOW IT WORKS */}
      <Section
        id="how-it-works"
        title={t("howItWorks")}
        subtitle={tx(
          "A simple, supervised path from pharmacy shelf to the people who need it most.",
          "மருந்தக அலமாரியிலிருந்து தேவைப்படுபவர்களுக்கு எளிய, கண்காணிக்கப்பட்ட வழி.",
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ Icon, title, body }, i) => (
            <div key={title} className="card-lift rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* AFFORDABLE MEDICINES */}
      <Section
        title={t("affordableMedicines")}
        subtitle={tx(
          "Live listings from verified pharmacies, sorted by biggest saving.",
          "சரிபார்க்கப்பட்ட மருந்தகங்களின் நேரடி பட்டியல்கள், அதிக சேமிப்பின்படி.",
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => (
            <MedicineCard key={m.id} medicine={m} />
          ))}
        </div>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link to="/medicines">{t("browse")}</Link>
          </Button>
        </div>
      </Section>

      {/* VERIFIED PHARMACIES */}
      <Section
        title={t("verifiedPharmacies")}
        subtitle={tx(
          "Licence checked by our verification team before any medicine goes live.",
          "எந்த மருந்தும் நேரலைக்கு வரும் முன் உரிமம் எங்கள் குழுவால் சரிபார்க்கப்படுகிறது.",
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verified.map((p) => (
            <Link
              key={p.id}
              to="/pharmacies/$id"
              params={{ id: p.id }}
              className="card-lift rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Store className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold">{p.pharmacyName}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.city}, {p.state}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={p.verificationStatus} />
                <span className="text-xs text-muted-foreground">★ {p.rating.toFixed(1)}</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* FOR PATIENTS / PHARMACIES / HOW IT HELPS */}
      <Section title={t("howItHelps")}>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{t("forPatients")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• {tx("Cut monthly medicine bills by half", "மாதாந்திர மருந்து செலவை பாதியாகக் குறைக்கவும்")}</li>
              <li>• {tx("See expiry and shelf life before you buy", "வாங்கும் முன் காலாவதி மற்றும் கால அவகாசம்")}</li>
              <li>• {tx("Reserve at a verified pharmacy near you", "அருகிலுள்ள சரிபார்க்கப்பட்ட மருந்தகத்தில் முன்பதிவு")}</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Store className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{t("forPharmacies")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• {tx("Recover value from short-dated stock", "குறுகிய கால சரக்கிலிருந்து மதிப்பை மீட்கவும்")}</li>
              <li>• {tx("Reduce medicine wastage", "மருந்து வீணாவதைக் குறைக்கவும்")}</li>
              <li>• {tx("Reach new customers in your city", "உங்கள் நகரில் புதிய வாடிக்கையாளர்களை அடையவும்")}</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{t("whyChoose")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• {tx("Licence verification by admins", "நிர்வாகிகளால் உரிம சரிபார்ப்பு")}</li>
              <li>• {tx("Expired listings blocked automatically", "காலாவதியான பட்டியல்கள் தானாக தடுக்கப்படும்")}</li>
              <li>• {tx("Bilingual: English & தமிழ்", "இருமொழி: English & தமிழ்")}</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* AI FOLLOW-UP */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid items-center gap-6 rounded-3xl bg-hero-gradient p-8 text-primary-foreground lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
              <Bot className="h-3.5 w-3.5" /> {t("aiTitle")}
            </span>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              {tx(
                "Reminders and answers, in English or தமிழ்",
                "நினைவூட்டல்களும் பதில்களும், ஆங்கிலம் அல்லது தமிழில்",
              )}
            </h2>
            <p className="mt-2 max-w-xl text-sm opacity-90">
              {tx(
                "MediSave AI helps with dose reminders, purchase follow-ups and general medicine information. It never diagnoses, prescribes or changes your dosage.",
                "மெடிசேவ் AI மருந்து நினைவூட்டல், வாங்கிய பின் தொடர்பு மற்றும் பொதுவான மருந்து தகவலுக்கு உதவும். இது நோயறிதல் செய்யாது, மருந்து பரிந்துரைக்காது.",
              )}
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-5">
              <Link to="/ai">{t("aiFollowUp")}</Link>
            </Button>
          </div>
          <div className="space-y-3 rounded-2xl bg-card p-4 text-card-foreground">
            <p className="rounded-xl bg-secondary p-3 text-sm">
              {tx(
                "Your medicine purchase was 7 days ago. Would you like to set a reminder to check with your doctor or pharmacist?",
                "நீங்கள் மருந்தை வாங்கி 7 நாட்கள் ஆகிறது. மருத்துவர் அல்லது மருந்தாளரிடம் ஆலோசனை பெற நினைவூட்டல் வேண்டுமா?",
              )}
            </p>
            <p className="ml-auto max-w-[80%] rounded-xl bg-primary p-3 text-sm text-primary-foreground">
              {tx("Yes, remind me on Sunday morning.", "ஆம், ஞாயிறு காலை நினைவூட்டுங்கள்.")}
            </p>
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <Section
        id="safety"
        title={t("safety")}
        subtitle={tx(
          "Trust is the product. Here is exactly what we check.",
          "நம்பிக்கையே எங்கள் அடிப்படை. நாங்கள் சரிபார்ப்பவை இதோ.",
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [tx("Licence review", "உரிம மதிப்பாய்வு"), tx("Admins review every uploaded pharmacy licence before approval.", "ஒவ்வொரு உரிமமும் ஒப்புதலுக்கு முன் நிர்வாகிகளால் சரிபார்க்கப்படும்.")],
            [tx("No expired stock", "காலாவதி இல்லை"), tx("The system blocks any listing with a past expiry date.", "கடந்த காலாவதி தேதி உள்ள பட்டியல்கள் தடுக்கப்படும்.")],
            [tx("Prescription enforced", "சீட்டு கட்டாயம்"), tx("Rx medicines are clearly flagged and cannot be bypassed.", "Rx மருந்துகள் தெளிவாக குறிக்கப்படும்; தவிர்க்க முடியாது.")],
            [tx("Private identity data", "தனிப்பட்ட தரவு"), tx("Aadhaar is masked and licence documents stay admin-only.", "ஆதார் மறைக்கப்படும்; ஆவணங்கள் நிர்வாகிக்கு மட்டும்.")],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-5">
              <ShieldCheck className="h-5 w-5 text-success" />
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" title={t("faq")}>
        <Accordion type="single" collapsible className="max-w-3xl">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </AppShell>
  );
}
