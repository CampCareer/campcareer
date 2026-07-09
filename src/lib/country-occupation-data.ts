import "server-only"

import beGraduateSalaryRaw from "@/data/be-graduate-salary.json"
import beHighIncomeOccupationsRaw from "@/data/be-high-income-occupations.json"
import beOccupationsSalaryRaw from "@/data/be-occupations-salary.json"
import beShortageOccupationsRaw from "@/data/be-shortage-occupations.json"
import ieGraduateOutcomesRaw from "@/data/ie-graduate-outcomes.json"
import { getShortageOccupations } from "@/lib/ie-shortage-occupations"

export type CanonicalCountryOccupation = {
  code: string
  name: string
  localName: string | null
  medianSalary: number | null
  currency: "EUR"
  salaryPeriod: "monthly" | "annual" | null
  shortageRating: number | null
  employment: number | null
  field: string | null
  codeLabel: string
  sourceName: string
  sourceUrl: string
  lastChecked: string
}

type BelgiumSalaryEntry = {
  salary_eur_monthly: number | null
  occupation_en: string
}

function slugifyOccupation(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getBelgiumOccupations(): CanonicalCountryOccupation[] {
  const graduateSalary = beGraduateSalaryRaw as unknown as {
    source: string
    last_updated: string
    graduate_salary_by_field: Array<{
      field: string
      field_nl: string
      field_fr: string
      starting_salary_eur: number
      experience_5yr_eur: number
    }>
  }
  const highIncomeData = beHighIncomeOccupationsRaw as unknown as {
    source: string
    last_updated: string
    top_10_high_income_occupations: Array<{
      rank: number
      occupation: string
      occupation_nl: string
      occupation_fr: string
      average_gross_monthly_eur: number
    }>
  }
  const shortageData = beShortageOccupationsRaw as unknown as {
    source: string
    last_updated: string
    flanders: { top_10_shortage: Array<{ rank: number; occupation: string; occupation_nl: string }> }
    brussels: { top_shortage: Array<{ occupation: string; occupation_fr: string }> }
    wallonia: { top_shortage: Array<{ occupation: string; occupation_fr: string }> }
  }
  const salaryData = beOccupationsSalaryRaw as unknown as {
    source: string
    last_updated: string
    occupations: Record<string, BelgiumSalaryEntry>
  }

  const occupations = new Map<string, CanonicalCountryOccupation>()

  for (const field of graduateSalary.graduate_salary_by_field) {
    const code = slugifyOccupation(field.field)
    occupations.set(code, {
      code,
      name: field.field,
      localName: `${field.field_nl} / ${field.field_fr}`,
      medianSalary: field.starting_salary_eur,
      currency: "EUR",
      salaryPeriod: "monthly",
      shortageRating: null,
      employment: null,
      field: field.field,
      codeLabel: "Field",
      sourceName: graduateSalary.source,
      sourceUrl: "https://statbel.fgov.be/en/themes/work-training/wages-and-labourcost/overview-belgian-wages-and-salaries",
      lastChecked: graduateSalary.last_updated,
    })
  }

  for (const occ of highIncomeData.top_10_high_income_occupations) {
    const code = slugifyOccupation(occ.occupation)
    if (!occupations.has(code)) {
      occupations.set(code, {
        code,
        name: occ.occupation,
        localName: `${occ.occupation_nl} / ${occ.occupation_fr}`,
        medianSalary: occ.average_gross_monthly_eur,
        currency: "EUR",
        salaryPeriod: "monthly",
        shortageRating: null,
        employment: null,
        field: "High-income occupation",
        codeLabel: "BE",
        sourceName: highIncomeData.source,
        sourceUrl: "https://statbel.fgov.be/en/themes/work-training/wages-and-labourcost/overview-belgian-wages-and-salaries",
        lastChecked: highIncomeData.last_updated,
      })
    }
  }

  const addShortage = (
    occ: { occupation: string; occupation_nl?: string; occupation_fr?: string },
    shortageRating: number,
  ) => {
    const code = slugifyOccupation(occ.occupation)
    const existing = occupations.get(code)
    if (existing) {
      occupations.set(code, {
        ...existing,
        shortageRating: existing.shortageRating ?? shortageRating,
        localName: existing.localName ?? occ.occupation_nl ?? occ.occupation_fr ?? null,
      })
      return
    }

    const salary = salaryData.occupations[code]
    occupations.set(code, {
      code,
      name: salary?.occupation_en ?? occ.occupation,
      localName: occ.occupation_nl ?? occ.occupation_fr ?? null,
      medianSalary: salary?.salary_eur_monthly ?? null,
      currency: "EUR",
      salaryPeriod: salary?.salary_eur_monthly != null ? "monthly" : null,
      shortageRating,
      employment: null,
      field: "Shortage occupation",
      codeLabel: "BE",
      sourceName: shortageData.source,
      sourceUrl: "https://www.vdab.be/trends-en-cijfers/knelpuntberoepenlijst",
      lastChecked: shortageData.last_updated,
    })
  }

  for (const occ of shortageData.flanders.top_10_shortage) {
    addShortage(occ, 6 - Math.min(occ.rank, 5))
  }
  for (const occ of shortageData.brussels.top_shortage) addShortage(occ, 5)
  for (const occ of shortageData.wallonia.top_shortage) addShortage(occ, 5)

  for (const [code, entry] of Object.entries(salaryData.occupations)) {
    if (occupations.has(code)) {
      const existing = occupations.get(code)!
      occupations.set(code, {
        ...existing,
        medianSalary: existing.medianSalary ?? entry.salary_eur_monthly,
        salaryPeriod: existing.salaryPeriod ?? (entry.salary_eur_monthly != null ? "monthly" : null),
      })
      continue
    }

    occupations.set(code, {
      code,
      name: entry.occupation_en,
      localName: null,
      medianSalary: entry.salary_eur_monthly,
      currency: "EUR",
      salaryPeriod: entry.salary_eur_monthly != null ? "monthly" : null,
      shortageRating: null,
      employment: null,
      field: null,
      codeLabel: "BE",
      sourceName: salaryData.source,
      sourceUrl: "https://www.jobat.be/en/salary-calculator",
      lastChecked: salaryData.last_updated,
    })
  }

  return Array.from(occupations.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export function getIrelandOccupations(): CanonicalCountryOccupation[] {
  const graduateOutcomes = ieGraduateOutcomesRaw as unknown as {
    source: string
    source_url: string
    last_updated: string
    field_summaries: Array<{
      isced_code: string
      field_name: string
      employment_rate_pct: number
    }>
  }
  const fieldByCode = new Map(graduateOutcomes.field_summaries.map((field) => [field.isced_code, field]))

  return getShortageOccupations()
    .map((occ) => {
      const field = occ.relatedBroadField ? fieldByCode.get(occ.relatedBroadField) : null
      const fieldLabel = field
        ? `${field.field_name} (${field.employment_rate_pct}% graduate employment)`
        : null

      return {
        code: occ.socCode,
        name: occ.category,
        localName: occ.employments.join(", "),
        medianSalary: null,
        currency: "EUR" as const,
        salaryPeriod: null,
        shortageRating: 5,
        employment: field?.employment_rate_pct ?? null,
        field: fieldLabel,
        codeLabel: occ.socLevel,
        sourceName: "DETE Critical Skills Occupations List / CSO Higher Education Outcomes",
        sourceUrl: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/",
        lastChecked: graduateOutcomes.last_updated,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}
