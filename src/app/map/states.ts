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

// ── UK (ITL1) regions ─────────────────────────────────────────────────────────

export const UK_REGION_CODES = [
  "TLC","TLD","TLE","TLF","TLG","TLH","TLI","TLJ","TLK","TLL","TLM","TLN",
] as const

export type UKRegionCode = typeof UK_REGION_CODES[number]

export const UK_REGION_NAMES: Record<string, string> = {
  TLC: "North East",
  TLD: "North West",
  TLE: "Yorkshire and The Humber",
  TLF: "East Midlands",
  TLG: "West Midlands",
  TLH: "East of England",
  TLI: "London",
  TLJ: "South East",
  TLK: "South West",
  TLL: "Wales",
  TLM: "Scotland",
  TLN: "Northern Ireland",
}

// GeoJSON ITL121CD → clean display name
export const UK_GEOJSON_ITL1_TO_NAME: Record<string, string> = {
  TLC: "North East",
  TLD: "North West",
  TLE: "Yorkshire and The Humber",
  TLF: "East Midlands",
  TLG: "West Midlands",
  TLH: "East of England",
  TLI: "London",
  TLJ: "South East",
  TLK: "South West",
  TLL: "Wales",
  TLM: "Scotland",
  TLN: "Northern Ireland",
}

export const UK_GEOJSON_ITL1_TO_CODE: Record<string, UKRegionCode> = {
  "North East (England)": "TLC",
  "North West (England)": "TLD",
  "Yorkshire and The Humber": "TLE",
  "East Midlands (England)": "TLF",
  "West Midlands (England)": "TLG",
  East: "TLH",
  London: "TLI",
  "South East (England)": "TLJ",
  "South West (England)": "TLK",
  Wales: "TLL",
  Scotland: "TLM",
  "Northern Ireland": "TLN",
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

// ── Germany (DE) Bundesländer ─────────────────────────────────────────────────

export const DE_BUNDESLAND_CODES = [
  "BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH",
] as const

export type DEBundeslandCode = typeof DE_BUNDESLAND_CODES[number]

export const DE_BUNDESLAND_NAMES: Record<string, string> = {
  BW: "Baden-Württemberg",
  BY: "Bayern",
  BE: "Berlin",
  BB: "Brandenburg",
  HB: "Bremen",
  HH: "Hamburg",
  HE: "Hessen",
  MV: "Mecklenburg-Vorpommern",
  NI: "Niedersachsen",
  NW: "Nordrhein-Westfalen",
  RP: "Rheinland-Pfalz",
  SL: "Saarland",
  SN: "Sachsen",
  ST: "Sachsen-Anhalt",
  SH: "Schleswig-Holstein",
  TH: "Thüringen",
}

// ── Netherlands (NL) Provinces ───────────────────────────────────────────────

export const NL_PROVINCE_CODES = [
  "DR","FL","FR","GE","GR","LI","NB","NH","OV","UT","ZE","ZH",
] as const

export type NLProvinceCode = typeof NL_PROVINCE_CODES[number]

export const NL_PROVINCE_NAMES: Record<string, string> = {
  DR: "Drenthe",
  FL: "Flevoland",
  FR: "Fryslân",
  GE: "Gelderland",
  GR: "Groningen",
  LI: "Limburg",
  NB: "Noord-Brabant",
  NH: "Noord-Holland",
  OV: "Overijssel",
  UT: "Utrecht",
  ZE: "Zeeland",
  ZH: "Zuid-Holland",
}

// ── Belgium (BE) Regions ──────────────────────────────────────────────────────

export const BE_REGION_CODES = ["FL", "WA", "BR"] as const

export type BERegionCode = typeof BE_REGION_CODES[number]

export const BE_REGION_NAMES: Record<string, string> = {
  FL: "Flanders",
  WA: "Wallonia",
  BR: "Brussels-Capital",
}

// ── Japan (JP) prefectures ──────────────────────────────────────────────────

export const JP_PREFECTURE_CODES = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
  "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24",
  "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36",
  "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47",
] as const

