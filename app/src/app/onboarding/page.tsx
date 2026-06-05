"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type Tier = "full" | "stablecoin";
type Step = "tier" | "id" | "selfie" | "screening" | "provisioning" | "done";

const FULL_STEPS: Step[] = ["tier", "id", "selfie", "screening", "provisioning", "done"];
const SC_STEPS: Step[] = ["tier", "selfie", "screening", "provisioning", "done"];

export default function OnboardingPage() {
  const [tier, setTier] = useState<Tier>("full");
  const [step, setStep] = useState<Step>("tier");

  const steps = tier === "full" ? FULL_STEPS : SC_STEPS;
  const idx = steps.indexOf(step);

  const next = () => {
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
  };

  return (
    <PhoneFrame>
      <div className="min-h-dvh flex flex-col bg-canvas">
        <header className="px-5 pt-11 pb-3 border-b border-ink-100 bg-white">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <span className="font-mono text-[11px] text-ink-500 tracking-widest uppercase">
              Step {idx + 1} of {steps.length}
            </span>
          </div>
          <div className="h-1.5 bg-ink-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
            />
          </div>
        </header>

        <div className="flex-1 px-6 py-7 flex flex-col">
          {step === "tier" && (
            <TierChoice
              tier={tier}
              onPick={(t) => {
                setTier(t);
                setStep(t === "full" ? "id" : "selfie");
              }}
            />
          )}
          {step === "id" && <IdCapture onNext={next} />}
          {step === "selfie" && <Selfie onNext={next} tier={tier} />}
          {step === "screening" && <Screening onNext={next} tier={tier} />}
          {step === "provisioning" && (
            <Provisioning onDone={next} tier={tier} />
          )}
          {step === "done" && <Done tier={tier} />}
        </div>
      </div>
    </PhoneFrame>
  );
}

function TierChoice({
  tier,
  onPick,
}: {
  tier: Tier;
  onPick: (t: Tier) => void;
}) {
  const [picked, setPicked] = useState<Tier>(tier);
  return (
    <>
      <h2 className="font-display font-bold text-[26px] tracking-tight leading-tight">
        How do you want to start?
      </h2>
      <p className="text-ink-500 mt-2 text-[14.5px]">
        Both options open the same app. Stablecoin-only is faster — you can
        upgrade to full access any time.
      </p>

      <div className="mt-6 space-y-3">
        <TierOption
          value="full"
          picked={picked}
          onClick={() => setPicked("full")}
          title="Full access"
          badge="Both rails"
          features={[
            "USD account (Partner Bank, virtual IBAN)",
            "Self-custody USDC wallet",
            "Fiat card + Stablecoin card",
            "US equities + tokenized assets",
          ]}
          duration="~3 min · Emirates ID required"
        />
        <TierOption
          value="stablecoin"
          picked={picked}
          onClick={() => setPicked("stablecoin")}
          title="Stablecoin only"
          badge="Faster start"
          features={[
            "Self-custody USDC wallet",
            "Stablecoin card (USDC→USD at spend)",
            "Tokenized assets + Earn",
            "Upgrade to add USD account any time",
          ]}
          duration="~1 min · Selfie only"
        />
      </div>

      <div className="mt-auto pt-6">
        <Button onClick={() => onPick(picked)} size="lg" full>
          Continue
        </Button>
      </div>
    </>
  );
}

function TierOption({
  value,
  picked,
  onClick,
  title,
  badge,
  features,
  duration,
}: {
  value: Tier;
  picked: Tier;
  onClick: () => void;
  title: string;
  badge: string;
  features: string[];
  duration: string;
}) {
  const selected = picked === value;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border bg-white p-4 transition-all",
        selected
          ? "border-brand ring-2 ring-brand-200 shadow-soft"
          : "border-ink-100"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-[16px] text-ink">
          {title}
        </span>
        <Chip variant={value === "stablecoin" ? "default" : "brand"}>{badge}</Chip>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[13px] text-ink-700">
            <span className="text-brand mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="text-[11.5px] font-mono uppercase tracking-wider text-ink-500 mt-3">
        {duration}
      </div>
    </button>
  );
}

