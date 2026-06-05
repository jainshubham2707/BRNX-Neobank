"use client";

import Link from "next/link";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { Mark } from "@/components/brand/Mark";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function StartPage() {
  return (
    <PhoneFrame>
      <div className="relative min-h-dvh md:min-h-full flex flex-col text-white">
        <div className="absolute inset-0 bg-brand-deep" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(360px 360px at 88% 10%, rgba(34,211,238,.22), transparent 60%), radial-gradient(420px 420px at 10% 100%, rgba(143,181,225,.18), transparent 60%)",
          }}
        />
        <div className="absolute -right-10 top-10 opacity-15">
          <Mark size={320} knockout />
        </div>

        <div className="relative z-10 flex-1 flex flex-col px-6 pt-20 pb-8">
          <div className="mt-4 mb-8">
            <Logo size="lg" knockout />
          </div>

          <h1 className="font-display font-extrabold text-[44px] leading-[1.02] tracking-tight mt-auto">
            Hold dollars.
            <br />
            Spend borderless.
          </h1>
          <p className="text-brand-100/90 mt-3 text-[15px] max-w-[300px]">
            Your USD account to Spend, Invest and Earn.
          </p>

          <div className="flex flex-col gap-3 mt-8">
            <Link href="/signin">
              <Button variant="ghost" size="lg" full>
                Sign in or create account
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </PhoneFrame>
  );
}
