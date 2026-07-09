import "server-only"

import { cookies, headers } from "next/headers"

export type AcquisitionContext = {
  sessionId: string | null
  firstPath: string | null
  utm: Record<string, string>
  referer: string | null
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const

function clean(value: string | undefined, maxLength = 500): string | null {
  const normalized = value?.trim()
  return normalized ? normalized.slice(0, maxLength) : null
}

export function getServerAcquisitionContext(): AcquisitionContext {
  const cookieStore = cookies()
  const requestHeaders = headers()
  const utm: Record<string, string> = {}

  for (const key of UTM_KEYS) {
    const value = clean(cookieStore.get(`cc_${key}`)?.value, 180)
    if (value) utm[key] = value
  }

  return {
    sessionId: clean(cookieStore.get("cc_sid")?.value, 80),
    firstPath: clean(cookieStore.get("cc_first_path")?.value),
    utm,
    referer: clean(requestHeaders.get("referer") ?? undefined),
  }
}

export function sanitizeDecisionContext(input: Record<string, string> | undefined): Record<string, string> {
  if (!input) return {}

  const allowedKeys = ["citizenship", "residence", "degree", "timeline", "occupation", "field", "budget", "goal"]
  return Object.fromEntries(
    allowedKeys.flatMap((key) => {
      const value = clean(input[key], 120)
      return value ? [[key, value]] : []
    }),
  )
}
