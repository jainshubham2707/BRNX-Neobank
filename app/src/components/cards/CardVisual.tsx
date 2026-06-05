import type { Card as CardType } from "@/lib/types";
import { Mark } from "@/components/brand/Mark";
import { cn } from "@/lib/cn";

type Props = {
  card: CardType;
  /** Cardholder name shown on the card front. */
  holderName: string;
  size?: "sm" | "md" | "lg";
  revealed?: boolean;
};

const fakePan = (last4: string) =>
  `4242 0011 ${last4.slice(0, 2)}45 ${last4}`;

export function CardVisual({
  card,
  holderName,
  size = "md",
  revealed,
}: Props) {
  const ratio = { sm: "h-32", md: "h-48", lg: "h-56" }[size];
  const isCrypto = card.rail === "USDC";
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl overflow-hidden shadow-lift",
        ratio,
        isCrypto
          ? "bg-gradient-to-br from-deep-900 via-deep to-brand"
          : "bg-gradient-to-br from-brand-800 via-brand-600 to-brand-400",
        card.frozen && "opacity-80"
      )}
    >
      {/* Decorative shape */}
      <div className="absolute -right-10 -top-10 opacity-20">
        <Mark size={200} knockout twoTone={false} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(220px 220px at 95% 10%, rgba(34,211,238,.22), transparent 60%)",
        }}
      />

      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between">
          <div className="font-display font-semibold text-[15px] tracking-tight leading-tight uppercase">
            {holderName}
          </div>
          <Mark size={22} knockout />
        </div>

        <div>
          <div className="font-mono tabular text-[14.5px] tracking-widest">
            {revealed
              ? fakePan(card.last4)
              : `•••• •••• •••• ${card.last4}`}
          </div>
          <div className="flex items-end justify-between mt-2">
            <div className="text-[11px] font-mono uppercase tracking-widest opacity-80">
              {String(card.expMonth).padStart(2, "0")}/{card.expYear}
            </div>
            <div className="font-display font-bold text-[16px] italic tracking-tight">
              VISA
            </div>
          </div>
        </div>
      </div>

      {card.frozen && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-3 py-1 rounded-full bg-white/90 text-brand-800 text-[11.5px] font-display font-bold uppercase tracking-widest">
            Frozen
          </span>
        </div>
      )}
    </div>
  );
}
