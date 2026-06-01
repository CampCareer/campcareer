// 타임라인 단계 스케줄/날짜 역산 공용 모듈.
// timeline 페이지와 dashboard "Your next steps" 카드가 함께 사용한다.
// (timeline 페이지의 INITIAL_PHASES는 UI(tasks/colors)까지 포함하며,
//  여기 PHASE_SCHEDULE의 단계 id/title/개월수와 동일한 값을 유지한다.)

export const PHASE_SCHEDULE = [
  { id: "p1", title: "Research & Decision",      startMonthsBefore: 18, endMonthsBefore: 12 },
  { id: "p2", title: "Test Prep & Shortlisting", startMonthsBefore: 12, endMonthsBefore: 9 },
  { id: "p3", title: "Application Prep",          startMonthsBefore: 9,  endMonthsBefore: 6 },
  { id: "p4", title: "Submit Applications",       startMonthsBefore: 6,  endMonthsBefore: 3 },
  { id: "p5", title: "Pre-Departure",            startMonthsBefore: 3,  endMonthsBefore: 1 },
  { id: "p6", title: "Settle In",                startMonthsBefore: 1,  endMonthsBefore: 0 },
] as const

// 'YYYY-MM-DD'를 로컬 Date로 (타임존 UTC 파싱 회피)
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

// 기준 날짜에서 N개월 전 날짜
export function subMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() - months)
  return d
}

// 오늘(시분초 0) 기준 targetDate까지 남은 일수 (부호 있음, 미래면 양수)
export function calcDdayNumber(targetDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const t = parseLocalDate(targetDate)
  t.setHours(0, 0, 0, 0)
  return Math.ceil((t.getTime() - today.getTime()) / 86400000)
}

// 현재 단계 = deadline(endMonthsBefore 시점)이 오늘 이후인 "가장 이른" 단계.
// 모든 단계가 지났으면 null.
export function currentPhaseId(targetDate: string): string | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = parseLocalDate(targetDate)
  for (const p of PHASE_SCHEDULE) {
    const dl = subMonths(target, p.endMonthsBefore)
    dl.setHours(0, 0, 0, 0)
    if (dl.getTime() >= today.getTime()) return p.id
  }
  return null
}

// 현재 단계 제목 (없으면 null)
export function currentPhaseTitle(targetDate: string): string | null {
  const id = currentPhaseId(targetDate)
  return id ? PHASE_SCHEDULE.find((p) => p.id === id)?.title ?? null : null
}
