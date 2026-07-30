"use client"

import { useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { type RouteLocale } from "@/data/route-guides"
import { findAustraliaRouteCandidates, type AustraliaRouteCandidate } from "@/data/route-taxonomy"
import { findPublishedRoute, getPublishedAustraliaRouteCandidates, routeResultsHref, type RouteGoal } from "@/lib/route-search"
import { recordRouteEvent } from "@/lib/analytics"
import { localizePath } from "@/lib/i18n/config"
import { RouteRequestForm } from "./route-request-form"

const CURRENT_CITIZENSHIP = "KR"
const PUBLISHED_DESTINATIONS = [{ value: "AU", label: { ko: "호주", en: "Australia" } }] as const
const DEFAULT_SUGGESTIONS = getPublishedAustraliaRouteCandidates()

export function RouteSearchLanding({ locale }: { locale: RouteLocale }) {
  const router = useRouter()
  const isKo = locale === "ko"
  const [destination, setDestination] = useState("AU")
  const [field, setField] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<AustraliaRouteCandidate | null>(null)
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false)
  const [goal, setGoal] = useState<RouteGoal>("work")
  const [showRequest, setShowRequest] = useState(false)
  const didStart = useRef(false)
  const destinationOptions = PUBLISHED_DESTINATIONS.map((country) => ({ value: country.value, label: country.label[locale] }))
  const suggestions = useMemo(() => {
    if (field.trim()) return findAustraliaRouteCandidates(field)
    return DEFAULT_SUGGESTIONS
  }, [field])

  function trackStart() {
    if (didStart.current) return
    didStart.current = true
    recordRouteEvent("route_search_started", { locale, surface: "landing" })
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    trackStart()
    recordRouteEvent("route_search_submitted", { locale, surface: "landing" })
    // On narrow screens the suggestions sit in the normal form flow; close
    // them before changing state so the research-request explanation is not
    // visually covered by a stale popover.
    setSuggestionsOpen(false)
    const submittedField = selectedCandidate?.id ?? field
    const guide = findPublishedRoute({ citizenship: CURRENT_CITIZENSHIP, destination, field: submittedField, goal })
    if (guide) {
      router.push(localizePath(routeResultsHref(selectedCandidate?.label[locale] ?? field, goal), locale))
      return
    }
    setShowRequest(true)
  }

  function chooseCandidate(candidate: AustraliaRouteCandidate) {
    setSelectedCandidate(candidate)
    setField(candidate.label[locale])
    setSuggestionsOpen(false)
    setShowRequest(false)
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-white text-[#1b1b1b]">
      <section className="mx-auto min-h-[calc(100dvh-4rem)] max-w-[1240px] px-5 py-5 sm:px-6 sm:py-6">
        <form onSubmit={submit} className="mx-auto w-full max-w-[1240px] overflow-visible rounded-2xl border border-[#d8d8d4] bg-white shadow-[0_4px_16px_rgba(24,24,24,.05)]">
          <div className="grid divide-y divide-[#e7e7e3] md:grid-cols-[1fr_1.65fr_.82fr_auto] md:divide-x md:divide-y-0">
            <SearchSelect label={isKo ? "목적지" : "Destination"} value={destination} onFocus={trackStart} onChange={(value) => { setDestination(value); setShowRequest(false) }} options={destinationOptions} />
            <div className="relative px-4 py-3 sm:px-5">
              <label className="block">
                <span className="block text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">{isKo ? "하고 싶은 일" : "What do you want to do?"}</span>
                <input
                  value={field}
                  required
                  maxLength={80}
                  onFocus={() => { trackStart(); setSuggestionsOpen(true) }}
                  onChange={(event) => { setField(event.target.value); setSelectedCandidate(null); setSuggestionsOpen(true); setShowRequest(false) }}
                  placeholder={isKo ? "예: 간호사, 뷰티, 소프트웨어 개발" : "e.g. nurse, beauty, software development"}
                  className="mt-1 h-6 w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-400"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={isSuggestionsOpen}
                  aria-controls="route-intent-suggestions"
                />
              </label>
              {isSuggestionsOpen && (
                <div id="route-intent-suggestions" role="listbox" className="mt-2 max-h-[26rem] overflow-y-auto rounded-xl border border-[#e7e7e3] bg-white p-2 shadow-[0_15px_36px_rgba(24,24,24,.14)] md:absolute md:left-0 md:right-0 md:top-[calc(100%+.5rem)] md:z-20 md:mt-0">
                  {suggestions.length > 0 && <div><p className="px-2 py-2 text-[11px] font-bold uppercase tracking-[.08em] text-slate-400">{field.trim() ? (isKo ? "관련 직업" : "Related careers") : (isKo ? "추천 직업" : "Suggested careers")}</p>{suggestions.map((candidate) => <CandidateOption key={candidate.id} candidate={candidate} locale={locale} onChoose={chooseCandidate} />)}</div>}
                  {field.trim() && suggestions.length === 0 && <p className="px-3 py-6 text-center text-sm text-slate-500">{isKo ? "일치하는 직업이 없습니다. 검색하면 조사 요청으로 남길 수 있어요." : "No matching career yet. You can submit it as a research request."}</p>}
                </div>
              )}
            </div>
            <label className="block px-4 py-3 sm:px-5">
              <span className="block text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">{isKo ? "목표" : "Goal"}</span>
              <select value={goal} onFocus={trackStart} onChange={(event) => { setGoal(event.target.value as RouteGoal); setShowRequest(false) }} className="mt-1 h-6 w-full appearance-none border-0 bg-transparent p-0 text-sm font-semibold text-slate-950 outline-none">
                <option value="work">{isKo ? "취업" : "Work"}</option><option value="study">{isKo ? "학업" : "Study"}</option><option value="study-to-work">{isKo ? "학업 후 취업" : "Study to work"}</option>
              </select>
            </label>
            <button type="submit" className="m-2 h-10 self-center rounded-xl bg-[#1b1b1b] px-5 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"><span className="inline-flex items-center gap-2"><Search className="size-4" />{isKo ? "검색" : "Search"}</span></button>
          </div>
        </form>

        {showRequest && <div className="mx-auto w-full max-w-3xl"><RouteRequestForm locale={locale} citizenship={CURRENT_CITIZENSHIP} destination={destination} field={selectedCandidate?.label[locale] ?? field} goal={goal} /></div>}
      </section>
    </main>
  )
}

function SearchSelect({ label, value, onFocus, onChange, options }: { label: string; value: string; onFocus: () => void; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return <label className="block px-4 py-3 sm:px-5"><span className="block text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">{label}</span><select value={value} onFocus={onFocus} onChange={(event) => onChange(event.target.value)} className="mt-1 h-6 w-full appearance-none border-0 bg-transparent p-0 text-sm font-semibold text-slate-950 outline-none">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function CandidateOption({ candidate, locale, onChoose }: { candidate: AustraliaRouteCandidate; locale: RouteLocale; onChoose: (candidate: AustraliaRouteCandidate) => void }) {
  const secondaryLocale = locale === "ko" ? "en" : "ko"
  return <button type="button" role="option" aria-selected={false} onMouseDown={(event) => event.preventDefault()} onClick={() => onChoose(candidate)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[#f6f6f4]"><span className="text-sm font-semibold text-slate-950">{candidate.label[locale]}</span><span className="text-xs text-slate-500">{candidate.label[secondaryLocale]}</span></button>
}
