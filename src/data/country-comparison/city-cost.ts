import type { MoneyValue, TextValue } from "./contracts"

/**
 * City cost shape is intentionally separate from country RN pathway data.
 * This first contract carries no populated cost records.
 */
export type CountryCityCost = {
  rent: MoneyValue | null
  food: MoneyValue | null
  transport: MoneyValue | null
  utilities: MoneyValue | null
  otherEssentials: MoneyValue | null
  monthlyTotal: MoneyValue | null
  annualTotal: MoneyValue | null
  accommodationProfile: TextValue | null
  householdProfile: TextValue | null
  dataYear: TextValue | null
  sourceIds: readonly string[]
}
