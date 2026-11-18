import type { MessageKey } from "@/lib/i18n";

export const SEGMENT_IDS = ["eco", "sedan", "lux", "suv", "offroad", "van"] as const;

export type SegmentId = (typeof SEGMENT_IDS)[number];

export type SegmentDef = {
  id: SegmentId;
  href: string;
  title: MessageKey;
  desc: MessageKey;
  image: string;
  alt: string;
  label: string;
};

export const SEGMENTS: SegmentDef[] = [
  {
    id: "eco",
    href: "/ekonomik-arac-kiralama",
    title: "seg.eco.title",
    desc: "seg.eco.desc",
    image: "/assets/images/vehicles/png/renault-clio-hb.png",
    alt: "Ekonomik araç",
    label: "Ekonomik",
  },
  {
    id: "sedan",
    href: "/sedan-arac-kiralama",
    title: "seg.sedan.title",
    desc: "seg.sedan.desc",
    image: "/assets/images/vehicles/png/fiat-yeni-egea-sedan.png",
    alt: "Sedan araç",
    label: "Sedan",
  },
  {
    id: "lux",
    href: "/luks-arac-kiralama",
    title: "seg.lux.title",
    desc: "seg.lux.desc",
    image: "/assets/images/vehicles/png/bmw-520.png",
    alt: "Lüks araç",
    label: "Lüks",
  },
  {
    id: "suv",
    href: "/4x4-suv-arac-kiralama",
    title: "seg.suv.title",
    desc: "seg.suv.desc",
    image: "/assets/images/vehicles/png/hyundai-tucson.png",
    alt: "SUV araç",
    label: "SUV",
  },
  {
    id: "offroad",
    href: "/4x4-suv-arac-kiralama",
    title: "seg.offroad.title",
    desc: "seg.offroad.desc",
    image: "/assets/images/vehicles/png/dacia-duster.png",
    alt: "4x4 araç",
    label: "4x4 / Arazi",
  },
  {
    id: "van",
    href: "/7-10-kisilik-arac-kiralama",
    title: "seg.van.title",
    desc: "seg.van.desc",
    image: "/assets/images/vehicles/png/citroen-jumpy-8-1.png",
    alt: "Minibüs",
    label: "Minibüs",
  },
];

export function isSegmentId(value: string): value is SegmentId {
  return (SEGMENT_IDS as readonly string[]).includes(value);
}

export function segmentById(id: string): SegmentDef | undefined {
  return SEGMENTS.find((item) => item.id === id);
}
