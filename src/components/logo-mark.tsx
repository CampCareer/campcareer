'use client'

export function LogoMark({ size = 36 }: { size?: number }) {
  const rx = Math.round(size * 0.19)
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.26
  const sw = size * 0.145
  const openX = r * Math.cos(Math.PI / 5.5)
  const openY = r * Math.sin(Math.PI / 5.5)
  const ox = size * 0.06
  const oy = size * 0.06

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CampCareer logo"
      role="img"
    >
      <rect width={size} height={size} rx={rx} fill="#1d4ed8" />
      {/* shadow C — 오른쪽 아래 오프셋 */}
      <path
        d={`M ${cx + ox + openX},${cy + oy - openY} A ${r},${r} 0 1,0 ${cx + ox + openX},${cy + oy + openY}`}
        fill="none"
        stroke="#1e3a8a"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      {/* main C — 정중앙 */}
      <path
        d={`M ${cx + openX},${cy - openY} A ${r},${r} 0 1,0 ${cx + openX},${cy + openY}`}
        fill="none"
        stroke="white"
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  )
}
