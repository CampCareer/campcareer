import "server-only"
import type { Metadata } from "next"
import Link from "next/link"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

export const revalidate = 86400

export const metadata: Metadata = pageMetadata({
  title: "Work & Study in Canada — Salary, Visa & PR Guide | CampCareer",
  description:
    "Browse 514+ NOC occupations in Canada with median salary, skills shortage ratings, and Express Entry pathways. Government data-backed career planning.",
  path: "/ca",
})

async function getOccupationCount() {
  const { count } = await supabaseAdmin
    .from("occupations_ca")
    .select("*", { count: "exact", head: true })
  return count ?? 514
}

export default async function CaHubPage() {
  const occCount = await getOccupationCount()

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "CampCareer", item: "https://www.campcareer.com" },
            { "@type": "ListItem", position: 2, name: "Canada", item: "https://www.campcareer.com/ca" },
          ],
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Canada</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Work & Live in Canada</h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Real salary data, Express Entry CRS points, and provincial nominee pathways
            for {occCount}+ occupations — sourced from Canadian government statistics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/ca/jobs"
              className="px-5 py-2.5 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-press transition-colors"
            >
              Browse {occCount}+ Occupations
            </Link>
            <Link
              href="/roi-explorer/ca"
              className="px-5 py-2.5 border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Explore Universities
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: `${occCount}+`, label: "NOC Occupations" },
            { value: "13", label: "Provinces & Territories" },
            { value: "Express Entry", label: "PR Pathway" },
            { value: "PNP", label: "Provincial Nominee" },
          ].map(({ value, label }) => (
            <div key={label} className="p-5 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-5">Explore Canada</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/ca/jobs" className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors">
              <div className="font-semibold mb-1">💼 Jobs &amp; Occupations</div>
              <div className="text-sm text-slate-500">{occCount}+ NOC occupations with salary &amp; PR pathway</div>
            </Link>
            <Link href="/roi-explorer/ca" className="group p-5 rounded-xl border border-slate-200 hover:border-brand/40 hover:bg-brand-tint transition-colors">
              <div className="font-semibold mb-1">🎓 Universities &amp; Colleges</div>
              <div className="text-sm text-slate-500">Find programs linked to in-demand occupations</div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
