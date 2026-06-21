import { notFound } from "next/navigation"
import { getOccupationPageData } from "@/lib/occupation-detail"
import OccupationDetailPage from "./OccupationDetailPage"

export const revalidate = 3600

export default async function Page({ params }: { params: { code: string } }) {
  const data = await getOccupationPageData(params.code)
  if (!data) notFound()
  return <OccupationDetailPage data={data} />
}