import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowRight, BadgeCheck, BookOpen } from "lucide-react"
import { createClient } from "@/lib/supabase-server"
import type { RecommendationResultV2 } from "@/lib/study-product/types"
import { RecalculatePlanButton } from "./recalculate-plan-button"

export const dynamic = "force-dynamic"
export const metadata = { title: "My decision plan", robots: { index: false, follow: false } }

export default async function DecisionPlanPage(
  props: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/plans/${params.id}`)}`)

  const { data: plan, error } = await supabase
    .from("decision_plans")
    .select("id, locale, origin_country, target_concept_id, selected_country, current_version, created_at, updated_at")
    .eq("id", params.id)
    .single()
  if (error || !plan) notFound()

  const { data: version } = await supabase
    .from("decision_plan_versions")
    .select("version, result_snapshot, engine_version, data_version, generated_at")
    .eq("plan_id", params.id)
    .eq("version", plan.current_version)
    .single()
  if (!version) notFound()

  const result = version.result_snapshot as unknown as RecommendationResultV2
  const isKo = plan.locale === "ko-KR"

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {searchParams.saved === "1" && <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><BadgeCheck className="h-4 w-4" />{isKo ? "플랜이 저장되었습니다" : "Plan saved"}</div>}
          <p className="text-sm font-bold text-blue-600">{result.concept.label}</p>
          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{isKo ? "내 유학 의사결정 플랜" : "My study decision plan"}</h1>
              <p className="mt-3 text-sm text-slate-500">{isKo ? "저장 기준" : "Saved as of"} {formatDate(version.generated_at)} · Engine {version.engine_version} · Data {version.data_version}</p>
            </div>
            <RecalculatePlanButton planId={plan.id} label={isKo ? "최신 자료로 다시 계산" : "Recalculate with latest data"} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {result.rankedCountries.map((country, index) => (
            <article key={country.countryCode} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-400">#{index + 1}</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">{country.countryName}</h2>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{country.why}</p>
              <div className="mt-5 space-y-2">
                {country.metrics.map((metric) => <div key={metric.key} className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] font-bold text-slate-400">{metric.label}</p><p className="mt-1 text-sm font-bold leading-5 text-slate-900">{metric.value}</p></div>)}
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                <Link href={`${country.shortlistHref}?locale=${plan.locale}`} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white">{isKo ? "과정 비교" : "Compare courses"}<ArrowRight className="h-3.5 w-3.5" /></Link>
                <Link href={country.detailHref} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700">{isKo ? "근거 확인" : "Review evidence"}<BookOpen className="h-3.5 w-3.5" /></Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[isKo ? "검증된 과정 shortlist 비교" : "Compare the verified course shortlist", isKo ? "면허·입학조건 확인" : "Check licensing and admission requirements", isKo ? "공식 비자·교육기관 페이지 확인" : "Review official visa and provider sources"].map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-200 bg-white p-5"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">{index + 1}</span><p className="mt-4 text-sm font-bold leading-6 text-slate-900">{step}</p></div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-500">{result.disclaimer}</div>
      </section>
    </div>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}
