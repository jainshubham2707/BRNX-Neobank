"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona, useUser } from "@/lib/persona-store";
import { PERSONA_KEYS, PERSONAS } from "@/lib/mock-data/personas";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();
  const { personaKey, setPersonaKey } = usePersona();
  const [exporting, setExporting] = useState(false);
  const [revealedKey, setRevealedKey] = useState(false);

  const signOut = async () => {
    await fetch("/api/persona", { method: "DELETE" });
    router.push("/signin");
  };

  return (
    <>
      <TopBar title="Profile" back="/home" />
      <div className="px-4 space-y-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand text-white inline-flex items-center justify-center font-display font-bold">
              {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-[16px] text-ink truncate">
                {user.name}
              </div>
              <div className="text-[12.5px] text-ink-500 font-mono tabular">
                {user.phone}
              </div>
            </div>
            <Chip variant={user.kycTier === "enhanced" ? "earn" : "brand"}>
              KYC · {user.kycTier === "enhanced" ? "Enhanced" : "Standard"}
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <AccessTile
              label="Fiat rail"
              on={user.productAccess.fiat}
            />
            <AccessTile
              label="Stablecoin rail"
              on={user.productAccess.stablecoin}
            />
          </div>

          {!user.productAccess.fiat && (
            <Button full variant="subtle" className="mt-3">
              Upgrade to add USD account
            </Button>
          )}
        </Card>

        <Section title="Security" className="px-0">
          <Card padded={false}>
            <Row label="Device" value="iPhone 15 · this device" />
            <Row label="Login OTP" value="On" />
            <Row label="Withdrawal allow-list" value="Off" trailing="Edit" />
            <Row
              label="Wallet recovery"
              value="Password + OTP"
              trailing="Manage"
            />
            <button
              onClick={() => {
                setExporting(true);
                setRevealedKey(false);
              }}
              className="w-full text-left flex items-center justify-between py-3.5 px-4 active:bg-brand-50/40"
            >
              <span className="text-[14px] text-ink font-semibold">
                Export private key
              </span>
              <span className="text-[12px] text-rose font-semibold">
                Self-custody
              </span>
            </button>
          </Card>
        </Section>

        <Section title="Account" className="px-0">
          <Card padded={false}>
            <Link
              href="/activity"
              className="w-full flex items-center justify-between gap-3 py-3 px-4 border-b border-ink-100 active:bg-brand-50/40"
            >
              <span className="text-[13.5px] text-ink-700">Activity</span>
              <span className="text-[13.5px] text-ink text-right font-semibold">
                View transactions
                <span className="ml-2 text-ink-500">›</span>
              </span>
            </Link>
            <Row label="Email" value={user.email} />
            <Row
              label="Emirates ID"
              value={user.emiratesId}
              mono
            />
            <Row label="Member since" value={new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })} />
            <Row label="Statements" value="Combined + per-rail" trailing="Export" />
          </Card>
        </Section>

        {user.productAccess.stablecoin && (
          <Section title="USDC wallet" className="px-0">
            <Card padded={false}>
              <Row label="Address" value={user.usdcWallet.address} mono />
              <Row label="Custody" value="Self-custodial · password + OTP" />
            </Card>
          </Section>
        )}

        <Section title="Switch account" className="px-0">
          <Card padded={false}>
            {PERSONA_KEYS.map((key) => {
              const p = PERSONAS[key];
              const active = key === personaKey;
              return (
                <button
                  key={key}
                  onClick={() => setPersonaKey(key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 border-b border-ink-100 last:border-0 text-left",
                    "active:bg-brand-50/40 transition-colors"
                  )}
                >
                  <span
                    className={cn(
                      "w-9 h-9 rounded-full inline-flex items-center justify-center font-display font-bold text-[12px]",
                      active ? "bg-brand text-white" : "bg-brand-50 text-brand-700"
                    )}
                  >
                    {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-[14px] text-ink truncate">
                      {p.name}
                    </div>
                    <div className="text-[12px] text-ink-500 truncate">
                      {p.productAccess.fiat ? "Both rails" : "Stablecoin only"}
                      {key === "power" && " · futures + earn"}
                    </div>
                  </div>
                  {active && <Chip variant="brand">Active</Chip>}
                </button>
              );
            })}
          </Card>
        </Section>

        <Section title="App" className="px-0">
          <Card padded={false}>
            <Row label="Notifications" value="On" />
            <Row label="Region" value="UAE" />
            <Row label="Version" value="0.1.0 · mock" mono />
            <Link
              href="/start"
              onClick={signOut}
              className="block w-full text-left py-3.5 px-4 active:bg-brand-50/40"
            >
              <span className="text-[14px] text-rose font-semibold">Sign out</span>
            </Link>
          </Card>
        </Section>

        <div className="h-6" />
      </div>

      <Sheet
        open={exporting}
        onClose={() => setExporting(false)}
        title="Export private key"
        size="tall"
      >
        <Card className="bg-rose/5 border-rose/30">
          <div className="font-display font-semibold text-rose text-[14px]">
            Read this before continuing
          </div>
          <ul className="mt-2 space-y-1.5 text-[13px] text-ink-700 leading-snug">
            <li>• Anyone with this key controls your USDC. We can&apos;t recover it.</li>
            <li>• Never paste it into a website, chat, or photo backup.</li>
            <li>• Write it on paper or use a hardware wallet.</li>
          </ul>
        </Card>

        <Card className="mt-4">
          <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
            Private key (mock)
          </div>
          <div className="mt-2 font-mono tabular text-[12.5px] text-ink break-all p-3 bg-ink-100 rounded-xl">
            {revealedKey
              ? "0xMOCKE0xMOCKE0xMOCKE0xMOCKE0xMOCKE0xMOCKE0xMOCKE0xMOCKE0xMOCKE0xMOCKE"
              : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
          </div>
        </Card>

        <Button
          full
          size="lg"
          className="mt-4"
          variant={revealedKey ? "ghost" : "destructive"}
          onClick={() => setRevealedKey((v) => !v)}
        >
          {revealedKey ? "Hide key" : "Reveal — I take the risk"}
        </Button>
      </Sheet>
    </>
  );
}

function AccessTile({ label, on }: { label: string; on: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5",
        on ? "bg-brand-50/50 border-brand-200" : "bg-ink-100/50 border-ink-100"
      )}
    >
      <div className="text-[11px] uppercase tracking-wider text-ink-500 font-mono">
        {label}
      </div>
      <div className="font-display font-bold text-[14px] mt-0.5 text-ink">
        {on ? "Active" : "Not active"}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  trailing,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  trailing?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 border-b border-ink-100 last:border-0">
      <span className="text-[13.5px] text-ink-700">{label}</span>
      <span
        className={cn(
          "text-[13.5px] text-ink text-right font-semibold truncate max-w-[55%]",
          mono && "font-mono tabular"
        )}
      >
        {value}
      </span>
      {trailing && (
        <span className="text-[12px] text-brand-700 font-semibold">{trailing}</span>
      )}
    </div>
  );
}
