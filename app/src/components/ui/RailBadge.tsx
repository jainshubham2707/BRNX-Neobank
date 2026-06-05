import type { Rail } from "@/lib/types";
import { cn } from "@/lib/cn";

type Variant = "solid" | "ghost";

export function RailBadge({
  rail,
  variant = "ghost",
  className,
}: {
  rail: Rail | "mixed";
  variant?: Variant;
  className?: string;
}) {
  const label =
    rail === "USD" ? "F" : rail === "USDC" ? "S" : "Convert";
  const palette =
    variant === "solid"
      ? rail === "USDC"
        ? "bg-deep text-white"
        : rail === "USD"
          ? "bg-brand text-white"
          : "bg-ink-800 text-white"
      : rail === "USDC"
        ? "bg-deep/10 text-deep"
        : rail === "USD"
          ? "bg-brand-50 text-brand-700"
          : "bg-ink-100 text-ink-700";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider",
        palette,
        className
      )}
    >
      {label}
    </span>
  );
}
