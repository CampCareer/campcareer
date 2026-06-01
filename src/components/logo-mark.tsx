'use client'

export function LogoMark({ size = 36 }: { size?: number }) {
  const rx = Math.round(size * 0.19)
  const fs = size * 0.86
  const cx = size / 2
  // 대문자 C의 시각적 중심을 배지 중앙에 맞추는 baseline y
  const baseY = size * 0.5 + fs * 0.35
  // 그림자 C 오프셋
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
      {/* shadow C */}
      <text
        x={cx + ox}
        y={baseY + oy}
        fontFamily="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif"
        fontSize={fs}
        fontWeight={800}
        fill="#1e3a8a"
        textAnchor="middle"
      >
        C
      </text>
      {/* main C */}
      <text
        x={cx}
        y={baseY}
        fontFamily="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif"
        fontSize={fs}
        fontWeight={800}
        fill="white"
        textAnchor="middle"
      >
        C
      </text>
    </svg>
  )
}
