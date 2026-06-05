"use client";

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "auto" | "tall";
};

/**
 * Bottom sheet. Unmounted entirely when closed so its overlay never blocks
 * taps on the page below (e.g. the bottom TabBar).
 */
export function Sheet({ open, onClose, children, title, size = "auto" }: Props) {
  // `mounted` lags `open` so we can play the slide-out animation before
  // unmounting. While mounted but !open the panel is offscreen + non-interactive.
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Next frame, flip visible so transitions run.
      const r = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden={!open}
      className="absolute inset-0 z-40"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute left-0 right-0 bottom-0 bg-surface rounded-t-3xl shadow-lift transition-transform duration-200 ease-out",
          size === "tall" ? "max-h-[90%]" : "max-h-[85%]",
          visible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-center pt-2 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-ink-300" />
        </div>
        {title && (
          <div className="px-5 pt-2 pb-3 font-display text-lg font-bold text-ink">
            {title}
          </div>
        )}
        <div className="overflow-y-auto px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}
