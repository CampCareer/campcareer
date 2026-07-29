import Link from "next/link"
import { ArrowRight, ExternalLink, MapPinned, ShieldCheck } from "lucide-react"
import { type LocalizedText, type RouteGuide, type RouteLocale } from "@/data/route-guides"
import { localizePath } from "@/lib/i18n/config"

export function RouteGuidePage({ guide, locale }: { guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const text = (value: LocalizedText) => value[locale]

  return (
    <main className="bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
          <Link href={localizePath("/", locale)} className="text-sm font-semibold text-slate-500 hover:text-slate-950">
            {isKo ? "모든 경로 검색" : "Search all routes"}
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            {text(guide.origin.name)} <span aria-hidden="true">-&gt;</span> {text(guide.destination.name)} <span aria-hidden="true">-&gt;</span> {text(guide.target)}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{text(guide.title)}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{text(guide.summary)}</p>
          <p className="mt-6 text-xs text-slate-500">
            {isKo ? "정책 마지막 확인일" : "Policy last checked"}: {guide.lastVerified}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-14">
        <div className="space-y-8">
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white"><ShieldCheck className="size-5" /></span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{isKo ? "비자 경로" : "Visa route"}</p>
                <h2 className="mt-1 text-2xl font-semibold">{guide.visa.name}</h2>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-700">{text(guide.visa.summary)}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <RouteList title={isKo ? "확인할 자격 요건" : "Eligibility checkpoints"} items={guide.visa.eligibility.map(text)} />
              <RouteList title={isKo ? "가능한 일과 핵심 제한" : "Work and material limits"} items={guide.visa.workConditions.map(text)} />
            </div>
            <ExternalSource source={guide.visa.source} label={isKo ? "비자 공식 안내" : "Official visa information"} />
          </section>

          <section>
            <SectionHeading title={isKo ? "준비 순서" : "Prepare in this order"} description={isKo ? "비자 규정과 현장 요건을 섞지 않고, 비용을 쓰기 전에 확인해야 할 순서입니다." : "Keep visa rules separate from site requirements, and verify each item before spending money."} />
            <ol className="mt-5 space-y-3">
              {guide.preparation.map((step, index) => (
                <li key={text(step.title)} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex gap-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">{index + 1}</span>
                    <div>
                      <h3 className="font-semibold">{text(step.title)}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{text(step.detail)}</p>
                      {step.source && <ExternalSource source={step.source} label={isKo ? "공식 근거" : "Official source"} />}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <SectionHeading title={isKo ? "구직 링크" : "Search live jobs"} description={isKo ? "광업 구인공고는 빠르게 바뀝니다. 공고에 적힌 직무·현장 요건을 기준으로 판단하세요." : "Mining listings change quickly. Treat the role and site requirements in each listing as the source of truth."} />
            <div className="mt-5 grid gap-3">
              {guide.jobs.map((job) => <ExternalCard key={job.url} label={text(job.label)} detail={text(job.detail)} url={job.url} />)}
            </div>
          </section>

          <section>
            <SectionHeading title={isKo ? "관련 교육 탐색" : "Research relevant training"} description={isKo ? "아래 과정은 공통 입직 요건으로 보장되지 않습니다. 지원하려는 공고와 현장에 필요한지 먼저 확인하세요." : "The courses below are not guaranteed entry requirements. Confirm they apply to the job and site you are pursuing first."} />
            <div className="mt-5 grid gap-3">
              {guide.courses.map((course) => <ExternalCard key={course.url} label={text(course.label)} detail={text(course.detail)} url={course.url} />)}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Link href={localizePath(guide.map.href, locale)} className="block rounded-2xl bg-slate-950 p-6 text-white transition hover:bg-slate-800">
            <MapPinned className="size-5 text-sky-300" />
            <h2 className="mt-4 font-semibold">{text(guide.map.label)}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{text(guide.map.detail)}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">{isKo ? "지도 열기" : "Open map"}<ArrowRight className="size-4" /></span>
          </Link>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <p className="font-semibold">{isKo ? "중요" : "Important"}</p>
            <p className="mt-2">{isKo ? "이 페이지는 정보와 준비 도구입니다. 비자 승인, 고용 제안, 지정근무 인정 여부를 보장하지 않습니다." : "This is an information and preparation tool. It does not guarantee a visa grant, job offer, or specified-work recognition."}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{isKo ? "사용한 공식 출처" : "Official sources used"}</p>
            <ul className="mt-3 space-y-3">
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-700 hover:text-blue-700 hover:underline">
                    {source.name}<ExternalLink className="ml-1 inline size-3" />
                  </a>
                  <p className="mt-0.5 text-xs text-slate-500">{isKo ? "확인일" : "Checked"}: {source.checkedAt}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return <><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p></>
}

function RouteList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />{item}</li>)}
      </ul>
    </div>
  )
}

function ExternalCard({ label, detail, url }: { label: string; detail: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
      <span><span className="block font-semibold text-slate-950">{label}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{detail}</span></span>
      <ExternalLink className="size-4 shrink-0 text-slate-400" />
    </a>
  )
}

function ExternalSource({ source, label }: { source: { name: string; url: string; checkedAt: string }; label: string }) {
  return (
    <a href={source.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline">
      {label}: {source.name}<ExternalLink className="size-3" />
    </a>
  )
}
