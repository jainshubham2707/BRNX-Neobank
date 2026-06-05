import { cn } from "@/lib/cn";
import { fmtUSD } from "@/lib/format";

type Props = {
  value: number;
  sign?: boolean;
  className?: string;
  /** When true, displays the value with directional color (green/red) */
  colored?: boolean;
  compact?: boolean;
};

/**
 * Money is always tabular monospace per brand spec — digits line up so
 * columns of amounts read as a clean ladder.
 */
export function Money({ value, sign, className, colored, compact }: Props) {
  const color =
    colored && value > 0
      ? "text-emerald"
      : colored && value < 0
        ? "text-rose"
        : "";
  return (
    <span
      className={cn(
        "font-mono tabular font-semibold",
        color,
        className
      )}
    >
      {fmtUSD(value, { sign, compact })}
    </span>
  );
}
