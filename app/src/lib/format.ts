/**
 * Money is always formatted with tabular numerals so columns line up to the
 * cent — see Borderless type system: IBM Plex Mono for data.
 */
export function fmtUSD(
  amount: number,
  opts: { sign?: boolean; compact?: boolean } = {}
) {
  const abs = Math.abs(amount);
  const value = opts.compact
    ? new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(abs)
    : new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(abs);

  const prefix =
    opts.sign && amount > 0 ? "+" : opts.sign && amount < 0 ? "−" : "";
  return `${prefix}$${value}`;
}

export function fmtUSDC(amount: number) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} USDC`;
}

export function fmtAED(amount: number) {
  return `AED ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function fmtPct(n: number, digits = 2) {
  return `${n.toFixed(digits)}%`;
}

export function fmtNum(n: number, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

export function shortHash(hash: string, head = 6, tail = 4) {
  if (hash.length <= head + tail + 1) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}

export function relativeTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} · ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