export type JPPrefectureCode = typeof JP_PREFECTURE_CODES[number]

type JPPrefectureName = { en: string; ja: string; ko: string }

export const JP_PREFECTURE_NAMES: Record<JPPrefectureCode, JPPrefectureName> = {
  "01": { en: "Hokkaido", ja: "北海道", ko: "홋카이도" }, "02": { en: "Aomori", ja: "青森県", ko: "아오모리" },
  "03": { en: "Iwate", ja: "岩手県", ko: "이와테" }, "04": { en: "Miyagi", ja: "宮城県", ko: "미야기" },
  "05": { en: "Akita", ja: "秋田県", ko: "아키타" }, "06": { en: "Yamagata", ja: "山形県", ko: "야마가타" },
  "07": { en: "Fukushima", ja: "福島県", ko: "후쿠시마" }, "08": { en: "Ibaraki", ja: "茨城県", ko: "이바라키" },
  "09": { en: "Tochigi", ja: "栃木県", ko: "도치기" }, "10": { en: "Gunma", ja: "群馬県", ko: "군마" },
  "11": { en: "Saitama", ja: "埼玉県", ko: "사이타마" }, "12": { en: "Chiba", ja: "千葉県", ko: "지바" },
  "13": { en: "Tokyo", ja: "東京都", ko: "도쿄" }, "14": { en: "Kanagawa", ja: "神奈川県", ko: "가나가와" },
  "15": { en: "Niigata", ja: "新潟県", ko: "니가타" }, "16": { en: "Toyama", ja: "富山県", ko: "도야마" },
  "17": { en: "Ishikawa", ja: "石川県", ko: "이시카와" }, "18": { en: "Fukui", ja: "福井県", ko: "후쿠이" },
  "19": { en: "Yamanashi", ja: "山梨県", ko: "야마나시" }, "20": { en: "Nagano", ja: "長野県", ko: "나가노" },
  "21": { en: "Gifu", ja: "岐阜県", ko: "기후" }, "22": { en: "Shizuoka", ja: "静岡県", ko: "시즈오카" },
  "23": { en: "Aichi", ja: "愛知県", ko: "아이치" }, "24": { en: "Mie", ja: "三重県", ko: "미에" },
  "25": { en: "Shiga", ja: "滋賀県", ko: "시가" }, "26": { en: "Kyoto", ja: "京都府", ko: "교토" },
  "27": { en: "Osaka", ja: "大阪府", ko: "오사카" }, "28": { en: "Hyogo", ja: "兵庫県", ko: "효고" },
  "29": { en: "Nara", ja: "奈良県", ko: "나라" }, "30": { en: "Wakayama", ja: "和歌山県", ko: "와카야마" },
  "31": { en: "Tottori", ja: "鳥取県", ko: "돗토리" }, "32": { en: "Shimane", ja: "島根県", ko: "시마네" },
  "33": { en: "Okayama", ja: "岡山県", ko: "오카야마" }, "34": { en: "Hiroshima", ja: "広島県", ko: "히로시마" },
  "35": { en: "Yamaguchi", ja: "山口県", ko: "야마구치" }, "36": { en: "Tokushima", ja: "徳島県", ko: "도쿠시마" },
  "37": { en: "Kagawa", ja: "香川県", ko: "가가와" }, "38": { en: "Ehime", ja: "愛媛県", ko: "에히메" },
  "39": { en: "Kochi", ja: "高知県", ko: "고치" }, "40": { en: "Fukuoka", ja: "福岡県", ko: "후쿠오카" },
  "41": { en: "Saga", ja: "佐賀県", ko: "사가" }, "42": { en: "Nagasaki", ja: "長崎県", ko: "나가사키" },
  "43": { en: "Kumamoto", ja: "熊本県", ko: "구마모토" }, "44": { en: "Oita", ja: "大分県", ko: "오이타" },
  "45": { en: "Miyazaki", ja: "宮崎県", ko: "미야자키" }, "46": { en: "Kagoshima", ja: "鹿児島県", ko: "가고시마" },
  "47": { en: "Okinawa", ja: "沖縄県", ko: "오키나와" },
}

