"use client";

import { ReactNode } from "react";
import { PhoneFrame } from "@/components/brand/PhoneFrame";
import { TabBar } from "@/components/ui/TabBar";
import { PersonaProvider, usePersona } from "@/lib/persona-store";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PersonaProvider>
      <PhoneFrame>
        <div className="min-h-dvh flex flex-col bg-canvas">
          <div className="flex-1">
            <Gate>{children}</Gate>
          </div>
          <TabBar />
        </div>
      </PhoneFrame>
    </PersonaProvider>
  );
}

function Gate({ children }: { children: ReactNode }) {
  const { user, loading } = usePersona();
  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-7 w-7 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
