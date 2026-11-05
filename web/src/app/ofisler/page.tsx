import { OfficesList } from "@/components/content/OfficesList";
import { getOffices } from "@/lib/data";

export const metadata = { title: "Ofisler" };

export default function Page() {
  const offices = getOffices();
  return (
    <div className="bg-surface-soft">
      <div className="container-page py-10 lg:py-14">
        <OfficesList offices={offices} />
      </div>
    </div>
  );
}
