"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  title?: string;
  /** Show a back button. `true` calls router.back(). A path string navigates
   *  to that route instead (use this on tab pages to point back at /home). */
  back?: boolean | string;
  right?: ReactNode;
  variant?: "light" | "dark";
};

export function TopBar({ title, back, right, variant = "light" }: Props) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof back === "string") router.push(back);
    else router.back();
  };
  return (
    <header
      className={cn(
        // pt-11 reserves space behind the dynamic-island notch (chrome on
        // desktop / real notch on mobile via safe-area-inset-top).
        "px-4 pt-11 sticky top-0 z-20",
        variant === "light"
          ? "bg-canvas/95 backdrop-blur border-b border-ink-100"
          : "bg-transparent text-white"
      )}
    >
      <div className="h-14 flex items-center gap-3">
        {back && (
          <button
            onClick={handleBack}
            aria-label="Back"
            className={cn(
              "w-9 h-9 -ml-2 rounded-full inline-flex items-center justify-center",
              variant === "light"
                ? "text-ink-700 hover:bg-ink-100"
                : "text-white/90 hover:bg-white/10"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <h1
          className={cn(
            "font-display font-semibold text-[17px] flex-1 truncate tracking-tight",
            variant === "light" ? "text-ink" : "text-white"
          )}
        >
          {title}
        </h1>
        <div className="ml-auto flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
