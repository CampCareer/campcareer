export type ExpansionWave = "baseline" | "pilot" | "wave-2" | "wave-3" | "wave-4"

export type ExpansionCountry = {
  code: string
  slug: string
  nameEn: string
  nameKo: string
  wave: ExpansionWave
  role: "return-benchmark" | "destination"
}

export const EXPANSION_COUNTRIES: ExpansionCountry[] = [
  { code: "KR", slug: "kr", nameEn: "South Korea", nameKo: "대한민국", wave: "baseline", role: "return-benchmark" },
  { code: "JP", slug: "jp", nameEn: "Japan", nameKo: "일본", wave: "pilot", role: "destination" },
  { code: "SG", slug: "sg", nameEn: "Singapore", nameKo: "싱가포르", wave: "pilot", role: "destination" },
  { code: "FR", slug: "fr", nameEn: "France", nameKo: "프랑스", wave: "pilot", role: "destination" },
  { code: "SE", slug: "se", nameEn: "Sweden", nameKo: "스웨덴", wave: "wave-2", role: "destination" },
  { code: "DK", slug: "dk", nameEn: "Denmark", nameKo: "덴마크", wave: "wave-2", role: "destination" },
  { code: "ES", slug: "es", nameEn: "Spain", nameKo: "스페인", wave: "wave-2", role: "destination" },
  { code: "PT", slug: "pt", nameEn: "Portugal", nameKo: "포르투갈", wave: "wave-2", role: "destination" },
  { code: "AT", slug: "at", nameEn: "Austria", nameKo: "오스트리아", wave: "wave-2", role: "destination" },
  { code: "IT", slug: "it", nameEn: "Italy", nameKo: "이탈리아", wave: "wave-2", role: "destination" },
  { code: "HK", slug: "hk", nameEn: "Hong Kong", nameKo: "홍콩", wave: "wave-3", role: "destination" },
  { code: "LU", slug: "lu", nameEn: "Luxembourg", nameKo: "룩셈부르크", wave: "wave-3", role: "destination" },
  { code: "CZ", slug: "cz", nameEn: "Czechia", nameKo: "체코", wave: "wave-3", role: "destination" },
  { code: "PL", slug: "pl", nameEn: "Poland", nameKo: "폴란드", wave: "wave-3", role: "destination" },
  { code: "HU", slug: "hu", nameEn: "Hungary", nameKo: "헝가리", wave: "wave-3", role: "destination" },
  { code: "LV", slug: "lv", nameEn: "Latvia", nameKo: "라트비아", wave: "wave-3", role: "destination" },
  { code: "CH", slug: "ch", nameEn: "Switzerland", nameKo: "스위스", wave: "wave-3", role: "destination" },
  { code: "AE", slug: "ae", nameEn: "United Arab Emirates", nameKo: "아랍에미리트", wave: "wave-3", role: "destination" },
  { code: "BR", slug: "br", nameEn: "Brazil", nameKo: "브라질", wave: "wave-4", role: "destination" },
  { code: "AR", slug: "ar", nameEn: "Argentina", nameKo: "아르헨티나", wave: "wave-4", role: "destination" },
  { code: "CL", slug: "cl", nameEn: "Chile", nameKo: "칠레", wave: "wave-4", role: "destination" },
  { code: "NZ", slug: "nz", nameEn: "New Zealand", nameKo: "뉴질랜드", wave: "pilot", role: "destination" },
  { code: "NO", slug: "no", nameEn: "Norway", nameKo: "노르웨이", wave: "wave-2", role: "destination" },
  { code: "FI", slug: "fi", nameEn: "Finland", nameKo: "핀란드", wave: "wave-2", role: "destination" },
]

export const PILOT_COUNTRY_SLUGS = ["jp", "sg", "fr"] as const

export function getExpansionCountry(slug: string): ExpansionCountry | null {
  return EXPANSION_COUNTRIES.find((country) => country.slug === slug) ?? null
}
