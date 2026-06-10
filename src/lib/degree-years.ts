// 국가별 표준 학부 수학연한. UK/AU는 3년 학위가 표준 — tuition * 4 하드코딩은
// 총학비/페이백을 과대평가한다. IE는 3~4년 혼재라 코스 duration 데이터가 있으면 우선.
export const DEGREE_YEARS: Record<string, number> = {
  us: 4,
  ca: 4,
  au: 3,
  uk: 3,
  ie: 4,
}

export function degreeYears(country: string, courseDurationYears?: number | null): number {
  if (
    typeof courseDurationYears === 'number' &&
    Number.isFinite(courseDurationYears) &&
    courseDurationYears > 0
  ) {
    return courseDurationYears
  }
  return DEGREE_YEARS[country] ?? 4
}
