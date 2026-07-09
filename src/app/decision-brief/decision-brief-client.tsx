"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, ExternalLink, ShieldAlert } from "lucide-react"
import { VisaAlertForm } from "@/components/visa-alert-form"
import { track } from "@/lib/analytics"
import { getRecommendationLabels, parseRecommendationInput, recommendCountries } from "@/lib/country-recommendation"

function value(params: URLSearchParams, key: string) {
  const raw = params.get(key)?.trim()
  return raw ? raw.slice(0, 120) : ""
}

export function DecisionBriefClient() {
  const params = useMemo(
    () => new URLSearchParams(typeof window === "undefined" ? "" : window.location.search),
    [],
  )
  const recommendationInput = useMemo(() => parseRecommendationInput({
    field: params.get("field"),
    budget: params.get("budget"),
    goal: params.get("goal"),
    risk: params.get("risk"),
    language: params.get("language"),
  }), [params])
  const countries = useMemo(() => recommendCountries(recommendationInput).slice(0, 3), [recommendationInput])
  const labels = getRecommendationLabels(recommendationInput)
  const context = useMemo(() => ({
    citizenship: value(params, "citizenship"),
    residence: value(params, "residence"),
    degree: value(params, "degree"),
    timeline: value(params, "timeline"),
    occupation: value(params, "occupation"),
    field: labels.field,
    budget: labels.budget,
    goal: labels.goal,
  }), [labels, params])

  useEffect(() => {
    track("decision_result_view", {
      field: recommendationInput.field,
      goal: recommendationInput.goal,
      top_country: countries[0]?.code ?? "unknown",
    })
  }, [countries, recommendationInput.field, recommendationInput.goal])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-950">
            CampCareer home
          </Link>
          <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-brand">Decision brief</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">
            Your three strongest study and work pathways.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            This is a starting comparison, not visa approval advice. Every country card separates official policy sources from market and CampCareer estimates.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {Object.entries(context).map(([label, item]) => (
              <span key={label} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                <strong className="mr-1 text-slate-900">{label}:</strong>{item || "Not provided"}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-5 lg:grid-cols-3">
          {countries.map((country, index) => (
            <article key={country.code} className="flex min-h-[420px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">#{index + 1} recommendation</p>
                  <h2 className="mt-2 text-2xl font-semibold">{country.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">{country.fitLabel}</p>
                </div>
                <span className="rounded-md bg-slate-950 px-3 py-1.5 text-sm font-bold text-white">{country.matchScore}</span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Metric label="First salary" value={country.salaries.first} />
                <Metric label="5-year salary" value={country.salaries.year5} />
                <Metric label="Monthly rent" value={country.rent} />
                <Metric label="Initial budget" value={country.initialBudget} />
              </dl>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Why it ranked</p>
                <ul className="mt-3 space-y-2">
                  {country.reasons.slice(0, 2).map((reason) => (
                    <li key={reason} className="flex gap-2 text-sm leading-6 text-slate-600">
                      <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-900"><ShieldAlert className="h-3.5 w-3.5" />Check before applying</p>
                <p className="mt-1 text-xs leading-5 text-amber-800">{country.cautions[0] ?? country.detail.watchouts[0]}</p>
              </div>

              <div className="mt-auto pt-5">
                <a
                  href={country.sources.policy.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Policy source: {country.sources.policy.sourceName}<ExternalLink className="h-3 w-3" />
                </a>
                <Link
                  href={country.detailHref}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Open country evidence <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Next decision</p>
            <h2 className="mt-2 text-2xl font-semibold">Validate schools and career pathways next.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Country ranking uses your major, budget, goal, risk tolerance, and language readiness. Citizenship and residence are saved as context, but are not yet used to determine visa eligibility.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/roi-explorer?country=${countries[0]?.code.toLowerCase() ?? "au"}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:underline">
                Compare schools and ROI <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/degree-risk" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 hover:underline">
                Check degree risk <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <VisaAlertForm
            country="all"
            field={recommendationInput.field}
            decisionContext={context}
            heading="Save this decision brief"
            subtitle="Confirm your email and we will save this context for policy-change alerts and future decision updates."
            submitLabel="Save brief"
          />
        </section>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-950">{value}</dd>
    </div>
  )
}