function IdCapture({ onNext }: { onNext: () => void }) {
  return (
    <>
      <h2 className="font-display font-bold text-[26px] tracking-tight leading-tight">
        Scan your Emirates ID
      </h2>
      <p className="text-ink-500 mt-2 text-[14.5px]">
        We need this to open your USD account at the bank partner. Both rails go
        live together — never one without the other.
      </p>

      <div className="mt-7 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 aspect-[1.58] flex flex-col items-center justify-center text-center p-6">
        <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center mb-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="13" rx="2" stroke="#075ABD" strokeWidth="2"/>
            <path d="M3 11h18" stroke="#075ABD" strokeWidth="2"/>
            <rect x="6" y="14" width="5" height="2.5" rx="1" fill="#075ABD"/>
          </svg>
        </div>
        <div className="font-display font-semibold text-ink">Position your ID inside the frame</div>
        <div className="font-mono text-[11px] text-ink-500 tracking-widest mt-2">
          UAE EMIRATES ID · FRONT
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-7">
        <Button onClick={onNext} size="lg" full>
          Capture front and back
        </Button>
        <p className="text-[12px] text-ink-500 text-center">
          By continuing, you agree to share your ID with our KYC partner.
        </p>
      </div>
    </>
  );
}

function Selfie({ onNext, tier }: { onNext: () => void; tier: Tier }) {
  return (
    <>
      <h2 className="font-display font-bold text-[26px] tracking-tight leading-tight">
        Quick selfie check
      </h2>
      <p className="text-ink-500 mt-2 text-[14.5px]">
        {tier === "stablecoin"
          ? "A liveness check is all we need for stablecoin access. ~30 seconds."
          : "Confirms it's really you. Stays with our KYC partner."}
      </p>

      <div className="mt-8 self-center w-48 h-48 rounded-full border-4 border-brand bg-brand-50 flex items-center justify-center relative">
        <div className="absolute inset-2 rounded-full border border-dashed border-brand-300" />
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9" r="3.5" stroke="#054086" strokeWidth="1.8" />
          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke="#054086" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="font-mono text-[11px] text-center text-ink-500 tracking-widest mt-4">
        LIVENESS · ALIGN YOUR FACE
      </div>

      <div className="mt-auto pt-8">
        <Button onClick={onNext} size="lg" full>
          Looks good
        </Button>
      </div>
    </>
  );
}

function Screening({ onNext, tier }: { onNext: () => void; tier: Tier }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <h2 className="font-display font-bold text-[26px] tracking-tight leading-tight">
        Running checks
      </h2>
      <p className="text-ink-500 mt-2 text-[14.5px]">
        Sanctions, PEP, and risk screening — usually under a minute.
      </p>

      <ul className="mt-8 space-y-3">
        <CheckLine label="Identity verified" done={done} />
        <CheckLine label="Sanctions clear" done={done} delay={250} />
        <CheckLine label="PEP clear" done={done} delay={500} />
        <CheckLine label="Risk profile · Standard" done={done} delay={750} />
      </ul>

      <div className="mt-auto pt-10">
        <Button onClick={onNext} size="lg" full disabled={!done}>
          {done
            ? tier === "full"
              ? "Open both rails"
              : "Open my USDC wallet"
            : "Checking…"}
        </Button>
      </div>
    </>
  );
}

function CheckLine({
  label,
  done,
  delay = 0,
}: {
  label: string;
  done: boolean;
  delay?: number;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [done, delay]);
  return (
    <li className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl bg-white border border-ink-100">
      <span
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors",
          show ? "bg-emerald" : "bg-ink-300"
        )}
      >
        {show ? "✓" : ""}
      </span>
      <span className="text-[14px] font-semibold text-ink">{label}</span>
    </li>
  );
}

