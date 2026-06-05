"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { findPersonaByPhone } from "@/lib/mock-data/personas";
import { cn } from "@/lib/cn";

const LEN = 6;

export default function OtpPage() {
  const router = useRouter();
  const [phone, setPhone] = useState<string>("");
  const [digits, setDigits] = useState<string[]>(() => Array(LEN).fill(""));
  const [resendIn, setResendIn] = useState(20);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("borderless.signin.phone") ?? "";
    setPhone(stored);
    if (!stored) router.replace("/signin");
  }, [router]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const filled = digits.every((d) => d.length === 1);
  const matched = useMemo(() => findPersonaByPhone(phone), [phone]);

  /**
   * Write character(s) into the digit array starting at `start`, then move
   * focus. flushSync forces React to commit the state update *during* this
   * call so the DOM is up-to-date before .focus(); no chance of a controlled-
   * input race stealing focus back to the originating cell.
   */
  const writeFrom = (start: number, raw: string) => {
    const chars = raw.replace(/\D/g, "").split("").slice(0, LEN - start);
    flushSync(() => {
      setDigits((prev) => {
        const next = [...prev];
        if (chars.length === 0) {
          next[start] = "";
        } else {
          for (let j = 0; j < chars.length; j++) next[start + j] = chars[j];
        }
        return next;
      });
    });

    if (chars.length === 0) return;
    const after = Math.min(start + chars.length, LEN - 1);
    const target = inputs.current[after];
    if (target) {
      target.focus();
      target.select();
    }
  };

  const onInput = (i: number, e: React.FormEvent<HTMLInputElement>) => {
    writeFrom(i, (e.target as HTMLInputElement).value);
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        e.preventDefault();
        flushSync(() => {
          setDigits((prev) => {
            const next = [...prev];
            next[i] = "";
            return next;
          });
        });
      } else if (i > 0) {
        e.preventDefault();
        flushSync(() => {
          setDigits((prev) => {
            const next = [...prev];
            next[i - 1] = "";
            return next;
          });
        });
        inputs.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < LEN - 1) {
      e.preventDefault();
      inputs.current[i + 1]?.focus();
    }
  };

  const onPaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    writeFrom(i, text);
  };

  const verify = async () => {
    if (!filled) return;
    const r = await fetch("/api/persona", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matched ? { key: matched } : { phone }),
    });
    const data = await r.json().catch(() => ({}));
    if (data.matched || data.key) router.replace("/home");
    else router.replace("/onboarding");
  };

  return (
    <PhoneFrame>
      <div className="min-h-dvh flex flex-col bg-canvas">
        <header className="px-5 pt-14 pb-3">
          <Logo size="sm" />
        </header>

        <div className="px-6 pt-4 pb-8 flex-1 flex flex-col">
          <h1 className="font-display font-extrabold text-[28px] tracking-tight leading-tight">
            Enter the 6-digit code
          </h1>
          <p className="text-ink-500 mt-2 text-[14.5px]">
            Sent to{" "}
            <span className="font-mono tabular text-ink">+971 {phone}</span>.
          </p>

          <div className="grid grid-cols-6 gap-2 mt-6">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                onChange={() => {
                  /* handled by onInput */
                }}
                onInput={(e) => onInput(i, e)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={(e) => onPaste(i, e)}
                onFocus={(e) => e.currentTarget.select()}
                className={cn(
                  "h-14 text-center font-display font-bold text-[26px] tabular rounded-xl border bg-white outline-none transition-colors",
                  d ? "border-brand" : "border-ink-100",
                  "focus:border-brand focus:ring-2 focus:ring-brand-200"
                )}
                aria-label={`Digit ${i + 1}`}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <Button
            onClick={verify}
            disabled={!filled}
            full
            size="lg"
            className="mt-5"
          >
            Verify
          </Button>

          <div className="text-[13px] text-ink-500 text-center mt-4">
            Didn&apos;t get it?{" "}
            {resendIn > 0 ? (
              <span className="text-ink-500">Resend in {resendIn}s</span>
            ) : (
              <button
                onClick={() => setResendIn(20)}
                className="text-brand-700 font-semibold"
              >
                Resend code
              </button>
            )}
          </div>

          {matched && (
            <div className="mt-auto pt-6 text-[12px] text-ink-500 text-center font-mono">
              Demo match →{" "}
              {matched === "stablecoin"
                ? "Stablecoin-only"
                : matched === "active"
                  ? "Both rails"
                  : "Power user"}
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
