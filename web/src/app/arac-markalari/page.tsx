import Link from "next/link";
import { brandSlug, getBrands } from "@/lib/data";

export const metadata = { title: "Araç Markaları" };

export default function Page() {
  const brands = getBrands();
  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">Araç Markaları</h1>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((b) => (
          <li key={b}>
            <Link
              href={`/${brandSlug(b)}-arac-kiralama`}
              className="block rounded-xl border border-surface-border bg-white px-4 py-3 font-medium hover:border-brand hover:text-brand"
            >
              {b}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
