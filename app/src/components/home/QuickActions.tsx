import Link from "next/link";
import { cn } from "@/lib/cn";

type Action = {
  href: string;
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
};

const PLUS = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const CONVERT = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 9h13l-3-3M20 15H7l3 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const CARD = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="2" />
    <path d="M3 11h18" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const SEND = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12l16-8-6 16-2.5-6.5L4 12z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function QuickActions({ hasFiat }: { hasFiat: boolean }) {
  const actions: Action[] = hasFiat
    ? [
        { href: "/add-money", label: "Add money", icon: PLUS, primary: true },
        { href: "/convert", label: "Convert", icon: CONVERT },
        { href: "/cards", label: "Card", icon: CARD },
        { href: "/send", label: "Send", icon: SEND },
      ]
    : [
        { href: "/add-money", label: "Add money", icon: PLUS, primary: true },
        { href: "/cards", label: "Card", icon: CARD },
        { href: "/send", label: "Send", icon: SEND },
        { href: "/invest", label: "Invest", icon: CONVERT },
      ];

  return (
    <div className="grid grid-cols-4 gap-2.5 px-4">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className={cn(
            "flex flex-col items-center justify-center gap-2 py-3.5 rounded-2xl border border-ink-100 bg-white",
            "active:bg-brand-50 transition-colors"
          )}
        >
          <span
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              a.primary ? "bg-brand text-white" : "bg-brand-50 text-brand-700"
            )}
          >
            {a.icon}
          </span>
          <span className="text-[11.5px] font-semibold text-ink text-center leading-tight">
            {a.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
