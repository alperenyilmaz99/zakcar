"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { Vehicle } from "@/lib/types";

export function PopularSlider({ vehicles }: { vehicles: Vehicle[] }) {
  const { t, locale } = usePrefs();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const rtl = locale === "ar";

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 4) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const left = el.scrollLeft;
    if (rtl) {
      setCanPrev(left < -4);
      setCanNext(left > -(max - 4));
    } else {
      setCanPrev(left > 4);
      setCanNext(left < max - 4);
    }
  }, [rtl]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update, vehicles.length]);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + 20 : Math.round(el.clientWidth * 0.8);
    const delta = (rtl ? -dir : dir) * step;
    el.scrollLeft += delta;
    update();
  }

  return (
    <section className="container-page py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{t("home.popular")}</h2>
          <p className="section-sub">{t("home.popularSub")}</p>
        </div>
        <div className="flex items-center gap-2">
          <NavButton label={t("home.prev")} disabled={!canPrev} onClick={() => scrollByPage(-1)}>
            <Arrow className="rtl:rotate-180" />
          </NavButton>
          <NavButton label={t("home.next")} disabled={!canNext} onClick={() => scrollByPage(1)}>
            <Arrow className="rotate-180 rtl:rotate-0" />
          </NavButton>
          <Link href="/arac-modelleri" className="btn-outline ms-1">
            {t("home.allCars")}
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {vehicles.map((v) => (
          <div
            key={v.slug}
            data-slide
            className="w-[min(100%,20.5rem)] shrink-0 snap-start sm:w-[calc(50%-0.625rem)] xl:w-[calc(33.333%-0.875rem)]"
          >
            <VehicleCard vehicle={v} />
          </div>
        ))}
      </div>
    </section>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-white text-ink shadow-sm transition hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-4 w-4 fill-current ${className ?? ""}`} aria-hidden>
      <path d="M12.7 4.3a1 1 0 0 1 0 1.4L8.4 10l4.3 4.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}
