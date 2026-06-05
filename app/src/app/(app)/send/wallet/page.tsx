"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { AmountInput } from "@/components/ui/AmountInput";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona, useUser } from "@/lib/persona-store";
import { fmtNum, fmtUSD, shortHash } from "@/lib/format";

const ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

export default function SendWalletPage() {
  const router = useRouter();
  const user = useUser();
  const { refresh } = usePersona();

  const balance = user.usdcWallet.balance;
  const [amount, setAmount] = useState("100");
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [stage, setStage] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const amountNum = Number(amount) || 0;
  const insufficient = amountNum > balance;
  const validAddr = ADDR_RE.test(address.trim());
  const formValid = validAddr && amountNum > 0 && !insufficient;

  const submit = async () => {
    setStage("submitting");
    setErrMsg(null);
    const r = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rail: "USDC",
        amount: amountNum,
        beneficiary: label.trim(),
        destination: address.trim(),
      }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setErrMsg(data.error ?? "Send failed");
      setStage("error");
      return;
    }
    const data = await r.json();
    setTxHash(data.tx?.meta?.txHash ?? null);
    await refresh();
    setStage("done");
  };

  return (
    <>
      <TopBar title="Send USDC" back />
      <div className="px-4 py-2 space-y-3">
        <Card className="bg-brand-50/40 border-brand-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-ink-500 font-mono">
                From
              </div>
              <div className="font-display font-semibold text-[14.5px] text-ink mt-0.5">
                USDC wallet
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10.5px] uppercase tracking-wider text-ink-500 font-mono">
                Available
              </div>
              <div className="font-mono tabular text-[14px] font-semibold text-ink mt-0.5">
                {fmtNum(balance)} USDC
              </div>
            </div>
          </div>
        </Card>

        <Card padded={false} className="p-4 space-y-3">
          <div className="text-[10.5px] uppercase tracking-wider text-ink-500 font-mono">
            Destination
          </div>
          <label className="block">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-mono mb-1">
              Wallet address
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x…"
              spellCheck={false}
              autoComplete="off"
              className="w-full h-11 px-3 rounded-xl border border-ink-100 bg-canvas text-[14px] outline-none focus:border-brand focus:ring-2 focus:ring-brand-200 font-mono tabular"
            />
            {address && !validAddr && (
              <div className="text-[12px] text-rose mt-1.5">
                Address must be a 42-character 0x hex address.
              </div>
            )}
          </label>
          <label className="block">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 font-mono mb-1">
              Label (optional)
            </div>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Who's this for?"
              className="w-full h-11 px-3 rounded-xl border border-ink-100 bg-canvas text-[14.5px] outline-none focus:border-brand focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </Card>

        <Card>
          <div className="text-[10.5px] uppercase tracking-wider text-ink-500 font-mono">
            Amount
          </div>
          <AmountInput value={amount} onChange={setAmount} symbol="USDC" />
          <div className="text-[12px] text-ink-500 mt-1">
            Fee 0 · You send{" "}
            <span className="font-mono tabular text-ink">
              {fmtNum(amountNum)} USDC
            </span>
          </div>
        </Card>

        {insufficient && (
          <div className="text-rose text-[13px] font-semibold px-1">
            Not enough USDC.
          </div>
        )}

        <Card className="bg-amber/5 border-amber/30">
          <div className="font-display font-semibold text-amber text-[13.5px]">
            Double-check the address
          </div>
          <p className="text-[12.5px] text-ink-700 mt-1 leading-snug">
            USDC transfers can&apos;t be reversed. Make sure the address is
            correct and supports USDC.
          </p>
        </Card>

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
              ? "Broadcasting"
              : "Confirm send"
        }
      >
        {stage === "idle" && (
          <>
            <div className="text-[12px] text-ink-500 font-mono tracking-wider uppercase">
              You send
            </div>
            <div className="font-display font-extrabold text-[36px] tabular text-ink leading-none mt-1">
              {fmtNum(amountNum)}{" "}
              <span className="text-ink-500 text-[18px]">USDC</span>
            </div>

            <Card padded={false} className="px-4 mt-5">
              {label && <KeyValue label="To" value={label} />}
              <KeyValue label="Address" value={shortHash(address.trim())} mono />
              <KeyValue label="Fee" value="0.00 USDC" mono />
              <KeyValue label="ETA" value="~30 seconds" />
            </Card>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <Button variant="ghost" full onClick={() => setConfirming(false)}>
                Edit
              </Button>
              <Button full onClick={submit}>
                Send {fmtNum(amountNum)} USDC
              </Button>
            </div>
          </>
        )}

        {stage === "submitting" && (
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
              Broadcasting transfer…
            </div>
          </div>
        )}

        {stage === "done" && (
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
              {fmtNum(amountNum)} USDC sent
            </div>
            <div className="text-[13.5px] text-ink-500 text-center mt-1 max-w-[280px] mx-auto">
              Settled. Available immediately at the receiving wallet.
            </div>
            {txHash && (
              <div className="font-mono tabular text-[12px] text-ink-500 text-center mt-3">
                Ref · {shortHash(txHash)}
              </div>
            )}
          </div>
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
