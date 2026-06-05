import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
};

export function Card({ className, padded = true, ...rest }: Props) {
  return (
    <div
      className={cn(
        "bg-surface border border-ink-100 rounded-2xl shadow-soft",
        padded && "p-4",
        className
      )}
      {...rest}
    />
  );
}