export const JP_CITY_AREAS: Record<string, { prefectureCode: JPPrefectureCode; en: string; ja: string; ko: string }> = {
  "01100": { prefectureCode: "01", en: "Sapporo", ja: "札幌市", ko: "삿포로" },
  "04100": { prefectureCode: "04", en: "Sendai", ja: "仙台市", ko: "센다이" },
  "11100": { prefectureCode: "11", en: "Saitama", ja: "さいたま市", ko: "사이타마시" },
  "12100": { prefectureCode: "12", en: "Chiba", ja: "千葉市", ko: "지바시" },
  "13100": { prefectureCode: "13", en: "Tokyo wards", ja: "東京都区部", ko: "도쿄 특별구" },
  "14100": { prefectureCode: "14", en: "Yokohama", ja: "横浜市", ko: "요코하마" },
  "14130": { prefectureCode: "14", en: "Kawasaki", ja: "川崎市", ko: "가와사키" },
  "14150": { prefectureCode: "14", en: "Sagamihara", ja: "相模原市", ko: "사가미하라" },
  "15100": { prefectureCode: "15", en: "Niigata City", ja: "新潟市", ko: "니가타시" },
  "22100": { prefectureCode: "22", en: "Shizuoka City", ja: "静岡市", ko: "시즈오카시" },
  "22130": { prefectureCode: "22", en: "Hamamatsu", ja: "浜松市", ko: "하마마쓰" },
  "23100": { prefectureCode: "23", en: "Nagoya", ja: "名古屋市", ko: "나고야" },
  "26100": { prefectureCode: "26", en: "Kyoto City", ja: "京都市", ko: "교토시" },
  "27100": { prefectureCode: "27", en: "Osaka City", ja: "大阪市", ko: "오사카시" },
  "27140": { prefectureCode: "27", en: "Sakai", ja: "堺市", ko: "사카이" },
  "28100": { prefectureCode: "28", en: "Kobe", ja: "神戸市", ko: "고베" },
  "33100": { prefectureCode: "33", en: "Okayama City", ja: "岡山市", ko: "오카야마시" },
  "34100": { prefectureCode: "34", en: "Hiroshima City", ja: "広島市", ko: "히로시마시" },
  "40100": { prefectureCode: "40", en: "Kitakyushu", ja: "北九州市", ko: "기타큐슈" },
  "40130": { prefectureCode: "40", en: "Fukuoka City", ja: "福岡市", ko: "후쿠오카시" },
  "43100": { prefectureCode: "43", en: "Kumamoto City", ja: "熊本市", ko: "구마모토시" },
}

export const BE_PROVINCE_CODES = [
  "VAN", "VBR", "VGB", "VWV", "VLI",  // Flanders
  "WBR", "WHT", "WLG", "WLB", "WNA",  // Wallonia
] as const

export type BEProvinceCode = typeof BE_PROVINCE_CODES[number]

export const BE_PROVINCE_NAMES: Record<string, string> = {
  VAN: "Antwerp",
  VBR: "Flemish Brabant",
  VGB: "East Flanders",
  VWV: "West Flanders",
  VLI: "Limburg",
  WBR: "Walloon Brabant",
  WHT: "Hainaut",
  WLG: "Liège",
  WLB: "Luxembourg",
  WNA: "Namur",
}

// ── South Korea (KR) si/do ──────────────────────────────────────────────────

export const KR_SIDO_CODES = [
  "11", "26", "27", "28", "29", "30", "31", "36", "41", "42", "43", "44", "45", "46", "47", "48", "50",
] as const

export type KRSidoCode = typeof KR_SIDO_CODES[number]

