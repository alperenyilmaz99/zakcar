import { Suspense } from "react";
import LookupClient from "./LookupClient";

export const metadata = { title: "Rezervasyon Sorgula" };

export default function Page() {
  return (
    <Suspense fallback={<div className="container-page py-14">Yükleniyor...</div>}>
      <LookupClient />
    </Suspense>
  );
}
