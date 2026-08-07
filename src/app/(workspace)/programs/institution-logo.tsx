"use client"

import { useState } from "react"
import {
  institutionIconCandidates,
  institutionInitials,
} from "@/lib/programs/institution-brand"

export function InstitutionLogo({
  institutionName,
  websiteUrl,
}: {
  institutionName: string
  websiteUrl: string | null
}) {
  const candidates = institutionIconCandidates(websiteUrl)
  const [candidateIndex, setCandidateIndex] = useState(0)
  const source = candidates[candidateIndex]
  const initials = institutionInitials(institutionName)

  return (
    <div
      role="img"
      aria-label={`${institutionName} logo`}
      title={institutionName}
      className="hidden size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#ecebe7] bg-white shadow-[0_4px_14px_rgba(30,35,25,0.05)] sm:grid"
    >
      {source ? (
        // The image is loaded directly from the institution's official HTTPS domain.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={source}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-full object-contain p-2.5"
          onError={() => setCandidateIndex((index) => index + 1)}
        />
      ) : (
        <span className="px-1 text-center text-[13px] font-bold tracking-wide text-[#4f5d49]">
          {initials || "UNI"}
        </span>
      )}
    </div>
  )
}
