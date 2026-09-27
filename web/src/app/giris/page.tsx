import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: `${SITE.shortName} üyeliği ile rezervasyonlarınızı takip edin.`,
};

export default function Page() {
  return <AuthForm />;
}
