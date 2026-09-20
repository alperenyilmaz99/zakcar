import type { Metadata } from "next";
import { PanelGate } from "@/components/panel/PanelGate";

export const metadata: Metadata = {
  title: "Personel Paneli",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <PanelGate>{children}</PanelGate>;
}
