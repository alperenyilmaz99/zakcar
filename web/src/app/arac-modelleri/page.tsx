import { VehicleCatalog } from "@/components/vehicles/VehicleCatalog";
import { SearchBar } from "@/components/search/SearchBar";
import { getVehicles } from "@/lib/data";

export const metadata = {
  title: "Araç Modelleri",
};

export default async function AracModelleriPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string; pickup?: string }>;
}) {
  const params = await searchParams;
  const vehicles = getVehicles();

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">Araç Modelleri</h1>
      <p className="section-sub">Size en uygun aracı seçin ve hemen rezervasyon yapın.</p>
      <div className="my-8">
        <SearchBar
          defaultGroup={params.group}
          defaultPickup={params.pickup}
          compact
        />
      </div>
      <VehicleCatalog vehicles={vehicles} initialGroup={params.group} />
    </div>
  );
}
