import { Suspense } from "react";
import RezervasyonPage from "./RezervasyonClient";

export const metadata = { title: "Rezervasyon" };

export default function Page() {
  return (
    <Suspense fallback={<div className="container-page py-14">Yükleniyor...</div>}>
      <RezervasyonPage />
    </Suspense>
  );
}
