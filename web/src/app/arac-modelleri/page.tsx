import { VehicleCatalog } from "@/components/vehicles/VehicleCatalog";
import { SearchBar } from "@/components/search/SearchBar";
import { getBrands, getGroups, getVehicles } from "@/lib/data";

export const metadata = {
  title: "Araç Modelleri",
};

export default async function AracModelleriPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string; brand?: string; pickup?: string }>;
}) {
  const params = await searchParams;
  const vehicles = getVehicles();
  const groups = getGroups();
  const brands = getBrands();

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">Araç Modelleri</h1>
      <p className="section-sub">Size en uygun aracı seçin ve hemen rezervasyon yapın.</p>
      <div className="my-8">
        <SearchBar
          defaultGroup={params.group}
          defaultBrand={params.brand}
          defaultPickup={params.pickup}
          compact
        />
      </div>
      <VehicleCatalog
        vehicles={vehicles}
        initialGroup={params.group}
        initialBrand={params.brand}
        groups={groups}
        brands={brands}
      />
    </div>
  );
}
