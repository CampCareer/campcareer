"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Briefcase, MapPin, DollarSign } from "lucide-react"

type Job = {
  id: string
  title: string
  company: string
  location: string
  salary_min: number | null
  salary_max: number | null
  currency: string
  url: string
  created: string
}

export default function JobListings({
  what,
  where,
  country,
}: {
  what: string
  where: string
  country: "AU" | "US"
}) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!what) return
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ what, where, country: country.toLowerCase() })
    fetch(`/api/jobs?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); setJobs([]) }
        else setJobs(d.jobs ?? [])
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [what, where, country])

  if (loading) {
    return (
      <div className="mt-5 space-y-2">
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Job Openings</p>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    )
  }

  if (error) return null

  if (jobs.length === 0) return null

  return (
    <div className="mt-5 space-y-2">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
        Job Openings
      </p>
      <div className="space-y-2">
        {jobs.map((job) => (
          <a
            key={job.id}
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-slate-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{job.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  {job.company && (
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.company}
                    </span>
                  )}
                  {job.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            </div>
            {((job.salary_min != null) || (job.salary_max != null)) && (
              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-green-700">
                <DollarSign className="h-3 w-3" />
                {job.salary_min != null ? `$${job.salary_min.toLocaleString()}` : ""}
                {job.salary_min != null && job.salary_max != null ? " - " : ""}
                {job.salary_max != null ? `$${job.salary_max.toLocaleString()}` : ""}
                {job.currency && ` ${job.currency}`}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