export const KR_SIDO_NAMES: Record<KRSidoCode, { ko: string; en: string }> = {
  "11": { ko: "서울특별시", en: "Seoul" },
  "26": { ko: "부산광역시", en: "Busan" },
  "27": { ko: "대구광역시", en: "Daegu" },
  "28": { ko: "인천광역시", en: "Incheon" },
  "29": { ko: "광주광역시", en: "Gwangju" },
  "30": { ko: "대전광역시", en: "Daejeon" },
  "31": { ko: "울산광역시", en: "Ulsan" },
  "36": { ko: "세종특별자치시", en: "Sejong" },
  "41": { ko: "경기도", en: "Gyeonggi" },
  "42": { ko: "강원특별자치도", en: "Gangwon" },
  "43": { ko: "충청북도", en: "Chungbuk" },
  "44": { ko: "충청남도", en: "Chungnam" },
  "45": { ko: "전북특별자치도", en: "Jeonbuk" },
  "46": { ko: "전라남도", en: "Jeonnam" },
  "47": { ko: "경상북도", en: "Gyeongbuk" },
  "48": { ko: "경상남도", en: "Gyeongnam" },
  "50": { ko: "제주특별자치도", en: "Jeju" },
}

// ── France (FR) metropolitan regions ────────────────────────────────────────

export const FR_REGION_CODES = ["11", "24", "27", "28", "32", "44", "52", "53", "75", "76", "84", "93", "94"] as const

export type FRRegionCode = typeof FR_REGION_CODES[number]

export const FR_REGION_NAMES: Record<FRRegionCode, string> = {
  "11": "Île-de-France",
  "24": "Centre-Val de Loire",
  "27": "Bourgogne-Franche-Comté",
  "28": "Normandie",
  "32": "Hauts-de-France",
  "44": "Grand Est",
  "52": "Pays de la Loire",
  "53": "Bretagne",
  "75": "Nouvelle-Aquitaine",
  "76": "Occitanie",
  "84": "Auvergne-Rhône-Alpes",
  "93": "Provence-Alpes-Côte d'Azur",
  "94": "Corse",
}

// ── UAE (AE) emirates ────────────────────────────────────────────────────

export const AE_EMIRATE_CODES = ["AUH", "DXB", "SHJ", "AJM", "UAQ", "RAK", "FUJ"] as const

export type AEEmirateCode = typeof AE_EMIRATE_CODES[number]

export const AE_EMIRATE_NAMES: Record<AEEmirateCode, { en: string; ko: string }> = {
  AUH: { en: "Abu Dhabi", ko: "아부다비" },
  DXB: { en: "Dubai", ko: "두바이" },
  SHJ: { en: "Sharjah", ko: "샤르자" },
  AJM: { en: "Ajman", ko: "아즈만" },
  UAQ: { en: "Umm Al Quwain", ko: "움알콰인" },
  RAK: { en: "Ras Al Khaimah", ko: "라스알카이마" },
  FUJ: { en: "Fujairah", ko: "푸자이라" },
}

// ── New Zealand (NZ) regions ───────────────────────────────────────────────

export const NZ_REGION_CODES = [
  "NTL","AUK","WKO","BOP","GIS","HAW","TAR","MWT","WGN","TAS","NSN","MBH","WTC","CAN","OTG","STL",
] as const

export type NZRegionCode = typeof NZ_REGION_CODES[number]

export const NZ_REGION_NAMES: Record<NZRegionCode, string> = {
  NTL: "Northland",
  AUK: "Auckland",
  WKO: "Waikato",
  BOP: "Bay of Plenty",
  GIS: "Gisborne",
  HAW: "Hawke's Bay",
  TAR: "Taranaki",
  MWT: "Manawatū-Whanganui",
  WGN: "Wellington",
  TAS: "Tasman",
  NSN: "Nelson",
  MBH: "Marlborough",
  WTC: "West Coast",
  CAN: "Canterbury",
  OTG: "Otago",
  STL: "Southland",
}

// ── Norway (NO) fylker ──────────────────────────────────────────────────

export const NO_REGION_CODES = [
  "OSL","ROG","MRD","NOR","OST","AKE","BUS","INN","VST","TEL","AGD","VEL","TRN","TRO","FIN",
] as const

export type NORegionCode = typeof NO_REGION_CODES[number]

