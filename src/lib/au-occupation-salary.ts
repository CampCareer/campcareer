import csolCandidates from "@/data/au-csol-priority-occupations.json"
import { getEmploymentSalary } from "@/data/employment-salaries"

type CsolCandidate = {
  oscaCode: string
  anzscoV13Codes: string[]
}

type CsolManifest = {
  occupations: CsolCandidate[]
}

const ANZSCO_V13_BY_OSCA = new Map(
  (csolCandidates as CsolManifest).occupations.map((occupation) => [occupation.oscaCode, occupation.anzscoV13Codes]),
)

function median(values: number[]) {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? Math.round((sorted[middle - 1] + sorted[middle]) / 2)
    : sorted[middle]
}

/**
 * Returns a labelled ANZSCO unit-group estimate only when ABS's OSCA
 * correspondence and an official JSA/ABS group salary are both available.
 */
export function estimateSalaryForOscaCodes(oscaCodes: readonly string[]) {
  const salaries = oscaCodes.flatMap((oscaCode) =>
    (ANZSCO_V13_BY_OSCA.get(oscaCode) ?? [])
      .map((anzscoCode) => getEmploymentSalary(anzscoCode.slice(0, 4))?.median_salary_aud ?? null)
      .filter((salary): salary is number => salary != null),
  )
  return median(salaries)
}
