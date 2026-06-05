"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const tabs: Tab[] = [
  {
    href: "/home",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8.5z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/cards",
    label: "Cards",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="6"
          width="18"
          height="13"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M3 11h18" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: "/invest",
    label: "Invest",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 17l5-5 4 4 7-8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 8h6v6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/earn",
    label: "Earn",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M14.5 9.5a2.5 2.5 0 0 0-5 0c0 1.5 1.5 2 2.5 2s2.5.5 2.5 2a2.5 2.5 0 0 1-5 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 6.5v11"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="9"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function TabBar() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="sticky bottom-0 z-30 bg-surface/95 backdrop-blur border-t border-ink-100 pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5">
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active =
            pathname === t.href || pathname.startsWith(t.href + "/");
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                prefetch={false}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-1.5 px-1",
                  "text-[10px] font-semibold transition-colors touch-manipulation select-none",
                  active ? "text-brand-700" : "text-ink-500 hover:text-ink-700"
                )}
              >
                {t.icon}
                <span className="leading-none truncate">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
