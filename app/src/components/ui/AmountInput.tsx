"use client";

import { cn } from "@/lib/cn";

type Props = {
  value: string;
  onChange: (v: string) => void;
  symbol?: string;
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
};

export function AmountInput({
  value,
  onChange,
  symbol = "$",
  className,
  autoFocus,
  placeholder = "0.00",
}: Props) {
  const isWord = symbol.length > 1;
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-display font-bold text-ink-300 leading-none",
          isWord
            ? "text-[18px] tracking-wider uppercase"
            : "text-[44px]"
        )}
      >
        {symbol}
      </span>
      <input
        inputMode="decimal"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d.]/g, "");
          const parts = v.split(".");
          if (parts.length > 2) return;
          onChange(v);
        }}
        placeholder={placeholder}
        className="font-display font-bold text-[56px] leading-none text-ink bg-transparent outline-none w-full tabular tracking-tight placeholder:text-ink-300"
      />
    </div>
  );
}
