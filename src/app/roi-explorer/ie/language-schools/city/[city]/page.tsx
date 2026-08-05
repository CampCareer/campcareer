import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

import { TopNav } from "@/components/layout/top-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getSchoolsByCity, type LanguageSchool } from "@/lib/language-schools-ie"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"

export const dynamic = "force-dynamic"

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const params = await props.params;
  const cityName = capitalize(params.city)
  return pageMetadata({
    title: `${cityName} 아일랜드 어학원 추천 2026 — 학비 및 과정 정보`,
    description: `${cityName} 소재 ACELS/MEI 인증 영어 어학원 리스트. 주당 수업료, 홈스테이/기숙사 비용, 과정별 상세 정보를 확인하세요. 2026년 최신 업데이트.`,
    path: `/roi-explorer/ie/language-schools/city/${params.city}`,
  })
}

function SchoolCard({ school }: { school: LanguageSchool }) {
  return (
    <Link href={`/roi-explorer/ie/language-schools/${school.slug}`} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-900 truncate">{school.name_en}</h3>
              {school.name_ko && <p className="text-xs text-muted-foreground mt-0.5">{school.name_ko}</p>}
            </div>
            <ArrowRight className="size-4 shrink-0 text-slate-400 mt-1" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {school.google_rating && (
              <span className="inline-flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {school.google_rating}
              </span>
            )}
            {school.price_range_week && (
              <span className="font-medium text-slate-600">{school.price_range_week}/주</span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {school.accreditation?.slice(0, 3).map((a) => (
              <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>
            ))}
          </div>
          {school.description_ko && (
            <p className="mt-2 text-xs text-slate-500 line-clamp-2">{school.description_ko}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default async function CityPage(props: { params: Promise<{ city: string }> }) {
  const params = await props.params;
  const cityName = capitalize(params.city)
  const schools = await getSchoolsByCity(cityName)

  if (schools.length === 0) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />

      <main className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/roi-explorer/ie/language-schools"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            전체 어학원 목록
          </Link>

          <JsonLd data={breadcrumbLd([
            { name: "ROI Explorer", path: "/roi-explorer" },
            { name: "Ireland", path: "/roi-explorer/ie" },
            { name: "Language Schools", path: "/roi-explorer/ie/language-schools" },
            { name: cityName, path: `/roi-explorer/ie/language-schools/city/${params.city}` },
          ])} />

          <header className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {cityName} 어학원
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              아일랜드 {cityName} 지역의 ACELS/MEI 인증 영어 어학원 <strong>{schools.length}곳</strong>입니다.
            </p>
          </header>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
