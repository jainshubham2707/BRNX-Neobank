import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "brand" | "earn" | "warn" | "fail" | "muted";

const variants: Record<Variant, string> = {
  default: "bg-ink-100 text-ink-700",
  brand: "bg-brand-50 text-brand-700",
  earn: "bg-emerald/10 text-emerald",
  warn: "bg-amber/10 text-amber",
  fail: "bg-rose/10 text-rose",
  muted: "bg-ink-100 text-ink-500",
};

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

export function Chip({ variant = "default", className, ...rest }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
      {...rest}
    />
  );
}
