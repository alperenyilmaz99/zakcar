"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { LocalePathSync } from "@/components/layout/LocalePathSync";
import { PrefsProvider } from "@/components/prefs/PrefsProvider";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPanel = pathname?.startsWith("/panel");

  if (isPanel) {
    return <PrefsProvider>{children}</PrefsProvider>;
  }

  return (
    <PrefsProvider>
      <Suspense fallback={null}>
        <LocalePathSync />
      </Suspense>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <FloatingContact />
    </PrefsProvider>
  );
}