export const NO_REGION_NAMES: Record<NORegionCode, string> = {
  OSL: "Oslo",
  ROG: "Rogaland",
  MRD: "Møre og Romsdal",
  NOR: "Nordland",
  OST: "Østfold",
  AKE: "Akershus",
  BUS: "Buskerud",
  INN: "Innlandet",
  VST: "Vestfold",
  TEL: "Telemark",
  AGD: "Agder",
  VEL: "Vestland",
  TRN: "Trøndelag",
  TRO: "Troms",
  FIN: "Finnmark",
}

// ── Sweden (SE) regions (län) ──────────────────────────────────────────────

export const SE_REGION_CODES = [
  "AB","AC","BD","C","D","E","F","G","H","I","K","M","N","O","S","T","U","W","X","Y","Z",
] as const

export type SERegionCode = typeof SE_REGION_CODES[number]

export const SE_REGION_NAMES: Record<SERegionCode, string> = {
  AB: "Stockholm",
  AC: "Västerbotten",
  BD: "Norrbotten",
  C: "Uppsala",
  D: "Södermanland",
  E: "Östergötland",
  F: "Jönköping",
  G: "Kronoberg",
  H: "Kalmar",
  I: "Gotland",
  K: "Blekinge",
  M: "Skåne",
  N: "Halland",
  O: "Västra Götaland",
  S: "Värmland",
  T: "Örebro",
  U: "Västmanland",
  W: "Dalarna",
  X: "Gävleborg",
  Y: "Jämtland",
  Z: "Västernorrland",
}

// ── Denmark (DK) regions ──────────────────────────────────────────────

export const DK_REGION_CODES = ["HST", "MID", "SDJ", "SJA", "NOR"] as const

export type DKRegionCode = typeof DK_REGION_CODES[number]

export const DK_REGION_NAMES: Record<DKRegionCode, string> = {
  HST: "Hovedstaden",
  MID: "Midtjylland",
  SDJ: "Syddanmark",
  SJA: "Sjælland",
  NOR: "Nordjylland",
}

// ── Finland (FI) regions (maakunnat) ───────────────────────────────────────

export const FI_REGION_CODES = [
  "UUS", "PIR", "VRS", "NSV", "NPO", "PKY", "KSR", "KAI", "NKR", "SAT", "SKR", "KYS", "KHM", "PHM", "KPK", "KYR",
] as const

export type FIRegionCode = typeof FI_REGION_CODES[number]

export const FI_REGION_NAMES: Record<FIRegionCode, string> = {
  UUS: "Uusimaa", PIR: "Pirkanmaa", VRS: "Varsinais-Suomi", NSV: "Pohjois-Savo",
  NPO: "Pohjois-Pohjanmaa", PKY: "Päijät-Häme", KSR: "Keski-Suomi", KAI: "Kainuu",
  NKR: "Pohjois-Karjala", SAT: "Satakunta", SKR: "Etelä-Karjala", KYS: "Etelä-Savo",
  KHM: "Kanta-Häme", PHM: "Pohjanmaa", KPK: "Keski-Pohjanmaa", KYR: "Kymenlaakso",
}

// ── Switzerland (CH) cantons ──────────────────────────────────────────────

export const CH_CANTON_CODES = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU", "LU", "NE",
  "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH",
] as const

export type CHCantonCode = typeof CH_CANTON_CODES[number]

export const CH_CANTON_NAMES: Record<CHCantonCode, string> = {
  AG: "Aargau", AI: "Appenzell Innerrhoden", AR: "Appenzell Ausserrhoden", BE: "Bern",
  BL: "Basel-Landschaft", BS: "Basel-Stadt", FR: "Fribourg", GE: "Geneva", GL: "Glarus",
  GR: "Grisons", JU: "Jura", LU: "Lucerne", NE: "Neuchâtel", NW: "Nidwalden", OW: "Obwalden",
  SG: "St. Gallen", SH: "Schaffhausen", SO: "Solothurn", SZ: "Schwyz", TG: "Thurgau", TI: "Ticino",
  UR: "Uri", VD: "Vaud", VS: "Valais", ZG: "Zug", ZH: "Zurich",
}
