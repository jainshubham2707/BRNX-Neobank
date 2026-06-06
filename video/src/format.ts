export function fmtUSD(n: number, opts: { sign?: boolean } = {}) {
  const abs = Math.abs(n);
  const v = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  const prefix =
    opts.sign && n > 0 ? "+" : opts.sign && n < 0 ? "−" : n < 0 ? "−" : "";
  return `${prefix}$${v}`;
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
