import { SITE } from "@/lib/constants";
import { ContactBody } from "./ContactBody";

export const metadata = { title: "İletişim" };

export default function Page() {
  return <ContactBody site={SITE} />;
}
