"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "subtle" | "dark" | "destructive";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-btn hover:bg-brand-600 active:bg-brand-700",
  ghost:
    "bg-surface text-brand-700 border border-brand-200 hover:bg-brand-50",
  subtle:
    "bg-brand-50 text-brand-700 hover:bg-brand-100",
  dark:
    "bg-deep text-white hover:bg-deep-700",
  destructive:
    "bg-rose text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-xl",
  md: "h-12 px-5 text-[15px] rounded-2xl",
  lg: "h-14 px-6 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", full, className, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-display font-semibold transition-colors",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        variants[variant],
        sizes[size],
        full && "w-full",
        className
      )}
      {...rest}
    />
  );
});
