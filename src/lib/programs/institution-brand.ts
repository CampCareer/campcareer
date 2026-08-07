const OFFICIAL_ICON_PATHS = [
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
  "/favicon.svg",
  "/favicon-32x32.png",
  "/favicon.ico",
] as const

export function institutionInitials(name: string) {
  const words = name
    .replace(/^the\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)

  return words
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase())
    .join("")
}

export function institutionIconCandidates(websiteUrl: string | null) {
  if (!websiteUrl) return []

  try {
    const website = new URL(websiteUrl)
    if (website.protocol !== "https:") return []

    return OFFICIAL_ICON_PATHS.map((path) => new URL(path, website.origin).toString())
  } catch {
    return []
  }
}
