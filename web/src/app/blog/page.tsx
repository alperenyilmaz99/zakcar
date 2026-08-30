import Link from "next/link";

export const metadata = { title: "Blog" };

export default function Page() {
  return (
    <div className="container-page max-w-3xl py-10 lg:py-14">
      <h1 className="section-title">Blog</h1>
      <p className="section-sub">Araç kiralama rehberi ve seyahat ipuçları yakında burada.</p>
      <Link href="/" className="btn-outline mt-8">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
