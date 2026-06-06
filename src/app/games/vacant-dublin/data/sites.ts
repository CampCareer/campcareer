export type SiteType = "Council" | "Vacant" | "Derelict"

export interface Site {
  id: string
  name: string
  area: number
  landVal: number
  type: SiteType
  owner: string
  years: number
  lat: number
  lng: number
}

export const SITES: Site[] = [
  { id: "VS-0596", name: "Oscar Traynor Rd",         area: 4.2, landVal: 45_000_000,  type: "Council",  owner: "Dublin City Council",  years: 6, lat: 53.3850, lng: -6.2010 },
  { id: "VS-0011", name: "Infirmary Rd",              area: 2.1, landVal: 10_500_000,  type: "Council",  owner: "Dublin City Council",  years: 8, lat: 53.3520, lng: -6.2852 },
  { id: "VS-0117", name: "East Wall Rd",              area: 1.8, landVal: 10_500_000,  type: "Council",  owner: "Dublin City Council",  years: 8, lat: 53.3524, lng: -6.2248 },
  { id: "VS-0800", name: "Paper Mills, Clonskeagh",   area: 1.5, landVal: 10_000_000,  type: "Vacant",   owner: "Harley Issuer DAC",    years: 3, lat: 53.3140, lng: -6.2430 },
  { id: "VS-0048", name: "Phibsborough Rd",           area: 0.9, landVal:  7_200_000,  type: "Vacant",   owner: "Bindford Ltd",         years: 8, lat: 53.3674, lng: -6.2706 },
  { id: "VS-0979", name: "East Wall Rd (Port)",       area: 1.2, landVal:  7_000_000,  type: "Vacant",   owner: "Dublin Port Co.",       years: 7, lat: 53.3490, lng: -6.2210 },
  { id: "VS-0028", name: "Grand Canal Place",         area: 0.8, landVal:  6_000_000,  type: "Council",  owner: "Dublin City Council",  years: 7, lat: 53.3392, lng: -6.2770 },
  { id: "VS-0461", name: "Bannow Rd, Cabra",          area: 0.9, landVal:  6_000_000,  type: "Council",  owner: "Dublin City Council",  years: 7, lat: 53.3680, lng: -6.2880 },
  { id: "VS-0453", name: "Faussagh Ave",              area: 0.7, landVal:  5_300_000,  type: "Vacant",   owner: "R&D Dev. (IoM)",       years: 6, lat: 53.3640, lng: -6.2850 },
  { id: "VS-1077", name: "Back Lane, D8",             area: 0.6, landVal:  4_600_000,  type: "Vacant",   owner: "Redcaps Dev.",          years: 7, lat: 53.3430, lng: -6.2740 },
  { id: "VS-0693", name: "Davitt Rd",                 area: 0.7, landVal:  4_000_000,  type: "Vacant",   owner: "Heidelberg Davitt",    years: 6, lat: 53.3210, lng: -6.3050 },
  { id: "VS-0797", name: "Appian Way",                area: 0.5, landVal:  4_000_000,  type: "Vacant",   owner: "RGRE Valerys",          years: 6, lat: 53.3270, lng: -6.2500 },
  { id: "VS-0019", name: "Watling St",                area: 0.7, landVal:  4_500_000,  type: "Council",  owner: "Digital Hub Agency",   years: 8, lat: 53.3462, lng: -6.2773 },
  { id: "VS-0542", name: "Jamestown Rd, Finglas",     area: 0.6, landVal:  3_420_000,  type: "Vacant",   owner: "Jamestown Village",    years: 6, lat: 53.3890, lng: -6.3010 },
  { id: "VS-0402", name: "Shangan Rd, Ballymun",      area: 0.6, landVal:  3_300_000,  type: "Council",  owner: "Dublin City Council",  years: 7, lat: 53.4020, lng: -6.2720 },
  { id: "VS-1080", name: "Charles St Great",          area: 0.4, landVal:  3_200_000,  type: "Vacant",   owner: "Cluid Housing",        years: 7, lat: 53.3508, lng: -6.2580 },
  { id: "VS-0124", name: "Aldborough House",          area: 0.6, landVal:  3_500_000,  type: "Vacant",   owner: "Reliance (IoM)",       years: 8, lat: 53.3563, lng: -6.2498 },
  { id: "VS-0055", name: "N Circular Rd",             area: 0.2, landVal:  1_400_000,  type: "Vacant",   owner: "Lilacstone Ltd",       years: 8, lat: 53.3618, lng: -6.2660 },
  { id: "DS-002",  name: "Aungier St (Protected)",    area: 0.1, landVal:  2_000_000,  type: "Derelict", owner: "Unknown",              years: 5, lat: 53.3389, lng: -6.2636 },
]
