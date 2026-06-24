export function track(eventName: string, params?: Record<string, string | number | boolean | undefined>) {
  if (typeof window === "undefined") return
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  w.gtag?.("event", eventName, params)
}
