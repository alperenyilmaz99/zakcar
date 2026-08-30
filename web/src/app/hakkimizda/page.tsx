import { Content } from "@/components/content/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = { title: "Hakkımızda" };

export default function Page() {
  return (
    <Content title="Hakkımızda">
      <p>
        {SITE.name}, İstanbul Sabiha Gökçen Havalimanı başta olmak üzere güvenilir ve kaliteli
        araç kiralama hizmeti sunmaktadır.
      </p>
      <p>
        Geniş araç filomuz, 7/24 müşteri desteğimiz ve şeffaf fiyat politikamız ile yanınızdayız.
      </p>
    </Content>
  );
}
