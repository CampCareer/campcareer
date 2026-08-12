import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, BriefcaseBusiness, Compass, MapPinned } from "lucide-react"
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { createClient } from "@/lib/supabase-server"
import { toDashboardPathways, type SavedPathwayRecord } from "./home-dashboard-config"

export const metadata: Metadata = {
  title: "내 커리어",
  description: "저장한 해외 커리어 경로와 다음 행동을 이어갑니다.",
  robots: { index: false, follow: false },
}

type CareerPreferenceRow = {
  target_country: string | null
  target_occupation: string | null
  career_personalisation_completed_at: string | null
}

export default async function MemberHomePage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) redirect("/login?next=/home")

  const [preferenceResult, pathwaysResult] = await Promise.all([
    supabase
      .from("user_preferences")
      .select("target_country,target_occupation,career_personalisation_completed_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("saved_pathways")
      .select("id,origin_country_code,country_code,field_slug,status_slug,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3),
  ])

  const preference = (preferenceResult.data as CareerPreferenceRow | null) ?? null
  const targetCountry = preference?.target_country?.toUpperCase() ?? null
  const targetOccupation = preference?.target_occupation ?? null
  const country = targetCountry ? LAUNCH_COUNTRIES.find((item) => item.code === targetCountry) : null
  const career = targetOccupation ? CANONICAL_CAREER_BY_ID.get(targetOccupation) : null
  const careerHref = country && career
    ? `/career?country=${encodeURIComponent(country.code)}&occupation=${encodeURIComponent(career.id)}&personalised=1`
    : "/"
  const pathways = toDashboardPathways((pathwaysResult.data as SavedPathwayRecord[] | null) ?? [])

  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
    <header className="flex flex-col gap-5 border-b border-[#e7e6e3] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-bold tracking-[0.12em] text-blue-700">MY CAREER</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">내 해외 커리어</h1><p className="mt-2 text-[15px] leading-6 text-slate-600">저장한 방향을 이어가고, 다음에 확인할 조건을 정리하세요.</p></div>
      <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d5d9df] bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50">새 커리어 확인 <Compass className="size-4" /></Link>
    </header>

    {country && career ? <section className="mt-7 overflow-hidden rounded-3xl border border-[#d5e0f3] bg-[#f5f8ff] p-6 sm:p-7" aria-labelledby="active-career-heading"><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-blue-700"><BriefcaseBusiness className="size-5" /><p className="text-xs font-bold tracking-[0.1em]">CURRENT CAREER CHECK</p></div><h2 id="active-career-heading" className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-slate-950">{country.name} · {career.labelKo}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">시장 정보와 입력한 개인 조건을 바탕으로, 학업·등록·첫 취업으로 이어지는 경로를 계속 확인할 수 있어요.</p></div><Link href={careerHref} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2865c7] px-4 text-sm font-semibold text-white transition hover:bg-[#1f55aa]">내 경로 이어보기 <ArrowRight className="size-4" /></Link></div></section> : <section className="mt-7 rounded-3xl border border-[#e2e5e2] bg-[#fafaf8] p-6 sm:p-7" aria-labelledby="start-career-heading"><div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700"><MapPinned className="size-5" /></span><div><h2 id="start-career-heading" className="text-xl font-semibold tracking-[-0.035em] text-slate-950">첫 해외 커리어 방향을 찾아보세요.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">국가와 하고 싶은 일 두 가지만 고르면, 취업시장과 현실적인 진입 경로부터 볼 수 있어요.</p><Link href="/" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#2865c7] px-4 text-sm font-semibold text-white transition hover:bg-[#1f55aa]">커리어 확인 시작 <ArrowRight className="size-4" /></Link></div></div></section>}

    {pathways.length > 0 && <section className="mt-9 border-t border-[#e7e6e3] pt-8" aria-labelledby="saved-pathways-heading"><div><p className="text-xs font-bold tracking-[0.1em] text-blue-700">SAVED PATHWAYS</p><h2 id="saved-pathways-heading" className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">이전에 저장한 경로</h2></div><div className="mt-5 grid gap-3 md:grid-cols-3">{pathways.map((pathway) => <Link key={pathway.id} href={pathway.href} className="group rounded-2xl border border-[#e2e5e2] bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_16px_30px_-24px_rgba(37,99,235,.45)]"><p className="text-sm font-semibold text-slate-950">{pathway.originLabel} → {pathway.countryLabel}</p><p className="mt-2 text-sm text-slate-700">{pathway.fieldLabel}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{pathway.routeLabel}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">계속 보기 <ArrowRight className="size-3 transition group-hover:translate-x-0.5" /></span></Link>)}</div></section>}
  </main>
}
