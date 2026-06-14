"use client"

import { useEffect, useState } from "react"
import { ImmigrationTimeline } from "@/components/immigration-timeline"
import { COUNTRY_META, type TimelineCountry } from "@/lib/degree-risk"
import { useTranslations } from "@/lib/i18n/locale-provider"

/**
 * Per-country immigration timelines for the /compare page. Stacks one full-width
 * <ImmigrationTimeline> per country so the STUDY / VISA / PR columns line up
 * top-to-bottom for easy comparison. Each timeline keeps its own state, so the
 * US birth-country toggle is isolated.
 */
export function CompareTimelines({ field }: { field: string }) {
  const t = useTranslations()
  const tl = t.degreeRisk.timeline
  const [rows, setRows] = useState<TimelineCountry[]>([])

  useEffect(() => {
    if (!field.trim()) {
      setRows([])
      return
    }
    const ctrl = new AbortController()
    fetch(`/api/degree-risk/timeline?field=${encodeURIComponent(field)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j) => setRows(j.countries ?? []))
      .catch(() => {
        /* ignore — section just hides */
      })
    return () => ctrl.abort()
  }, [field])

  if (!field.trim() || rows.length === 0) return null

  return (
    <section className="mt-2">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">{tl.compareHeading}</h2>
      <p className="text-sm text-slate-500 mb-4">{tl.compareSubtitle}</p>
      <div className="space-y-4">
        {rows.map((r) => (
          <ImmigrationTimeline
            key={r.country}
            country={r.country}
            postStudyYears={r.postStudyYears}
            visa={r.visa}
            postStudyCaption={r.stemBranch ? tl.stemCaption : undefined}
            heading={
              <span className="flex items-center gap-2">
                <span>{COUNTRY_META[r.country].flag}</span>
                {COUNTRY_META[r.country].name}
              </span>
            }
          />
        ))}
      </div>
    </section>
  )
}
