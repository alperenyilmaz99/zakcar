import { Content } from "@/components/content/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = { title: "İletişim" };

export default function Page() {
  return (
    <Content title="İletişim">
      <p>
        <strong>Telefon:</strong>{" "}
        <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-brand">
          {SITE.phone}
        </a>
      </p>
      <p>
        <strong>E-posta:</strong>{" "}
        <a href={`mailto:${SITE.email}`} className="text-brand">
          {SITE.email}
        </a>
      </p>
      <p>
        <strong>Adres:</strong> {SITE.address}
      </p>
    </Content>
  );
}
