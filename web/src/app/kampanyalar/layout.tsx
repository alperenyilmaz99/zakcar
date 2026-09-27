import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kampanyalar",
  description: "ZakCar güncel araç kiralama kampanyaları ve indirimleri.",
};

export default function KampanyalarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
