import type { Metadata } from "next";
import { FaqPage } from "@/components/faq/FaqPage";
import { SITE } from "@/lib/constants";
import { faqJsonLd } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: `${SITE.shortName} araç kiralama SSS — rezervasyon, kredi kartsız ödeme, havalimanı teslimi, depozito ve iptal.`,
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd("tr")) }}
      />
      <FaqPage />
    </>
  );
}
