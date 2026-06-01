'use client'

export function LogoMark({ size = 32 }: { size?: number }) {
  const rx = Math.round(size * 0.18)
  const fs = Math.round(size * 0.76)
  const center = size / 2

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
      {/* shadow C — offset 오른쪽 아래 */}
      <text
        x={center + size * 0.07}
        y={center + size * 0.07}
        fontFamily="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif"
        fontSize={fs}
        fontWeight={800}
        fill="#1e3a8a"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        C
      </text>
      {/* main C — 정중앙 */}
      <text
        x={center}
        y={center}
        fontFamily="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif"
        fontSize={fs}
        fontWeight={800}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        C
      </text>
    </svg>
  )
}
