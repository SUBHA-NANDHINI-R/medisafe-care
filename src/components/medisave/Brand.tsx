import { Link } from "@tanstack/react-router";
import logo from "@/assets/medisave-logo.png";
import { useLang } from "@/lib/i18n";

export function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2">
      <img
        src={logo}
        alt="MediSave logo"
        width={512}
        height={512}
        className="h-9 w-9 shrink-0 rounded-xl bg-accent/60 p-1"
      />
      <span className="min-w-0">
        <span className="block truncate font-display text-lg leading-tight font-semibold">
          {t("brand")}
        </span>
        {!compact && (
          <span className="block text-[11px] leading-tight text-muted-foreground">
            Verified medicines, lower prices
          </span>
        )}
      </span>
    </Link>
  );
}