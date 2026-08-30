import Link from "next/link";
import { NAV } from "@/lib/constants";

export const metadata = { title: "Araç Grupları" };

export default function Page() {
  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">Araç Grupları</h1>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {NAV.vehicles.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="card block p-5 font-semibold hover:border-brand hover:text-brand">
              {g.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/arac-modelleri" className="card block p-5 font-semibold hover:border-brand hover:text-brand">
            Tüm Araç Modelleri
          </Link>
        </li>
      </ul>
    </div>
  );
}
