import { TxStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const labels: Record<TxStatus, string> = {
  pending: "Pending",
  settling: "Settling",
  settled: "Settled",
  failed: "Failed",
};

const styles: Record<TxStatus, string> = {
  pending: "bg-amber/10 text-amber",
  settling: "bg-brand-50 text-brand-700",
  settled: "bg-emerald/10 text-emerald",
  failed: "bg-rose/10 text-rose",
};

const dots: Record<TxStatus, string> = {
  pending: "bg-amber",
  settling: "bg-brand-500",
  settled: "bg-emerald",
  failed: "bg-rose",
};

export function StatusPill({
  status,
  className,
}: {
  status: TxStatus;
  className?: string;
}) {
  const animated = status === "settling" || status === "pending";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        styles[status],
        className
      )}
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            animated && "animate-ping",
            dots[status]
          )}
        />
        <span
          className={cn(
            "relative inline-flex rounded-full h-1.5 w-1.5",
            dots[status]
          )}
        />
      </span>
      {labels[status]}
    </span>
  );
}
