import { ImageResponse } from "next/og"
import {
  type CountryCode,
  ALL_COUNTRIES,
  isMajorSlug,
  majorLabel,
} from "@/lib/degree-risk"

export const runtime = "edge"

const SIZE = { width: 1200, height: 630 }

// English names only — the OG card is rendered without locale cookies.
const COUNTRY_NAME: Record<CountryCode, string> = {
  US: "United States",
  CA: "Canada",
  UK: "United Kingdom",
  AU: "Australia",
  IE: "Ireland",
}

function normCountry(raw: string | null, fallback: CountryCode): CountryCode {
  const up = (raw ?? "").toUpperCase()
  return (ALL_COUNTRIES as string[]).includes(up) ? (up as CountryCode) : fallback
}

export function GET(req: Request) {
  const sp = new URL(req.url).searchParams
  const fieldRaw = sp.get("field") ?? ""
  const slug = isMajorSlug(fieldRaw) ? fieldRaw : "computer-science"
  const major = majorLabel(slug)
  const a = normCountry(sp.get("a"), "IE")
  let b = normCountry(sp.get("b"), "CA")
  if (b === a) b = (ALL_COUNTRIES.find((c) => c !== a) as CountryCode)

  const pill = {
    display: "flex",
    padding: "12px 28px",
    background: "#EFF6FF",
    color: "#1D4ED8",
    borderRadius: 9999,
    fontSize: 36,
    fontWeight: 700,
  } as const

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "36px 56px",
            background: "#2563EB",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>CampCareer</div>
          <div style={{ display: "flex", fontSize: 24, opacity: 0.85 }}>Degree Risk</div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", padding: "0 56px" }}>
          <div style={{ display: "flex", fontSize: 32, color: "#64748b", marginBottom: 16 }}>Degree risk, compared</div>
          <div style={{ display: "flex", fontSize: 80, fontWeight: 800, color: "#0f172a", lineHeight: 1.05, marginBottom: 36 }}>
            {major}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={pill}>{COUNTRY_NAME[a]}</div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#94a3b8" }}>vs</div>
            <div style={pill}>{COUNTRY_NAME[b]}</div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 56px",
            borderTop: "1px solid #e2e8f0",
            color: "#64748b",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex" }}>Employment · Visa · Demand · AI exposure · ROI</div>
          <div style={{ display: "flex", fontWeight: 700, color: "#2563EB" }}>campcareer.com</div>
        </div>
      </div>
    ),
    SIZE
  )
}
