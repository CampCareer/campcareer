import Link from "next/link"

export function CountryDataNotice({ countryName }: { countryName: string }) {
  return (
    <section
      aria-labelledby="comparison-methodology"
      className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700"
    >
      <h2 id="comparison-methodology" className="text-lg font-semibold text-slate-950">
        Career comparison methodology
      </h2>
      <p className="mt-2 leading-7">
        CampCareer publishes job-level comparisons for {countryName} only after
        official occupation codes, wage definitions, source snapshots, and
        editorial review align. Until then, this profile is a country guide and
        is not included in ranked career comparisons.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex font-semibold text-indigo-700 underline underline-offset-4"
      >
        Compare verified career paths
      </Link>
    </section>
  )
}
