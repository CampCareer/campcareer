import Link from "next/link"
import { AU_NURSING_PROGRAM_IDS } from "@/lib/data-foundation/compare-adapters/au-nursing-programmes"
import { AU_NURSING_PROGRAM_COMPARE_REPOSITORY } from "@/lib/data-foundation/compare-adapters/au-nursing-programmes-repository"
import ProgramsCompareMatrix from "./programs-compare-matrix"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Programs Compare",
  description: "Compare verified programme details from canonical sources.",
  robots: { index: false, follow: false } as const,
}

type ComparePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function toSearchParams(values: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string") params.set(key, value)
    else if (Array.isArray(value) && value[0]) params.set(key, value[0])
  }
  return params
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = toSearchParams(await searchParams)
  const type = params.get("type")
  if (type && type !== "program") return <UnsupportedComparison type={type} />

  const country = params.get("country")?.toUpperCase() ?? "AU"
  const field = params.get("field") ?? "nursing"
  if (country !== "AU" || field !== "nursing") return <UnsupportedComparison type="program" />

  const programs = await AU_NURSING_PROGRAM_COMPARE_REPOSITORY.getProgramCompareItems(AU_NURSING_PROGRAM_IDS)
  const availablePrograms = programs

  return (
    <section className="mx-auto max-w-6xl pb-4" aria-label="Programs comparison">
      <CompareModeNavigation activeType="program" />
      <header className="border-b border-[#e7e6e3] pb-6 sm:pb-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">Programs</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-[40px]">Compare programs</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6f6d68]">Compare institution, qualification, duration, international tuition and source-backed availability.</p>
        <p className="mt-3 text-sm font-medium text-[#4a4842]">Australia · Nursing</p>
      </header>
      <ProgramsCompareMatrix availablePrograms={availablePrograms} />
    </section>
  )
}

function CompareModeNavigation({ activeType }: { activeType: "program" | "country" | "career" | null }) {
  const item = (type: "program" | "country" | "career", label: string, href: string) => <Link href={href} aria-current={activeType === type ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-4 font-semibold ${activeType === type ? "bg-blue-600 text-white" : "text-[#5f5d57] hover:bg-[#fafaf9]"}`}>{label}</Link>
  return <nav aria-label="Compare categories" className="mb-6 flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-[#e7e6e3] bg-white p-1 text-sm">{item("program", "Programs", "/compare?type=program")}{item("country", "Countries", "/compare?type=country&goal=registered-nurse&profile=starting-from-scratch")}{item("career", "Careers", "/compare?type=career&country=AU&profile=starting-from-scratch")}</nav>
}

function UnsupportedComparison({ type }: { type: string }) {
  const activeType = type === "country" || type === "career" ? type : null
  return <section className="mx-auto max-w-6xl pb-4" aria-label="Comparison unavailable"><CompareModeNavigation activeType={activeType} /><header className="border-b border-[#e7e6e3] pb-6 sm:pb-7"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">Compare</p><h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-[40px]">Comparison not available</h1><p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6f6d68]">The {type} comparison is handled by its existing product surface.</p></header><Link href="/compare?type=program" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">Open Programs Compare</Link></section>
}
