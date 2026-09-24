"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { PrefsProvider } from "@/components/prefs/PrefsProvider";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPanel = pathname?.startsWith("/panel");

  if (isPanel) {
    return <PrefsProvider>{children}</PrefsProvider>;
  }

  return (
    <PrefsProvider>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <FloatingContact />
    </PrefsProvider>
  );
}
