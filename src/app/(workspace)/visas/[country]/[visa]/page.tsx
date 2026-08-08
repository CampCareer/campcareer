import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { loadVisaCatalog } from "@/lib/workspace/visa-catalog-loader"
import { getVisaRoute } from "@/lib/workspace/visa-routes"
import { VisasExplorer } from "../../visas-explorer"

export const dynamic = "force-dynamic"

type VisaDetailPageProps = {
  params: Promise<{ country: string; visa: string }>
}

export async function generateMetadata({ params }: VisaDetailPageProps): Promise<Metadata> {
  const { country, visa } = await params
  const catalog = await loadVisaCatalog()
  const route = getVisaRoute(catalog, country, visa)

  if (!route) {
    return {
      title: "Visas",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${route.visa.name} in ${route.country.name}`,
    description: route.visa.note,
    alternates: { canonical: route.path },
    robots: { index: true, follow: true },
  }
}

export default async function VisaDetailPage({ params }: VisaDetailPageProps) {
  const { country, visa } = await params
  const catalog = await loadVisaCatalog()
  const route = getVisaRoute(catalog, country, visa)
  if (!route) notFound()

  if (country !== route.country.code.toLowerCase() || visa !== route.slug) {
    permanentRedirect(route.path)
  }

  return (
    <VisasExplorer
      initialQuery=""
      initialCountry={route.country.code}
      initialVisaName={route.visa.name}
      catalog={catalog}
    />
  )
}
