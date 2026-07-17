import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "CampCareer — Compare study paths from qualification to career"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#0f172a",
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 55%, #dbeafe 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 30, fontWeight: 700 }}>
          <div style={{ display: "flex", width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: 16, color: "white", background: "#2563eb" }}>CC</div>
          CampCareer
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: "-3px", fontWeight: 700 }}>
            Compare study paths—from qualification to career.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.4, color: "#475569" }}>
            Cost, career outcomes, qualifications and post-study options from verified sources.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
