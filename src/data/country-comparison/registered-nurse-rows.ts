import {
  COUNTRY_COMPARISON_MISSING_VALUE,
  type DurationValue,
  type MoneyValue,
  type TextValue,
} from "./contracts"
import type { CountryCityCost } from "./city-cost"
import {
  REGISTERED_NURSE_COMPARE_GOAL,
  REGISTERED_NURSE_COMPARE_GOAL_LABEL,
  REGISTERED_NURSE_COMPARE_PROFILE,
  REGISTERED_NURSE_COMPARE_PROFILE_LABEL,
  type CountryPathwayComparison,
} from "./registered-nurse"
import type { CountryCompareCity } from "./locations"

export type CountryComparisonRowContext = {
  country: CountryPathwayComparison
  city: CountryCompareCity | null
  cityCost: CountryCityCost | null
}

export type CountryComparisonRowDefinition = {
  section: string
  label: string
  fieldKey: string
  valueFormatter: (context: CountryComparisonRowContext) => string | null
  missingValue: string
}

function formatText(value: TextValue | null): string | null {
  return value?.value ?? null
}

function formatTextList(values: readonly TextValue[] | null): string | null {
  const labels = values?.map((value) => value.value).filter((value): value is string => Boolean(value)) ?? []
  return labels.length ? labels.join(", ") : null
}

function formatMoney(value: MoneyValue | null): string | null {
  if (!value) return null
  const currency = value.currency ? `${value.currency} ` : ""
  if (value.amount !== null) return `${currency}${value.amount}`
  if (value.min !== null || value.max !== null) {
    return `${currency}${value.min ?? "…"}–${value.max ?? "…"}`
  }
  return null
}

function formatDuration(value: DurationValue | null): string | null {
  if (!value) return null
  const unit = value.unit ? ` ${value.unit}` : ""
  if (value.value !== null) return `${value.value}${unit}`
  if (value.min !== null || value.max !== null) return `${value.min ?? "…"}–${value.max ?? "…"}${unit}`
  return null
}

function formatSourceLabels(context: CountryComparisonRowContext): string | null {
  const labels = context.country.sources.map((source) => source.label).filter(Boolean)
  return labels.length ? labels.join(", ") : null
}

function formatReviewedStatus(context: CountryComparisonRowContext): string | null {
  const statuses = context.country.sources.map((source) => source.verificationStatus)
  if (!statuses.length) return null
  if (statuses.every((status) => status === "verified")) return "Verified"
  if (statuses.some((status) => status === "needs-review")) return "Needs review"
  return "Not available"
}

const cityCostMoney = (field: keyof Pick<CountryCityCost, "rent" | "food" | "transport" | "utilities" | "otherEssentials" | "monthlyTotal" | "annualTotal">) =>
  (context: CountryComparisonRowContext) => formatMoney(context.cityCost?.[field] ?? null)

