import { AlertTriangle, BadgeCheck, CircleSlash, FileText, ShieldCheck } from "lucide-react";
import { shelfStatus, type VerificationStatus } from "@/lib/medisave-data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-trust/10 px-2 py-0.5 text-[11px] font-semibold text-trust",
        className,
      )}
    >
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> {t("verifiedPharmacy")}
    </span>
  );
}

export function StatusBadge({ status }: { status: VerificationStatus }) {
  const { t } = useLang();
  const map = {
    verified: { label: t("verified"), cls: "bg-success/12 text-success", Icon: ShieldCheck },
    under_review: { label: t("underReview"), cls: "bg-warning/20 text-warning-foreground", Icon: FileText },
    pending: { label: t("pending"), cls: "bg-muted text-muted-foreground", Icon: FileText },
    rejected: { label: t("rejected"), cls: "bg-danger/12 text-danger", Icon: CircleSlash },
  } as const;
  const { label, cls, Icon } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", cls)}>
      <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
    </span>
  );
}

export function ExpiryBadge({ expiryDate }: { expiryDate: string }) {
  const { t } = useLang();
  const status = shelfStatus(expiryDate);
  if (status === "expired")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger/12 px-2 py-0.5 text-[11px] font-semibold text-danger">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> {t("expired")}
      </span>
    );
  if (status === "expiring")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning/25 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> {t("expiringSoon")}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-semibold text-success">
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> {t("available")}
    </span>
  );
}

export function RxBadge({ required }: { required: boolean }) {
  const { t } = useLang();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        required ? "bg-danger/10 text-danger" : "bg-secondary text-secondary-foreground",
      )}
    >
      {required ? "Rx" : "OTC"} · {required ? t("prescriptionRequired") : t("noPrescription")}
    </span>
  );
}