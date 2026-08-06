import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import type { Batch2CountryContent } from "@/data/batch-2-country-content"

export function Batch2MethodologyPage({ profile }: { profile: Batch2CountryContent }) {
  return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
    <JsonLd data={breadcrumbLd([{ name: "Methodology", path: "/methodology" }, { name: profile.countryName, path: `/methodology/${profile.methodologySlug}` }])} />
    <Link href="/methodology" className="text-sm font-medium text-blue-600 hover:underline">Sources &amp; methodology</Link>
    <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{profile.countryName} sources</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{profile.methodologyDescription}</p>
    <div className="mt-10 space-y-5">{profile.methodologySources.map((item) => <section key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4"><div><h2 className="font-display text-lg font-semibold text-slate-900">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.publisher}</p></div><span className="shrink-0 text-xs font-medium text-slate-400">Data: {item.dataDate}</span></div><a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">{item.source}<ExternalLink className="size-3.5" aria-hidden="true" /></a>{item.secondaryUrl ? <a href={item.secondaryUrl} target="_blank" rel="noopener noreferrer" className="ml-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">Secondary official source<ExternalLink className="size-3.5" aria-hidden="true" /></a> : null}<dl className="mt-5 grid gap-4 text-sm leading-6 sm:grid-cols-2"><div><dt className="font-semibold text-slate-800">Method</dt><dd className="mt-1 text-slate-600">{item.method}</dd></div><div><dt className="font-semibold text-slate-800">Coverage and limits</dt><dd className="mt-1 text-slate-600">{item.coverage}</dd></div></dl></section>)}</div>
    <p className="mt-8 text-xs leading-5 text-slate-500">Last reviewed 6 August 2026. A national range describes its source population or stated planning scenario; it does not predict an individual&apos;s salary, expenses, admission, employment or visa outcome.</p>
  </main>
}
