/** Only allow same-origin relative paths to be used as an authentication return URL. */
export function getSafeNextPath(requestedNext: string | null | undefined, fallback = "/") {
  if (!requestedNext || !requestedNext.startsWith("/") || requestedNext.startsWith("//") || requestedNext.includes("\\")) {
    return fallback
  }

  try {
    const parsed = new URL(requestedNext, "https://campcareer.local")
    return parsed.origin === "https://campcareer.local" ? `${parsed.pathname}${parsed.search}${parsed.hash}` : fallback
  } catch {
    return fallback
  }
}
