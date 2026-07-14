import { permanentRedirect } from "next/navigation"
import { getDocumentLocale } from "@/lib/i18n/server"
import { buildLegacyCompareRedirect } from "@/lib/comparison/legacy-redirect"

export default async function SchoolComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  permanentRedirect(buildLegacyCompareRedirect(await searchParams, await getDocumentLocale()))
}
