import { permanentRedirect } from "next/navigation"
import { CANONICAL_CAREERS } from "@/data/career-comparison-catalog"

export const metadata = {
  robots: { index: false, follow: false } as const,
}

export default async function OccupationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!CANONICAL_CAREERS.some((c) => c.id === slug)) permanentRedirect("/occupation")
  permanentRedirect(`/occupation?occupation=${slug}`)
}
