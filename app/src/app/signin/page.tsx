"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PERSONAS, PERSONA_KEYS } from "@/lib/mock-data/personas";
import { cn } from "@/lib/cn";

export default function SigninPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (phone.replace(/\D/g, "").length < 6) return;
    sessionStorage.setItem("borderless.signin.phone", phone);
    router.push("/signin/otp");
  };

  return (
    <PhoneFrame>
      <div className="min-h-dvh flex flex-col bg-canvas">
        <header className="px-5 pt-11 pb-3">
          <Logo size="sm" />
        </header>

        <div className="px-6 pt-4 pb-8 flex-1 flex flex-col">
          <h1 className="font-display font-extrabold text-[28px] tracking-tight leading-tight">
            What&apos;s your mobile number?
          </h1>
          <p className="text-ink-500 mt-2 text-[14.5px]">
            We&apos;ll send a one-time code to sign you in. New here? We&apos;ll
            walk you through quick KYC right after.
          </p>

          <Card className="mt-6 flex items-center gap-2 p-0 overflow-hidden">
            <span className="pl-4 py-3.5 font-mono text-[15px] text-ink-700 border-r border-ink-100">
              +971
            </span>
            <input
              autoFocus
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
              placeholder="50 555 0140"
              className="flex-1 font-mono tabular text-[17px] py-3.5 px-3 outline-none bg-transparent"
            />
          </Card>

          <Button
            onClick={submit}
            disabled={phone.replace(/\D/g, "").length < 6}
            full
            size="lg"
            className="mt-4"
          >
            Send code
          </Button>

          <p className="text-[12px] text-ink-500 text-center mt-3">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>

          <div className="mt-8">
            <div className="grid grid-cols-1 gap-2">
              {PERSONA_KEYS.map((key) => {
                const p = PERSONAS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setPhone(p.phone.replace(/^\+971\s?/, ""))}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-2xl bg-surface border border-ink-100",
                      "active:bg-brand-50 transition-colors flex items-center gap-3"
                    )}
                  >
                    <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 inline-flex items-center justify-center font-display font-bold text-[12px]">
                      {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-[14px] text-ink truncate">
                        {p.name}
                      </div>
                      <div className="font-mono tabular text-[12px] text-ink-500">
                        {p.phone}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10.5px] font-display font-semibold uppercase tracking-widest px-2 py-1 rounded-full",
                        p.productAccess.fiat
                          ? "bg-brand-50 text-brand-700"
                          : "bg-deep/10 text-deep"
                      )}
                    >
                      {p.productAccess.fiat ? "Both rails" : "Stablecoin only"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
