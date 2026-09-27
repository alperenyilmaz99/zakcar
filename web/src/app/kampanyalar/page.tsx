"use client";

import { CampaignsGrid } from "@/components/content/CampaignsGrid";
import { usePrefs } from "@/components/prefs/PrefsProvider";

export default function KampanyalarPage() {
  const { t } = usePrefs();

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="section-title">{t("kamp.title")}</h1>
      <p className="section-sub">{t("kamp.sub")}</p>
      <CampaignsGrid />
    </div>
  );
}
