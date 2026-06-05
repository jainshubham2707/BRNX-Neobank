import { cn } from "@/lib/cn";
import { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  mono?: boolean;
  className?: string;
};

export function KeyValue({ label, value, mono, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between py-3 border-b border-ink-100 last:border-0",
        className
      )}
    >
      <span className="text-[13px] text-ink-500">{label}</span>
      <span
        className={cn(
          "text-[14px] text-ink text-right font-semibold",
          mono && "font-mono tabular"
        )}
      >
        {value}
      </span>
    </div>
  );
}
