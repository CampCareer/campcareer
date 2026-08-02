export type CountryCompareCode = "AU" | "IE" | "UK"
export type CountryCompareExternalIsoCode = "AU" | "IE" | "GB"
export type CountryCompareCurrencyCode = "AUD" | "EUR" | "GBP"

export type CountryCompareCity = {
  countryCode: CountryCompareCode
  citySlug: string
  cityName: string
  regionName: string | null
}

export type CountryCompareCountry = {
  productCode: CountryCompareCode
  externalIsoCode: CountryCompareExternalIsoCode
  countryName: string
  currencyCode: CountryCompareCurrencyCode
  currencySymbol: string
  defaultCitySlug: string | null
  cities: readonly CountryCompareCity[]
}

function city(
  countryCode: CountryCompareCode,
  citySlug: string,
  cityName: string,
  regionName: string | null,
): CountryCompareCity {
  return { countryCode, citySlug, cityName, regionName }
}

/**
 * Geographic choices only. This catalog intentionally contains no salary,
 * visa, tuition, rent, or cost-of-living values.
 */
export const COUNTRY_COMPARE_CATALOG: readonly CountryCompareCountry[] = [
  {
    productCode: "AU",
    externalIsoCode: "AU",
    countryName: "Australia",
    currencyCode: "AUD",
    currencySymbol: "A$",
    defaultCitySlug: null,
    cities: [
      city("AU", "sydney", "Sydney", "New South Wales"),
      city("AU", "melbourne", "Melbourne", "Victoria"),
      city("AU", "brisbane", "Brisbane", "Queensland"),
      city("AU", "adelaide", "Adelaide", "South Australia"),
      city("AU", "perth", "Perth", "Western Australia"),
    ],
  },
  {
    productCode: "IE",
    externalIsoCode: "IE",
    countryName: "Ireland",
    currencyCode: "EUR",
    currencySymbol: "€",
    defaultCitySlug: null,
    cities: [
      city("IE", "dublin", "Dublin", "Leinster"),
      city("IE", "cork", "Cork", "Munster"),
      city("IE", "galway", "Galway", "Connacht"),
    ],
  },
  {
    productCode: "UK",
    externalIsoCode: "GB",
    countryName: "United Kingdom",
    currencyCode: "GBP",
    currencySymbol: "£",
    defaultCitySlug: null,
    cities: [
      city("UK", "london", "London", "England"),
      city("UK", "manchester", "Manchester", "England"),
      city("UK", "birmingham", "Birmingham", "England"),
      city("UK", "glasgow", "Glasgow", "Scotland"),
      city("UK", "belfast", "Belfast", "Northern Ireland"),
    ],
  },
] as const

const countryByCode = new Map(COUNTRY_COMPARE_CATALOG.map((country) => [country.productCode, country]))

const cityByCountryAndSlug = new Map<string, CountryCompareCity>(
  COUNTRY_COMPARE_CATALOG.flatMap((country) => country.cities.map((cityEntry) => [
    `${cityEntry.countryCode}:${cityEntry.citySlug}`,
    cityEntry,
  ] as const)),
)

export function getCountryCompareCountry(code: string): CountryCompareCountry | null {
  return countryByCode.get(code.trim().toUpperCase() as CountryCompareCode) ?? null
}

export function getCountryCompareCity(countryCode: string, citySlug: string): CountryCompareCity | null {
  const normalizedCountry = countryCode.trim().toUpperCase()
  const normalizedCity = citySlug.trim().toLowerCase()
  return cityByCountryAndSlug.get(`${normalizedCountry}:${normalizedCity}`) ?? null
}

export function getCountryCompareCities(countryCode: string): readonly CountryCompareCity[] {
  return getCountryCompareCountry(countryCode)?.cities ?? []
}

export function isCountryCompareCode(value: string): value is CountryCompareCode {
  return Boolean(getCountryCompareCountry(value))
}
