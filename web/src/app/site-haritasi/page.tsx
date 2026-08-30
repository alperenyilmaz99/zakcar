import Link from "next/link";
import { NAV } from "@/lib/constants";

export const metadata = { title: "Site Haritası" };

export default function Page() {
  const links = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/arac-modelleri", label: "Araç Modelleri" },
    ...NAV.main,
    ...NAV.top,
  ];
  return (
    <div className="container-page max-w-xl py-10 lg:py-14">
      <h1 className="section-title">Site Haritası</h1>
      <ul className="mt-8 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-brand hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
