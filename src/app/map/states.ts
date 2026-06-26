// 호주 주·준주 코드 — 클라이언트/서버 양쪽에서 쓰는 순수 상수 모듈.
// (map-data.ts 는 server-only 라, 클라이언트가 쓰는 값 상수는 여기 둔다.)

export type StateCode = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "NT" | "ACT"

export const STATE_CODES: StateCode[] = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]

export const STATE_NAMES: Record<StateCode, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
}

export type USStateCode = typeof US_STATE_CODES[number]

export const US_STATE_CODES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA",
  "MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX",
  "UT","VT","VA","WA","WV","WI","WY",
] as const

export type CAProvinceCode = typeof CA_PROVINCE_CODES[number]

export const CA_PROVINCE_CODES = [
  "AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT",
] as const

export const CA_PROVINCE_NAMES: Record<string, string> = {
  AB: "Alberta", BC: "British Columbia", MB: "Manitoba",
  NB: "New Brunswick", NL: "Newfoundland and Labrador", NS: "Nova Scotia",
  NT: "Northwest Territories", NU: "Nunavut", ON: "Ontario",
  PE: "Prince Edward Island", QC: "Quebec", SK: "Saskatchewan", YT: "Yukon",
}

export type IECountyCode = typeof IE_COUNTY_CODES[number]

export const IE_COUNTY_CODES = [
  "CE","CN","CO","CW","D","DL","G","KE","KK","KY",
  "LD","LH","LK","LM","LS","MH","MN","MO","OY","RN",
  "SO","TA","WD","WH","WW","WX",
] as const

export const IE_COUNTY_NAMES: Record<string, string> = {
  CE: "Clare", CN: "Cavan", CO: "Cork", CW: "Carlow", D: "Dublin",
  DL: "Donegal", G: "Galway", KE: "Kildare", KK: "Kilkenny", KY: "Kerry",
  LD: "Longford", LH: "Louth", LK: "Limerick", LM: "Leitrim", LS: "Laois",
  MH: "Meath", MN: "Monaghan", MO: "Mayo", OY: "Offaly", RN: "Roscommon",
  SO: "Sligo", TA: "Tipperary", WD: "Waterford", WH: "Westmeath", WW: "Wicklow", WX: "Wexford",
}

export const IE_COUNTY_NUTS3: Record<string, string> = {
  DL: "Border", MN: "Border", LH: "Border", LM: "Border", SO: "Border", CN: "Border",
  D: "Dublin",
  KE: "Mid-East", MH: "Mid-East", WW: "Mid-East",
  LS: "Midland", LD: "Midland", OY: "Midland", WH: "Midland",
  CW: "South-East (IE)", KK: "South-East (IE)", WX: "South-East (IE)", WD: "South-East (IE)",
  CE: "Mid-West", LK: "Mid-West", TA: "Mid-West",
  CO: "South-West (IE)", KY: "South-West (IE)",
  G: "West", MO: "West", RN: "West",
}

// GeoJSON county property (without " County" suffix) → IECountyCode
export const IE_GEOJSON_COUNTY_TO_CODE: Record<string, IECountyCode> = {
  Clare: "CE", Cavan: "CN", Cork: "CO", Carlow: "CW", Dublin: "D",
  Donegal: "DL", Galway: "G", Kildare: "KE", Kilkenny: "KK", Kerry: "KY",
  Longford: "LD", Louth: "LH", Limerick: "LK", Leitrim: "LM", Laois: "LS",
  Meath: "MH", Monaghan: "MN", Mayo: "MO", Offaly: "OY", Roscommon: "RN",
  Sligo: "SO", Tipperary: "TA", Waterford: "WD", Westmeath: "WH", Wicklow: "WW", Wexford: "WX",
}

// City name → county code for filtering IE language schools
export const IE_CITY_TO_COUNTY: Record<string, string> = {
  Dublin: "D", "Dún Laoghaire": "D", Swords: "D", Malahide: "D", Howth: "D",
  Cork: "CO", "Cork City": "CO",
  Galway: "G",
  Limerick: "LK",
  Waterford: "WD",
  Kilkenny: "KK",
  Drogheda: "LH", Dundalk: "LH",
  Sligo: "SO",
  Athlone: "WH",
  Letterkenny: "DL", Donegal: "DL",
  Tralee: "KY", Killarney: "KY",
  Ennis: "CE",
  Carlow: "CW",
  Wexford: "WX",
  Wicklow: "WW", Bray: "WW",
  Navan: "MH",
  Naas: "KE", "Newbridge": "KE",
  Mullingar: "WH",
  Tullamore: "OY",
  Monaghan: "MN",
  Cavan: "CN",
  Longford: "LD",
  Roscommon: "RN",
  Castlebar: "MO", Ballina: "MO", Westport: "MO",
  Clonmel: "TA", Thurles: "TA", Nenagh: "TA",
  Portlaoise: "LS",
  "Carrick-on-Shannon": "LM",
}

export const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
}
