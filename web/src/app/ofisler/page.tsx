import Link from "next/link";
import { Content } from "@/components/content/ContentPage";
import { getOffices } from "@/lib/data";

export const metadata = { title: "Ofisler" };

export default function Page() {
  const offices = getOffices();
  return (
    <Content title="Ofislerimiz">
      <div className="space-y-4">
        {offices.map((o) => (
          <div key={o.id} className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink">{o.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">{o.address}</p>
            <p className="mt-2 text-sm">
              Tel: <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="text-brand">{o.phone}</a>
              {" · "}{o.hours}
            </p>
          </div>
        ))}
      </div>
      <Link href="/iletisim" className="btn-outline mt-6 inline-flex">
        İletişime Geç
      </Link>
    </Content>
  );
}
