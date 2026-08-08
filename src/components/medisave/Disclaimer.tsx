import { Info } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function Disclaimer() {
  const { t } = useLang();
  return (
    <p className="flex items-start gap-2 rounded-xl border border-border bg-surface p-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-trust" aria-hidden />
      <span>{t("disclaimer")}</span>
    </p>
  );
}