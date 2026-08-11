import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, Clock3, GraduationCap, Languages, MapPin, ShieldCheck } from "lucide-react"
import { getKrProgramBySlug } from "@/lib/programs/kr-programs.server"
import { isIndexableKrProgramSlug, krProgramDetailPath } from "@/lib/programs/kr-program-seo"
import { institutionDetailPath } from "@/lib/institutions/institution-search"

const BASE_URL = "https://www.campcareer.com"
const KR_PUBLIC_INSTITUTION_SLUGS = new Set([
  "ewha-womans-university","hanyang-university","kaist","korea-university","kyung-hee-university","postech","pusan-national-university","seoul-national-university","sungkyunkwan-university","yonsei-university",
])

type Params = { params: Promise<{ program: string }> }

function safeSlug(value: string) {
  const slug = value.trim().toLowerCase()
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null
}

function safeUrl(value: string | null) {
  if (!value) return null
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null } catch { return null }
}

function durationLabel(months: number | null) {
  if (!months) return "Not published"
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "year" : "years"}`
  return `${months} months`
}

async function loadProgram(segment: string) {
  const slug = safeSlug(segment)
  return slug ? getKrProgramBySlug(slug) : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) return { title: "Program not found", robots: { index: false, follow: false } }
  return {
    title: `${program.title} · ${program.institutionName}`,
    description: `${program.title} at ${program.institutionName}, published from Study in Korea international degree-seeking data. Current intake status is tracked separately.`,
    alternates: { canonical: `${BASE_URL}${krProgramDetailPath(program.slug)}` },
    robots: { index: isIndexableKrProgramSlug(program.slug) && program.verificationTier === "A", follow: true },
  }
}

export default async function KrProgramDetailPage({ params }: Params) {
  const { program: segment } = await params
  const program = await loadProgram(segment)
  if (!program) notFound()
  const canonicalPath = krProgramDetailPath(program.slug)
  if (segment !== program.slug) permanentRedirect(canonicalPath)

  const institutionPath = program.institutionSlug && KR_PUBLIC_INSTITUTION_SLUGS.has(program.institutionSlug) ? institutionDetailPath("KR", program.institutionSlug) : null
  const studyUrl = safeUrl(program.studyInKoreaUrl)
  const officialUrl = safeUrl(program.officialProgramUrl)
  const admissionUrl = safeUrl(program.admissionSourceUrl)
  const guideUrl = safeUrl(program.admissionGuideUrl)

  return <div className="mx-auto max-w-5xl">
    <Link href="/programs?country=KR" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]"><ArrowLeft className="size-3.5" /> Back to South Korea programs</Link>
    <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <main className="min-w-0">
        <header className="rounded-2xl border border-[#d9e3f7] bg-gradient-to-br from-[#f7f9ff] via-white to-[#f4f8f2] p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 text-[10.5px] font-semibold">
            <span className="rounded-full bg-white px-3 py-1">{program.degreeLevel}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1 text-[#2563eb]"><ShieldCheck className="size-3" />Study in Korea verified</span>
            <span className={program.verificationTier === "A" ? "rounded-full bg-[#3e7a2e] px-3 py-1 text-white" : "rounded-full bg-[#f3f4f1] px-3 py-1 text-[#686660]"}>Tier {program.verificationTier}</span>
          </div>
          <h1 className="mt-5 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#1b1b1b] sm:text-[36px]">{program.title}</h1>
          {program.sourceDepartmentName && program.sourceDepartmentName !== program.title && <p className="mt-2 text-[12px] text-[#77746e]">Source department: {program.sourceDepartmentName}</p>}
          {institutionPath ? <Link href={institutionPath} className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4f4d48] hover:text-[#3e7a2e] hover:underline"><Building2 className="size-4" />{program.institutionName}</Link> : <p className="mt-3 text-[14px] font-semibold text-[#4f4d48]">{program.institutionName}</p>}
          {program.city && <p className="mt-2 flex items-center gap-2 text-[12.5px] text-[#77746e]"><MapPin className="size-4" />{program.city}</p>}
        </header>

        <section className="mt-5 rounded-xl border border-[#d9e3f7] bg-[#f7f9ff] p-5 text-[#315f9f]">
          <h2 className="text-[14.5px] font-semibold">International degree pathway verified · current application window not confirmed</h2>
          <p className="mt-2 text-[12px] leading-5">The Korean Government/NIIED Study in Korea profile lists this department in an international degree-seeking context. CampCareer does not treat that listing as proof that applications are open today.</p>
          {program.enrollmentPeriod && <p className="mt-3 text-[11px] font-semibold">Typical enrollment period: {program.enrollmentPeriod}</p>}
          {program.applicationPeriod && <p className="mt-1 text-[11px]">Published application period: {program.applicationPeriod}</p>}
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Metric icon={<GraduationCap className="size-4" />} label="Degree level" value={program.degreeLevel} />
          <Metric icon={<Clock3 className="size-4" />} label="Duration" value={durationLabel(program.durationMonths)} />
          <Metric icon={<Languages className="size-4" />} label="English-course ratio" value={program.englishCourseRatio ?? "Not published"} />
          <Metric icon={<CalendarDays className="size-4" />} label="Current intake" value="Not yet program-level verified" />
        </div>

        <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#2563eb]" /><h2 className="text-[14.5px] font-semibold">Source verification</h2></div>
          <p className="mt-3 text-[12px] leading-5 text-[#65625c]">{program.sourceVerificationLabel ?? "Study in Korea / NIIED international degree-seeking source"}</p>
          <p className="mt-3 text-[10.5px] leading-5 text-[#8f8c85]">CampCareer does not convert Study in Korea or IEQAS participation into a programme-accreditation claim. Professional licences and regulated occupation requirements remain separate from academic admission.</p>
        </section>

        {program.occupationIds.length > 0 && <section className="mt-5 rounded-xl border border-[#e7e6e3] bg-white p-5 sm:p-6"><h2 className="text-[14.5px] font-semibold">CampCareer career links</h2><div className="mt-3 flex flex-wrap gap-2">{program.occupationIds.map((id) => <span key={id} className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[10.5px] font-medium text-[#686660]">{id.replace(/-/g, " ")}</span>)}</div><p className="mt-3 text-[10.5px] leading-5 text-[#8f8c85]">These are manually reviewed education relationships, not professional-registration guarantees.</p></section>}
      </main>

      <aside className="rounded-2xl border border-[#e7e6e3] bg-white p-5 lg:sticky lg:top-20">
        <h2 className="text-[14px] font-semibold">Source status</h2>
        <dl className="mt-4 space-y-3 text-[11.5px]"><div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Program source</dt><dd className="font-semibold">Tier {program.verificationTier}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">International context</dt><dd className="font-semibold">Verified</dd></div><div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Current open intake</dt><dd className="font-semibold">Not confirmed</dd></div><div className="flex justify-between gap-4"><dt className="text-[#8f8c85]">Programme accreditation claim</dt><dd className="font-semibold">None inferred</dd></div></dl>
        <div className="mt-5 space-y-2">{studyUrl && <SourceLink href={studyUrl} primary>Study in Korea source</SourceLink>}{officialUrl && <SourceLink href={officialUrl}>Official program page</SourceLink>}{admissionUrl && admissionUrl !== studyUrl && <SourceLink href={admissionUrl}>Admission source</SourceLink>}{guideUrl && guideUrl !== admissionUrl && guideUrl !== studyUrl && <SourceLink href={guideUrl}>Admission guide</SourceLink>}</div>
        <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">Visa, language, admission and professional-licensing requirements change independently. Unknown values remain unknown until current evidence is verified.</p>
      </aside>
    </div>
  </div>
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-[#e7e6e3] bg-white p-4"><div className="flex items-center gap-2 text-[#8f8c85]">{icon}<span className="text-[10.5px] font-semibold uppercase tracking-[0.06em]">{label}</span></div><p className="mt-2 text-[13px] font-semibold text-[#34332f]">{value}</p></div>
}

function SourceLink({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className={primary ? "flex items-center justify-center gap-2 rounded-lg bg-[#3e7a2e] px-4 py-2.5 text-[12px] font-semibold text-white" : "flex items-center justify-center gap-2 rounded-lg border border-[#cfd9ca] px-4 py-2.5 text-[12px] font-semibold text-[#3e7a2e]"}>{children}<ArrowUpRight className="size-3.5" /></a>
}
