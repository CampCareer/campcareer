'use client'

export function LogoMark({ size = 32 }: { size?: number }) {
  const r = Math.round(size * 0.18)
  const fs = Math.round(size * 0.86)
  const shadowX = Math.round(size * 0.57)
  const shadowY = Math.round(size * 0.83)
  const mainX = Math.round(size * 0.50)
  const mainY = Math.round(size * 0.76)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CampCareer logo"
      role="img"
    >
      <rect width={size} height={size} rx={r} fill="#1938b0" />
      <text
        x={shadowX}
        y={shadowY}
        fontFamily="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif"
        fontSize={fs}
        fontWeight={800}
        fill="#142b93"
        textAnchor="middle"
        dominantBaseline="auto"
      >
        C
      </text>
      <text
        x={mainX}
        y={mainY}
        fontFamily="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif"
        fontSize={fs}
        fontWeight={800}
        fill="white"
        textAnchor="middle"
        dominantBaseline="auto"
      >
        C
      </text>
    </svg>
  )
}
