import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "./Brand";
import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t, tx } = useLang();
  return (
    <footer id="contact" className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Brand />
          <p className="text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("medicines")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/medicines" className="hover:text-foreground">{t("browse")}</Link></li>
            <li><Link to="/pharmacies" className="hover:text-foreground">{t("verifiedPharmacies")}</Link></li>
            <li><Link to="/ai" className="hover:text-foreground">{t("aiFollowUp")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("forPharmacies")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/register/pharmacy" className="hover:text-foreground">{t("ctaRegisterPharmacy")}</Link></li>
            <li><Link to="/pharmacy" className="hover:text-foreground">{t("dashboard")}</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">{t("admin")}</Link></li>
          </ul>
        </div>
        <div id="contact-us">
          <h3 className="mb-3 text-sm font-semibold">{t("contact")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> support@medisave.health</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> 1800 200 4567</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {tx("Chennai, Tamil Nadu, India", "சென்னை, தமிழ்நாடு, இந்தியா")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5">
        <p className="mx-auto max-w-7xl text-xs text-muted-foreground">{t("disclaimer")}</p>
      </div>
    </footer>
  );
}