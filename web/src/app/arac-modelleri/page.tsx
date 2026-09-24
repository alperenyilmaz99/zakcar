import { VehicleCatalog } from "@/components/vehicles/VehicleCatalog";
import { SearchBar } from "@/components/search/SearchBar";
import { PageIntro } from "@/components/content/PageIntro";
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
      <PageIntro title="catalog.title" sub="catalog.sub" />
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
