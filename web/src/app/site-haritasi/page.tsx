import Link from "next/link";
import { NAV } from "@/lib/constants";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata = { title: "Site Haritası" };

export default function Page() {
  const links = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/arac-modelleri", label: "Araç Modelleri" },
    ...NAV.main,
    ...NAV.top,
    { href: "/kiralama-kosullari", label: "Kiralama Koşulları" },
    { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
    { href: "/kisisel-verilerin-korunmasi", label: "Kişisel Verilerin Korunması" },
  ];
  const posts = getAllBlogPosts();

  return (
    <div className="container-page max-w-3xl py-10 lg:py-14">
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

      <h2 className="mt-12 font-display text-xl font-bold text-ink">Blog Yazıları</h2>
      <ul className="mt-4 space-y-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="text-brand hover:underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
