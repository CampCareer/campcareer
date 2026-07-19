import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, BarChart3, BriefcaseBusiness, ExternalLink, GraduationCap, MapPin, WalletCards } from 'lucide-react'
import { LAUNCH_COUNTRIES } from '@/data/launch-countries'
import type { AuStudyValueMatch } from '@/lib/au-study-value-matches'
import { StudyFinder } from '@/components/study/study-finder'

const STATE_IMAGES: Record<string, string> = {
  NSW: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1100&h=680&fit=crop&auto=format',
  VIC: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1100&h=680&fit=crop&auto=format',
  QLD: 'https://images.unsplash.com/photo-1691028355763-0c4144bf441b?w=1100&h=680&fit=crop&auto=format',
  WA: 'https://images.unsplash.com/photo-1562161092-01d53ec54edd?w=1100&h=680&fit=crop&auto=format',
  SA: 'https://images.unsplash.com/photo-1596017497096-90ee17fb4e82?w=1100&h=680&fit=crop&auto=format',
  NT: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1100&h=680&fit=crop&auto=format',
  ACT: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1100&h=680&fit=crop&auto=format',
  TAS: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1100&h=680&fit=crop&auto=format',
}

function money(value: number) { return `A$${Math.round(value).toLocaleString()}` }
function percent(value: number) { return `${Math.round(value * 100)}%` }
function dateLabel(value: string | null) { return value ? new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : 'Current source' }
function location(match: AuStudyValueMatch) { return [match.city, match.state].filter(Boolean).join(', ') || 'Australia' }
function matchReason(match: AuStudyValueMatch) {
  return match.valueReasons.length > 0
    ? `${match.valueReasons.join(' · ')}.`
    : 'Complete tuition, earnings and employment indicators available.'
}

function Metric({ icon: Icon, label, value }: { icon: typeof WalletCards; label: string; value: string }) {
  return <div>
    <p className="flex items-center gap-1 text-[11px] font-medium text-slate-500"><Icon className="size-3.5 text-slate-400" />{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
  </div>
}

function ValueMatchCard({ match, eagerImage }: { match: AuStudyValueMatch; eagerImage: boolean }) {
  const providerHref = `/au/study/providers/${encodeURIComponent(match.institutionId)}`
  const compareHref = `/au/study/compare?schools=${encodeURIComponent(match.institutionId)}`
  const image = STATE_IMAGES[match.state ?? ''] ?? STATE_IMAGES.NSW
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg">
    <Link href={providerHref} className="relative block h-44 overflow-hidden">
      <Image src={image} alt={`Study in ${location(match)}`} fill loading={eagerImage ? 'eager' : 'lazy'} sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white"><span className="inline-flex items-center gap-1.5 text-xs font-medium"><MapPin className="size-3.5" />Study in {location(match)}</span><span className="rounded-full border border-white/35 bg-slate-950/35 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">Bachelor</span></div>
    </Link>
    <div className="flex min-h-80 flex-col p-5">
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">Strong value match</p>
      <p className="mt-2 text-sm font-medium text-slate-600">{match.field}</p>
      <h3 className="mt-1 text-xl font-semibold leading-7 text-slate-950">{match.university}</h3>
      <p className="mt-3 min-h-10 text-sm leading-5 text-slate-600"><span className="font-semibold text-slate-800">Why it stands out:</span> {matchReason(match)}</p>
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5 text-xs leading-5 text-emerald-900"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" /><p><a href={match.courseEvidenceHref} target="_blank" rel="noreferrer" className="font-semibold hover:underline">{match.courseEvidenceLabel} <ExternalLink className="mb-0.5 inline size-3" /></a><span className="block text-emerald-800/80">Matched to this Bachelor field group · checked {dateLabel(match.courseEvidenceCheckedAt)}</span></p></div>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-y border-slate-100 py-4">
        <Metric icon={WalletCards} label="Annual tuition" value={money(match.tuition)} />
        <Metric icon={BriefcaseBusiness} label="Graduate earnings*" value={money(match.medianEarnings)} />
        <Metric icon={GraduationCap} label="Employment*" value={percent(match.employmentRate)} />
        <Metric icon={BarChart3} label="Estimated payback" value={`${match.paybackYears.toFixed(1)} years`} />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5"><Link href={providerHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-blue-700">Review outcomes <ArrowRight className="size-4" /></Link><Link href={compareHref} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"><BarChart3 className="size-4" />Compare</Link></div>
    </div>
  </article>
}

export function StudyHub({ matches }: { matches: AuStudyValueMatch[] }) {
  const otherDestinations = LAUNCH_COUNTRIES.filter((country) => country.code !== 'AU').slice(0, 4)
  return <main className="min-h-screen bg-transparent">
    <section className="border-b border-slate-200/90 bg-transparent"><div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8"><h1 className="mb-5 text-left text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl lg:whitespace-nowrap lg:text-4xl">Find the right study option</h1><StudyFinder /></div></section>
    <section className="bg-white"><div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-700">Australia · Decision-ready</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Strong value matches in Australia</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Bachelor field groups pass only when tuition, graduate earnings, employment, completion, ROI, payback, course count and a field-matched official or active CRICOS source are all present. This is not a universal university ranking.</p></div><div className="flex items-center gap-4"><Link href="/au/study" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-700">Browse Australia <ArrowRight className="size-4" /></Link><Link href="/au/study/compare" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"><BarChart3 className="size-4" />Compare options</Link></div></div>
      {matches.length > 0 ? <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{matches.map((match, index) => <ValueMatchCard key={match.collegeId} match={match} eagerImage={index < 3} />)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">Australian outcome data is refreshing. You can still browse the full Australia study directory.</div>}
      <aside className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-sm leading-6 text-slate-700"><p className="font-semibold text-slate-950">Read these signals correctly</p><p className="mt-1">Value Match is a data-completeness gate, not a prestige label. Tuition and course counts are grouped by field and AQF level. *Graduate earnings, employment and completion are provider-level QILT measures, so use this page to shortlist and then verify the exact course, fees and entry requirements.</p></aside>
      <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-slate-200 pt-10"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500">Global study discovery</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Continue with another destination</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Destination profiles are available globally. We only add outcome-based value cards when the same data threshold is met.</p></div><Link href="/countries" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">Explore all countries <ArrowRight className="size-4" /></Link></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{otherDestinations.map((country) => <Link key={country.code} href={`/study/search?country=${country.code}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md"><div className="relative h-28 overflow-hidden"><Image src={country.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" /><span className="absolute bottom-3 left-3 text-sm font-semibold text-white">{country.name}</span></div><div className="flex items-center justify-between p-3 text-sm font-medium text-slate-700"><span>Explore study options</span><ArrowRight className="size-4 text-blue-700" /></div></Link>)}</div>
    </div></section>
  </main>
}
