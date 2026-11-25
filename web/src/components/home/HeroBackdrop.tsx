import { HERO_BACKDROP } from "@/lib/promo";

export function HeroBackdrop({ src }: { src: string }) {
  return (
    <div className="pointer-events-none hidden w-full lg:block">
      <img src={src || HERO_BACKDROP} alt="" className="block h-auto w-full" />
    </div>
  );
}
