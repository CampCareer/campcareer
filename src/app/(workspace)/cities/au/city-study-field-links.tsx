import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  getAuProgrammaticStudyPagesForCity,
  type AuProgrammaticCitySlug,
} from "@/lib/programs/au-programmatic-seo"

export function CityStudyFieldLinks({
  citySlug,
  cityName,
}: {
  citySlug: AuProgrammaticCitySlug
  cityName: string
}) {
  const pages = getAuProgrammaticStudyPagesForCity(citySlug)
  if (pages.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-8 lg:px-10">
      <div className="rounded-2xl border border-[#dfe6dc] bg-[#f7faf5] p-5 sm:p-6">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#3e7a2e]">Explore by study field</p>
        <h2 className="mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">Popular program areas in {cityName}</h2>
        <p className="mt-2 max-w-3xl text-[11.5px] leading-5 text-[#77746e]">These pages combine active CRICOS programs with verified {cityName} delivery locations and the city evidence shown above.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#dfe6dc] bg-white px-3.5 py-3 text-[11.5px] font-semibold text-[#4f4d48] transition hover:border-[#3e7a2e]/50 hover:text-[#3e7a2e]"
            >
              <span>{page.field.label}</span><ArrowRight className="size-3.5 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
