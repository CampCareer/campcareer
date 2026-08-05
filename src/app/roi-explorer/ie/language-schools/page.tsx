import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Star, MapPin, Search } from "lucide-react"

import { TopNav } from "@/components/layout/top-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getAllSchools, getCities, type LanguageSchool } from "@/lib/language-schools-ie"
import { pageMetadata } from "@/lib/seo"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"

export const dynamic = "force-dynamic"

export const metadata: Metadata = pageMetadata({
  title: "아일랜드 어학원 추천 2026 — ACELS/MEI 인증 영어 학교",
  description: "아일랜드 더블린, 코크, 골웨이, 리머릭의 ACELS/MEI 인증 영어 어학원 18곳. 주당 수업료 €120부터, 홈스테이/기숙사 제공. 2026년 최신 학비 및 과정 정보.",
  path: "/roi-explorer/ie/language-schools",
})

function SchoolCard({ school }: { school: LanguageSchool }) {
  return (
    <Link href={`/roi-explorer/ie/language-schools/${school.slug}`} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-900 truncate">{school.name_en}</h3>
              {school.name_ko && (
                <p className="text-xs text-muted-foreground mt-0.5">{school.name_ko}</p>
              )}
            </div>
            <ArrowRight className="size-4 shrink-0 text-slate-400 mt-1" />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {school.city}
            </span>
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

export default async function LanguageSchoolsIndexPage() {
  const [schools, cities] = await Promise.all([getAllSchools(), getCities()])

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />

      <main className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/roi-explorer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            ROI 탐색으로 돌아가기
          </Link>

          <JsonLd data={breadcrumbLd([
            { name: "ROI Explorer", path: "/roi-explorer" },
            { name: "Ireland", path: "/roi-explorer/ie" },
            { name: "Language Schools", path: "/roi-explorer/ie/language-schools" },
          ])} />

          <header className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              아일랜드 어학원
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              아일랜드의 ACELS/MEI 인증 영어 어학원 리스트입니다. 더블린, 코크, 골웨이 등
              도시별로 최신 학비와 과정을 확인하세요.
            </p>
          </header>

          {cities.length > 0 && (
            <nav className="mt-6 flex flex-wrap gap-2">
              {cities.map((city) => (
                <Link
                  key={city}
                  href={`/roi-explorer/ie/language-schools/city/${encodeURIComponent(city.toLowerCase())}`}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <Search className="size-3" />
                  {city}
                </Link>
              ))}
            </nav>
          )}

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </section>

          {schools.length === 0 && (
            <p className="mt-8 text-sm text-muted-foreground">등록된 어학원이 없습니다.</p>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
