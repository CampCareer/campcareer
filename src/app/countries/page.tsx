import { redirect } from "next/navigation"
import { getLocale } from "@/lib/i18n/server"

// Countries now lives on the landing page. Keep legacy links working without
// maintaining two competing discovery hubs.
export default async function CountriesPage() {
  redirect((await getLocale()) === "ko" ? "/ko" : "/")
}
