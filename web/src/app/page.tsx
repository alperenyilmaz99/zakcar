import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { getBrands, getGroups, getVehicles } from "@/lib/data";

export default function HomePage() {
  const vehicles = getVehicles().slice(0, 6);
  const groups = getGroups();
  const brands = getBrands();

  return (
    <>
      <Hero />
      <HomeSections vehicles={vehicles} brands={brands} groupCount={groups.length} />
    </>
  );
}
