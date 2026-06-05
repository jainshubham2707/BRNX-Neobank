"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { AmountInput } from "@/components/ui/AmountInput";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona, useUser } from "@/lib/persona-store";
import { fmtNum, fmtUSD } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Rail } from "@/lib/types";

const WIRE_FEE = 4.0; // flat SWIFT fee, in USD
const CONVERT_RATE = 0.9992; // USDC → USD when off-ramping via partner

export default function SendBankPage() {
  const router = useRouter();
  const user = useUser();
  const { refresh } = usePersona();

  // Stablecoin-only users still arrive here from /send via the USDC option,
  // but they have no USD balance — preselect USDC as the source.
  const [sourceRail, setSourceRail] = useState<Rail>(
    user.productAccess.fiat ? "USD" : "USDC"
  );

  useEffect(() => {
    if (!user.productAccess.fiat && sourceRail === "USD") {
      setSourceRail("USDC");
    }
  }, [user.productAccess.fiat, sourceRail]);

  const usdBalance = user.usdAccount?.balance ?? 0;
  const usdcBalance = user.usdcWallet.balance;

  const [amount, setAmount] = useState("250");
  const [beneficiary, setBeneficiary] = useState("");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [memo, setMemo] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [stage, setStage] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const amountNum = Number(amount) || 0;
  const totalUsd = amountNum + WIRE_FEE;
  const debitInSource =
    sourceRail === "USD" ? totalUsd : totalUsd / CONVERT_RATE;
  const sourceBalance = sourceRail === "USD" ? usdBalance : usdcBalance;
  const insufficient = debitInSource > sourceBalance;

  const formValid =
    beneficiary.trim().length >= 2 &&
    iban.trim().length >= 6 &&
    swift.trim().length >= 6 &&
    amountNum > 0 &&
    !insufficient;

  const submit = async () => {
    setStage("submitting");
    setErrMsg(null);
    const r = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceRail,
        amount: amountNum,
        beneficiary: beneficiary.trim(),
        destination: iban.trim(),
        swift: swift.trim(),
        memo: memo.trim() || undefined,
      }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setErrMsg(data.error ?? "Send failed");
      setStage("error");
      return;
    }
    await refresh();
    setStage("done");
  };

  return (
    <>
      <TopBar title="Send to bank" back />
      <div className="px-4 py-2 space-y-3">
        {/* Source toggle */}
        {user.productAccess.fiat ? (
          <div className="grid grid-cols-2 gap-1 p-1 bg-ink-100 rounded-2xl">
            {(["USD", "USDC"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSourceRail(r)}
                className={cn(
                  "py-2 rounded-xl text-[13px] font-display font-semibold transition-colors",
                  sourceRail === r
                    ? "bg-surface text-ink shadow-soft"
                    : "text-ink-500"
                )}
              >
                From {r}
              </button>
            ))}
          </div>
        ) : null}

        {/* Source summary */}
        <Card className="bg-brand-50/40 border-brand-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-ink-500 font-mono">
                From
              </div>
              <div className="font-display font-semibold text-[14.5px] text-ink mt-0.5">
                {sourceRail === "USD" ? "USD account" : "USDC wallet"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10.5px] uppercase tracking-wider text-ink-500 font-mono">
                Available
              </div>
              <div className="font-mono tabular text-[14px] font-semibold text-ink mt-0.5">
                {sourceRail === "USD"
                  ? fmtUSD(usdBalance)
                  : `${fmtNum(usdcBalance)} USDC`}
              </div>
            </div>
          </div>
        </Card>

        {/* Beneficiary */}
        <Card padded={false} className="p-4 space-y-3">
          <div className="text-[10.5px] uppercase tracking-wider text-ink-500 font-mono">
            Beneficiary
          </div>
          <FieldInput
            label="Name"
            value={beneficiary}
            onChange={setBeneficiary}
            placeholder="Account holder full name"
          />
          <FieldInput
            label="IBAN / account number"
            value={iban}
            onChange={(v) => setIban(v.toUpperCase())}
            placeholder="AE07 0331 2345 6789 0123 456"
            mono
          />
          <FieldInput
            label="SWIFT / BIC"
            value={swift}
            onChange={(v) => setSwift(v.toUpperCase())}
            placeholder="EBILAEAD"
            mono
          />
          <FieldInput
            label="Reference (optional)"
            value={memo}
            onChange={setMemo}
            placeholder="What's it for?"
          />
        </Card>

        {/* Amount — always in USD (what beneficiary receives) */}
        <Card>
          <div className="text-[10.5px] uppercase tracking-wider text-ink-500 font-mono">
            Amount to send
          </div>
          <AmountInput value={amount} onChange={setAmount} />
          <div className="text-[12px] text-ink-500 mt-1.5 leading-snug">
            Wire fee {fmtUSD(WIRE_FEE)} · You&apos;ll be debited{" "}
            <span className="font-mono tabular text-ink">
              {sourceRail === "USD"
                ? fmtUSD(debitInSource)
                : `${fmtNum(debitInSource)} USDC`}
            </span>
            {sourceRail === "USDC" && (
              <>
                {" "}
                <span className="text-ink-500/80">
                  (@ {CONVERT_RATE.toFixed(4)})
                </span>
              </>
            )}
          </div>
        </Card>

        {insufficient && (
          <div className="text-rose text-[13px] font-semibold px-1">
            Not enough {sourceRail} for amount + fee.
          </div>
        )}

        <Button
          full
          size="lg"
          onClick={() => setConfirming(true)}
          disabled={!formValid}
        >
          Review send
        </Button>

        <div className="h-6" />
      </div>

      <Sheet
        open={confirming}
        onClose={() => {
          if (stage === "done") {
            setConfirming(false);
            router.replace("/activity");
          } else if (stage !== "submitting") {
            setConfirming(false);
            setStage("idle");
          }
        }}
        title={
          stage === "done"
            ? "Sent"
            : stage === "submitting"
              ? "Submitting"
              : "Confirm wire"
        }
      >
        {stage === "idle" && (
          <>
            <div className="text-[12px] text-ink-500 font-mono tracking-wider uppercase">
              Beneficiary receives
            </div>
            <div className="font-display font-extrabold text-[36px] tabular text-ink leading-none mt-1">
              {fmtUSD(amountNum)}{" "}
              <span className="text-ink-500 text-[18px]">USD</span>
            </div>

            <Card padded={false} className="px-4 mt-5">
              <KeyValue label="To" value={beneficiary} />
              <KeyValue label="IBAN" value={iban} mono />
              <KeyValue label="SWIFT / BIC" value={swift} mono />
              {memo && <KeyValue label="Reference" value={memo} />}
              <KeyValue
                label="Source"
                value={sourceRail === "USD" ? "USD account" : "USDC wallet"}
              />
              <KeyValue label="Wire fee" value={fmtUSD(WIRE_FEE)} mono />
              {sourceRail === "USDC" && (
                <KeyValue
                  label="Rate"
                  value={`1 USDC = ${CONVERT_RATE.toFixed(4)} USD`}
                  mono
                />
              )}
              <KeyValue
                label="Total debit"
                value={
                  sourceRail === "USD"
                    ? fmtUSD(debitInSource)
                    : `${fmtNum(debitInSource)} USDC`
                }
                mono
              />
              <KeyValue label="ETA" value="1–2 business days" />
            </Card>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <Button variant="ghost" full onClick={() => setConfirming(false)}>
                Edit
              </Button>
              <Button full onClick={submit}>
                Send
              </Button>
            </div>
          </>
        )}

        {stage === "submitting" && <Spinner label="Initiating wire…" />}

        {stage === "done" && (
          <DoneView amount={amountNum} beneficiary={beneficiary} />
        )}

        {stage === "error" && (
          <>
            <p className="text-rose text-[14px] font-semibold">
              {errMsg ?? "Send failed"}
            </p>
            <Button
              full
              size="lg"
              className="mt-4"
              onClick={() => setStage("idle")}
            >
              Try again
            </Button>
          </>
        )}
      </Sheet>
    </>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-ink-500 font-mono mb-1">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 px-3 rounded-xl border border-ink-100 bg-canvas text-[14.5px] outline-none focus:border-brand focus:ring-2 focus:ring-brand-200 ${
          mono ? "font-mono tabular" : ""
        }`}
      />
    </label>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="py-4 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          className="animate-spin text-brand"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      <div className="font-display font-bold text-[18px] mt-4 text-ink">
        {label}
      </div>
    </div>
  );
}

function DoneView({
  amount,
  beneficiary,
}: {
  amount: number;
  beneficiary: string;
}) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-center mt-2">
        <div className="w-16 h-16 rounded-full bg-emerald flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="font-display font-bold text-[22px] text-center mt-4 text-ink">
        {fmtUSD(amount)} on the way
      </div>
      <div className="text-[13.5px] text-ink-500 text-center mt-1 max-w-[280px] mx-auto">
        Sent to {beneficiary}. We&apos;ll mark it settled once the bank
        confirms.
      </div>
    </div>
  );
}
