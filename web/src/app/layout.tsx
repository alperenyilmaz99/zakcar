import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Güvenilir Araç Kiralama`,
    template: `%s | ${SITE.shortName}`,
  },
  description:
    "ZakCar Rent A Car — İstanbul Sabiha Gökçen Havalimanı başta olmak üzere güvenilir ve uygun fiyatlı araç kiralama.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
    ],
    apple: "/assets/zakcar/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