function Provisioning({
  onDone,
  tier,
}: {
  onDone: () => void;
  tier: Tier;
}) {
  const [usdReady, setUsdReady] = useState(tier === "stablecoin");
  const [usdcReady, setUsdcReady] = useState(false);

  useEffect(() => {
    if (tier === "full") {
      const t1 = setTimeout(() => setUsdReady(true), 900);
      return () => clearTimeout(t1);
    }
  }, [tier]);

  useEffect(() => {
    const t2 = setTimeout(() => setUsdcReady(true), tier === "full" ? 1700 : 1100);
    return () => clearTimeout(t2);
  }, [tier]);

  useEffect(() => {
    if (usdReady && usdcReady) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [usdReady, usdcReady, onDone]);

  return (
    <>
      <h2 className="font-display font-bold text-[26px] tracking-tight leading-tight">
        {tier === "full" ? "Opening both rails" : "Opening your USDC wallet"}
      </h2>
      <p className="text-ink-500 mt-2 text-[14.5px]">
        {tier === "full"
          ? "One identity, two accounts. They come up together — if either fails, neither goes live."
          : "Setting up your self-custody USDC wallet. You hold the keys."}
      </p>

      <div className="grid grid-cols-1 gap-3 mt-8">
        {tier === "full" && (
          <RailCard
            rail="USD"
            title="USD account"
            subtitle="Partner Bank · virtual IBAN"
            ready={usdReady}
          />
        )}
        <RailCard
          rail="USDC"
          title="USDC wallet"
          subtitle="Self-custodial"
          ready={usdcReady}
        />
      </div>

      <p className="mt-8 text-[12px] text-ink-500 text-center font-mono tracking-wide">
        {usdReady && usdcReady
          ? "READY"
          : "PROVISIONING…"}
      </p>
    </>
  );
}

function RailCard({
  rail,
  title,
  subtitle,
  ready,
}: {
  rail: "USD" | "USDC";
  title: string;
  subtitle: string;
  ready: boolean;
}) {
  return (
    <Card
      className={cn(
        "transition-colors",
        ready ? "border-emerald/40" : ""
      )}
    >
      <div className="flex items-center justify-between">
        <Chip variant={rail === "USD" ? "brand" : "default"}>
          {rail === "USD" ? "Fiat · USD" : "USDC"}
        </Chip>
        <span
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
            ready ? "bg-emerald" : "bg-ink-300"
          )}
        >
          {ready ? "✓" : <Spinner />}
        </span>
      </div>
      <div className="font-display font-bold text-[18px] mt-3 text-ink">{title}</div>
      <div className="text-[13px] text-ink-500 mt-0.5">{subtitle}</div>
    </Card>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="white" strokeOpacity="0.4" strokeWidth="3" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Done({ tier }: { tier: Tier }) {
  const router = useRouter();

  // On completion, set the persona server-side via cookie. New users land on
  // either the active (full) or stablecoin demo state.
  useEffect(() => {
    fetch("/api/persona", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: tier === "full" ? "active" : "stablecoin" }),
    }).catch(() => {});
  }, [tier]);

  return (
    <>
      <div className="self-center w-20 h-20 rounded-full bg-emerald flex items-center justify-center mt-8">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4.5 4.5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="font-display font-bold text-[28px] tracking-tight leading-tight text-center mt-6">
        You&apos;re in.
      </h2>
      <p className="text-ink-500 mt-2 text-[14.5px] text-center max-w-[300px] mx-auto">
        {tier === "full"
          ? "Both rails are live. Add some money to get started."
          : "Your USDC wallet is ready. Receive USDC to get going."}
      </p>
      <div className="mt-auto pt-8">
        <Button onClick={() => router.push("/home")} size="lg" full>
          Open BRNX
        </Button>
      </div>
    </>
  );
}
