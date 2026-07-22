import { permanentRedirect } from "next/navigation"
import { AustraliaPathfinder } from "@/components/au-pathfinder/australia-pathfinder"
import { profileFromSearchParams } from "@/lib/au-pathfinder"
import { localizePath } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400

export const metadata = pageMetadata({
  title: "CampCareer — 호주 유학·커리어 경로",
  description: "내 조건에 맞는 호주 학업 경로를 찾고, 학비·졸업 성과·ROI를 비교하세요.",
  path: "/ko",
})

export default async function KoreanLandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [locale, query] = await Promise.all([getLocale(), searchParams])
  const one = (key: string) => (typeof query[key] === "string" ? query[key] : undefined)

  const selectedMajor = one("major")
  if (selectedMajor) permanentRedirect(localizePath(`/au/majors/${selectedMajor}`, locale))

  return (
    <AustraliaPathfinder
      initialProfile={profileFromSearchParams({
        category: one("category"),
        goal: one("goal"),
        pathGoal: one("pathGoal"),
        budget: one("budget"),
        timeline: one("timeline"),
        stage: one("stage"),
        visa: one("visa"),
      })}
    />
  )
}
