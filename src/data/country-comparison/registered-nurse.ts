import {
  COUNTRY_COMPARISON_VALUE_TYPES,
  type DurationValue,
  type MoneyValue,
  type SourceReference,
  type TextValue,
} from "./contracts"
import {
  COUNTRY_COMPARE_CATALOG,
  type CountryCompareCode,
  type CountryCompareCurrencyCode,
} from "./locations"

export const REGISTERED_NURSE_COMPARE_GOAL = "registered-nurse" as const
export const REGISTERED_NURSE_COMPARE_PROFILE = "starting-from-scratch" as const
export const REGISTERED_NURSE_COMPARE_GOAL_LABEL = "Registered Nurse" as const
export const REGISTERED_NURSE_COMPARE_PROFILE_LABEL = "Starting without a nursing qualification" as const
export const REGISTERED_NURSE_COMPARE_AUDIENCE_LABEL = "International student" as const

export type CountryCompareGoal = typeof REGISTERED_NURSE_COMPARE_GOAL
export type CountryCompareProfile = typeof REGISTERED_NURSE_COMPARE_PROFILE

export type CountryPathway = {
  qualificationRoute: TextValue | null
  qualificationOutcome: TextValue | null
  studyDuration: DurationValue | null
  registrationAuthority: TextValue | null
  registrationSteps: readonly TextValue[] | null
}

export type CountryStudyCost = {
  annualTuition: MoneyValue | null
  tuitionRange: MoneyValue | null
  estimatedTotalTuition: MoneyValue | null
  mandatoryStudyCosts: MoneyValue | null
  healthInsurance: MoneyValue | null
}

export type CountryVisa = {
  studentVisa: TextValue | null
  visaApplicationFee: MoneyValue | null
  financialEvidence: MoneyValue | TextValue | null
  workRightsDuringStudy: TextValue | null
  postStudyRoute: TextValue | null
  postStudyDuration: DurationValue | null
  eligibilityConditions: readonly TextValue[] | null
}

export type CountryProfessionalIncome = {
  startingIncome: MoneyValue | null
  incomeBasis: TextValue | null
  grossOrNet: TextValue | null
  geographicScope: TextValue | null
  effectiveYear: TextValue | null
}

export type CountryTimeAndInvestment = {
  timeToProfessionalIncome: DurationValue | null
  totalStudyInvestment: MoneyValue | null
  recoveryPeriod: DurationValue | null
}

export type CountryPathwayComparison = {
  countryCode: CountryCompareCode
  countryName: string
  displayCode: CountryCompareCode
  externalIsoCode: "AU" | "IE" | "GB"
  currencyCode: CountryCompareCurrencyCode
  currencySymbol: string
  goal: CountryCompareGoal
  profile: CountryCompareProfile
  audience: "international-student"
  qualificationProfile: "no-nursing-qualification-or-registration"
  pathway: CountryPathway
  studyCost: CountryStudyCost
  visa: CountryVisa
  professionalIncome: CountryProfessionalIncome
  timeAndInvestment: CountryTimeAndInvestment
  sources: readonly SourceReference[]
}

/**
 * Identity and context records for the RN comparison. All factual values are
 * intentionally null until a reviewed country adapter is connected.
 */
export const REGISTERED_NURSE_COUNTRY_SHELL: readonly CountryPathwayComparison[] =
  COUNTRY_COMPARE_CATALOG.map((country) => ({
    countryCode: country.productCode,
    countryName: country.countryName,
    displayCode: country.productCode,
    externalIsoCode: country.externalIsoCode,
    currencyCode: country.currencyCode,
    currencySymbol: country.currencySymbol,
    goal: REGISTERED_NURSE_COMPARE_GOAL,
    profile: REGISTERED_NURSE_COMPARE_PROFILE,
    audience: "international-student",
    qualificationProfile: "no-nursing-qualification-or-registration",
    pathway: {
      qualificationRoute: null,
      qualificationOutcome: null,
      studyDuration: null,
      registrationAuthority: null,
      registrationSteps: null,
    },
    studyCost: {
      annualTuition: null,
      tuitionRange: null,
      estimatedTotalTuition: null,
      mandatoryStudyCosts: null,
      healthInsurance: null,
    },
    visa: {
      studentVisa: null,
      visaApplicationFee: null,
      financialEvidence: null,
      workRightsDuringStudy: null,
      postStudyRoute: null,
      postStudyDuration: null,
      eligibilityConditions: null,
    },
    professionalIncome: {
      startingIncome: null,
      incomeBasis: null,
      grossOrNet: null,
      geographicScope: null,
      effectiveYear: null,
    },
    timeAndInvestment: {
      timeToProfessionalIncome: null,
      totalStudyInvestment: null,
      recoveryPeriod: null,
    },
    sources: [],
  }))

export function getRegisteredNurseCountryShell(countryCode: CountryCompareCode) {
  return REGISTERED_NURSE_COUNTRY_SHELL.find((country) => country.countryCode === countryCode) ?? null
}

export { COUNTRY_COMPARISON_VALUE_TYPES }
export type {
  DurationValue,
  MoneyValue,
  SourceReference,
  TextValue,
} from "./contracts"
export type { DurationValue as CountryCompareDuration, MoneyValue as CountryCompareMoney }
