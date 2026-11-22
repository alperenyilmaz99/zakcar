import Image from "next/image";
import { HERO_BACKDROP } from "@/lib/promo";

export function HeroBackdrop({ src }: { src: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      <Image src={src || HERO_BACKDROP} alt="" fill priority sizes="100vw" className="object-cover object-[center_62%]" />
    </div>
  );
}