export const REGISTERED_NURSE_MATRIX_ROWS: readonly CountryComparisonRowDefinition[] = [
  { section: "Pathway", label: "Goal", fieldKey: "goal", valueFormatter: ({ country }) => country.goal === REGISTERED_NURSE_COMPARE_GOAL ? REGISTERED_NURSE_COMPARE_GOAL_LABEL : null, missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Pathway", label: "Starting profile", fieldKey: "profile", valueFormatter: ({ country }) => country.profile === REGISTERED_NURSE_COMPARE_PROFILE ? REGISTERED_NURSE_COMPARE_PROFILE_LABEL : null, missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Pathway", label: "Typical qualification route", fieldKey: "pathway.qualificationRoute", valueFormatter: ({ country }) => formatText(country.pathway.qualificationRoute), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Pathway", label: "Qualification outcome", fieldKey: "pathway.qualificationOutcome", valueFormatter: ({ country }) => formatText(country.pathway.qualificationOutcome), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Pathway", label: "Study duration", fieldKey: "pathway.studyDuration", valueFormatter: ({ country }) => formatDuration(country.pathway.studyDuration), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Pathway", label: "Registration authority", fieldKey: "pathway.registrationAuthority", valueFormatter: ({ country }) => formatText(country.pathway.registrationAuthority), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Pathway", label: "Registration steps", fieldKey: "pathway.registrationSteps", valueFormatter: ({ country }) => formatTextList(country.pathway.registrationSteps), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Study cost", label: "Currency", fieldKey: "currency", valueFormatter: ({ country }) => `${country.currencyCode} (${country.currencySymbol})`, missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Study cost", label: "Annual international tuition", fieldKey: "studyCost.annualTuition", valueFormatter: ({ country }) => formatMoney(country.studyCost.annualTuition), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Study cost", label: "Tuition range", fieldKey: "studyCost.tuitionRange", valueFormatter: ({ country }) => formatMoney(country.studyCost.tuitionRange), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Study cost", label: "Estimated total tuition", fieldKey: "studyCost.estimatedTotalTuition", valueFormatter: ({ country }) => formatMoney(country.studyCost.estimatedTotalTuition), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Study cost", label: "Mandatory study costs", fieldKey: "studyCost.mandatoryStudyCosts", valueFormatter: ({ country }) => formatMoney(country.studyCost.mandatoryStudyCosts), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Study cost", label: "Health insurance", fieldKey: "studyCost.healthInsurance", valueFormatter: ({ country }) => formatMoney(country.studyCost.healthInsurance), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Selected city", fieldKey: "city.cityName", valueFormatter: ({ city }) => city?.cityName ?? null, missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Rent", fieldKey: "cityCost.rent", valueFormatter: cityCostMoney("rent"), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Food and groceries", fieldKey: "cityCost.food", valueFormatter: cityCostMoney("food"), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Transport", fieldKey: "cityCost.transport", valueFormatter: cityCostMoney("transport"), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Utilities", fieldKey: "cityCost.utilities", valueFormatter: cityCostMoney("utilities"), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Other essentials", fieldKey: "cityCost.otherEssentials", valueFormatter: cityCostMoney("otherEssentials"), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Monthly living cost", fieldKey: "cityCost.monthlyTotal", valueFormatter: cityCostMoney("monthlyTotal"), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Annual living cost", fieldKey: "cityCost.annualTotal", valueFormatter: cityCostMoney("annualTotal"), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Accommodation basis", fieldKey: "cityCost.accommodationProfile", valueFormatter: ({ cityCost }) => formatText(cityCost?.accommodationProfile ?? null), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Household profile", fieldKey: "cityCost.householdProfile", valueFormatter: ({ cityCost }) => formatText(cityCost?.householdProfile ?? null), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Living in selected city", label: "Data year", fieldKey: "cityCost.dataYear", valueFormatter: ({ cityCost }) => formatText(cityCost?.dataYear ?? null), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Visa and post-study", label: "Student visa", fieldKey: "visa.studentVisa", valueFormatter: ({ country }) => formatText(country.visa.studentVisa), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Visa and post-study", label: "Visa application fee", fieldKey: "visa.visaApplicationFee", valueFormatter: ({ country }) => formatMoney(country.visa.visaApplicationFee), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Visa and post-study", label: "Financial evidence", fieldKey: "visa.financialEvidence", valueFormatter: ({ country }) => country.visa.financialEvidence && "value" in country.visa.financialEvidence ? formatText(country.visa.financialEvidence) : formatMoney(country.visa.financialEvidence), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Visa and post-study", label: "Work rights during study", fieldKey: "visa.workRightsDuringStudy", valueFormatter: ({ country }) => formatText(country.visa.workRightsDuringStudy), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Visa and post-study", label: "Post-study route", fieldKey: "visa.postStudyRoute", valueFormatter: ({ country }) => formatText(country.visa.postStudyRoute), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Visa and post-study", label: "Post-study duration", fieldKey: "visa.postStudyDuration", valueFormatter: ({ country }) => formatDuration(country.visa.postStudyDuration), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Visa and post-study", label: "Eligibility conditions", fieldKey: "visa.eligibilityConditions", valueFormatter: ({ country }) => formatTextList(country.visa.eligibilityConditions), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Professional income", label: "Starting professional income", fieldKey: "professionalIncome.startingIncome", valueFormatter: ({ country }) => formatMoney(country.professionalIncome.startingIncome), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Professional income", label: "Income basis", fieldKey: "professionalIncome.incomeBasis", valueFormatter: ({ country }) => formatText(country.professionalIncome.incomeBasis), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Professional income", label: "Gross or net", fieldKey: "professionalIncome.grossOrNet", valueFormatter: ({ country }) => formatText(country.professionalIncome.grossOrNet), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Professional income", label: "Geographic scope", fieldKey: "professionalIncome.geographicScope", valueFormatter: ({ country }) => formatText(country.professionalIncome.geographicScope), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Professional income", label: "Data year", fieldKey: "professionalIncome.effectiveYear", valueFormatter: ({ country }) => formatText(country.professionalIncome.effectiveYear), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Time and investment", label: "Time to professional income", fieldKey: "timeAndInvestment.timeToProfessionalIncome", valueFormatter: ({ country }) => formatDuration(country.timeAndInvestment.timeToProfessionalIncome), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Time and investment", label: "Total study investment", fieldKey: "timeAndInvestment.totalStudyInvestment", valueFormatter: ({ country }) => formatMoney(country.timeAndInvestment.totalStudyInvestment), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Time and investment", label: "Investment recovery period", fieldKey: "timeAndInvestment.recoveryPeriod", valueFormatter: ({ country }) => formatDuration(country.timeAndInvestment.recoveryPeriod), missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Source", label: "Official sources", fieldKey: "sources", valueFormatter: formatSourceLabels, missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
  { section: "Source", label: "Reviewed", fieldKey: "sources.verificationStatus", valueFormatter: formatReviewedStatus, missingValue: COUNTRY_COMPARISON_MISSING_VALUE },
]

export function formatCountryComparisonRow(
  row: CountryComparisonRowDefinition,
  context: CountryComparisonRowContext,
): string {
  return row.valueFormatter(context) ?? row.missingValue
}
