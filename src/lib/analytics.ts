type EventValue = string | number | boolean | undefined

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const prefix = `${name}=`
  const value = document.cookie.split("; ").find((part) => part.startsWith(prefix))?.slice(prefix.length)
  return value ? decodeURIComponent(value) : null
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `cc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getAcquisitionContext() {
  if (typeof window === "undefined") {
    return { sessionId: null, firstPath: null, utm: {} as Record<string, string>, path: null }
  }

  let sessionId = readCookie("cc_sid")
  if (!sessionId) {
    sessionId = createSessionId()
    writeCookie("cc_sid", sessionId)
  }

  const path = `${location.pathname}${location.search}`
  let firstPath = readCookie("cc_first_path")
  if (!firstPath) {
    firstPath = path
    writeCookie("cc_first_path", firstPath)
  }

  const params = new URLSearchParams(location.search)
  const utm: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key) ?? readCookie(`cc_${key}`)
    if (value) {
      utm[key] = value.slice(0, 180)
      writeCookie(`cc_${key}`, utm[key])
    }
  }

  return { sessionId, firstPath, utm, path }
}

export function track(eventName: string, params?: Record<string, EventValue>) {
  if (typeof window === "undefined") return
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  w.gtag?.("event", eventName, params)

  const acquisition = getAcquisitionContext()
  const payload = JSON.stringify({
    eventName,
    params,
    ...acquisition,
  })

  void fetch("/api/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined)
}
