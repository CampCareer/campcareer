import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { pageMetadata } from "@/lib/seo"
import { FIELDS } from "@/lib/fields"
import { JsonLd, itemListLd } from "@/components/seo/json-ld"

export const metadata = pageMetadata({
  title: "Browse by Field of Study — ROI Across 5 Countries",
  description: "Pick your field of study and compare university ROI, graduate salaries, and payback periods across the US, UK, Ireland, Canada, and Australia.",
  path: "/fields",
})

export default function FieldsIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLd data={itemListLd(FIELDS.map((f) => ({ name: f.label, path: `/fields/${f.slug}` })))} />

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Browse by Field of Study
        </h1>
        <p className="text-slate-500">
          Compare ROI, graduate salaries, and payback periods for your field across the US, UK,
          Ireland, Canada, and Australia — built from government salary data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIELDS.map((field) => (
          <Link
            key={field.slug}
            href={`/fields/${field.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm hover:border-blue-300 hover:shadow transition-all"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <GraduationCap className="w-4.5 h-4.5" />
            </span>
            <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
              {field.label}
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-slate-400">
        ROI scores are estimates based on public data —{" "}
        <Link href="/methodology" className="underline hover:text-slate-500">see methodology</Link>.
      </p>
    </div>
  )
}
