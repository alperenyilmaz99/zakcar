import Link from "next/link";
import { Content } from "@/components/content/ContentPage";
import { OfficesList } from "@/components/content/OfficesList";
import { getOffices } from "@/lib/data";

export const metadata = { title: "Ofisler" };

export default function Page() {
  const offices = getOffices();
  return (
    <Content title="Ofislerimiz">
      <OfficesList offices={offices} />
      <Link href="/iletisim" className="btn-outline mt-6 inline-flex">
        İletişime Geç
      </Link>
    </Content>
  );
}
