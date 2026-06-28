"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink, GraduationCap, DollarSign } from "lucide-react"
import type { StateEmploymentOccupation } from "@/lib/employment-data"
import JobListings from "@/app/map/JobListings"
import { WiseCta, AiraloCta } from "@/components/partners/partner-cta"
import { STATE_NAMES, type StateCode } from "@/app/map/states"
import { useTranslations } from "@/lib/i18n/locale-provider"

export function OccupationCard({
  occupation,
  stateCode,
}: {
  occupation: StateEmploymentOccupation
  stateCode: StateCode
}) {
  const [open, setOpen] = useState(false)
  const stateName = STATE_NAMES[stateCode]
  const t = useTranslations()

  return (
    <div className="rounded-lg border border-slate-200 bg-white transition-colors">
      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-50"
      >
        <span className="w-6 shrink-0 text-sm tabular-nums text-slate-400">
          {occupation.rank}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800 truncate">
            {occupation.name}
          </p>
          <p className="text-xs text-slate-400">
            {occupation.emp.toLocaleString()} {t.employment.employed}
            {occupation.estimated_state_salary_aud != null && (
              <span className="ml-2">
                · {t.employment.estimatedSalary.replace('{amount}', occupation.estimated_state_salary_aud.toLocaleString())}
              </span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {occupation.seek_url && (
            <a
              href={occupation.seek_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              <ExternalLink className="h-3 w-3" />
              {t.employment.searchOnSeek}
            </a>
          )}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          {/* Salary info */}
          <div className="mb-3 rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t.employment.salary}
            </p>
            <div className="mt-1.5 space-y-1">
              {occupation.median_salary_aud != null && (
                <p className="flex items-center gap-1.5 text-sm text-slate-700">
                  <DollarSign className="h-3.5 w-3.5 text-green-600" />
                  {t.employment.nationalMedian.replace('{amount}', occupation.median_salary_aud.toLocaleString())}
                </p>
              )}
              {occupation.estimated_state_salary_aud != null && (
                <p className="flex items-center gap-1.5 text-sm text-slate-700">
                  <DollarSign className="h-3.5 w-3.5 text-green-600" />
                  {t.employment.stateEstimate.replace('{stateName}', stateName).replace('{amount}', occupation.estimated_state_salary_aud.toLocaleString())}
                </p>
              )}
              {occupation.median_salary_aud == null && occupation.estimated_state_salary_aud == null && (
                <p className="text-sm text-slate-400">{t.employment.salaryNotAvailable}</p>
              )}
            </div>
          </div>

          {/* Related study */}
          {occupation.broad_field && (
            <div className="mb-3 rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t.employment.relatedStudy}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {occupation.broad_field}
              </p>
              {occupation.courses.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {occupation.courses.slice(0, 4).map((course) => (
                    <a
                      key={course.id}
                      href={course.url ?? "#"}
                      target={course.url ? "_blank" : undefined}
                      rel={course.url ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-2 rounded-md bg-white px-2.5 py-2 text-xs transition-colors hover:bg-blue-50"
                    >
                      <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-700 truncate">{course.title}</p>
                        <p className="text-slate-400">
                          {course.institution_name}
                          {course.duration_years != null && ` · ${course.duration_years} yr`}
                          {course.tuition_fee_aud != null && ` · $${course.tuition_fee_aud.toLocaleString()}`}
                        </p>
                      </div>
                      {course.url && <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Job openings — with subtitle */}
          {stateCode && (
            <div className="mb-3">
              <JobListings what={occupation.name} where={stateName} country="AU" />
            </div>
          )}

          {/* Affiliate links — NO subtitle, just cards */}
          <div className="space-y-2">
            <WiseCta />
            <AiraloCta />
          </div>
        </div>
      )}
    </div>
  )
}
