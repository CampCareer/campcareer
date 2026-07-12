import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"
import ko from "i18n-iso-countries/langs/ko.json"

countries.registerLocale(en)
countries.registerLocale(ko)

export type CountryOption = {
  code: string
  label: string
}

// ISO 3166-1 has 249 officially assigned alpha-2 codes. The dependency also
// exposes XK for practical locale support, which is intentionally excluded from
// the global selector so the product contract remains ISO-only.
const ISO_CODES = new Set(
  Object.keys(countries.getNames("en", { select: "official" })).filter((code) => code !== "XK"),
)

export function isIsoCountryCode(value: string) {
  return ISO_CODES.has(value.toUpperCase())
}

export function getCountryOptions(locale: "en" | "ko-KR" = "en"): CountryOption[] {
  const language = locale === "ko-KR" ? "ko" : "en"
  const names = countries.getNames(language, { select: "official" })
  return Object.entries(names)
    .filter(([code]) => ISO_CODES.has(code))
    .map(([code, label]) => ({ code, label }))
    .sort((a, b) => a.label.localeCompare(b.label, language))
}
