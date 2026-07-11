import { createHash } from "crypto"

export const SPAIN_SOURCE_URLS = {
  shortageCatalog: "https://www.sepe.es/dam/jcr%3A3dc1fa69-05a5-41a4-9398-f9442c9cd3db/catalogo-ocupaciones-dificil-cobertura-1T-2026.pdf",
  shortageLanding: "https://www.sepe.es/HomeSepe/empresas/informacion-para-empresas/profesiones-de-dificil-cobertura/profesiones-mas-demandadas",
  contracts: "https://www.sepe.es/HomeSepe/que-es-el-sepe/estadisticas/contratos/estadisticas-nuevas/2026/enero.html",
  wages: "https://ine.es/dyngs/Prensa/EAES2024.htm",
  rent: "https://publicaciones.transportes.gob.es/downloadcustom/sample/4078",
  rentLanding: "https://serpavi.mivau.gob.es/",
  ruct: "https://www.educacion.gob.es/ruct/home",
  ructUniversities: "https://www.educacion.gob.es/ruct/consultauniversidades?actual=universidades",
  cartoCiudad: "https://www.cartociudad.es/geocoder/api/geocoder/candidates",
  ign: "https://contenido.ign.es/wfs-inspire/unidades-administrativas",
  studentWork: "https://www.inclusion.gob.es/web/migraciones/w/hoja-4-bis-acceso-al-empleo-de-las-personas-titulares-de-una-autorizacion-de-estancia-de-larga-duracion-por-estudios-movilidad-de-alumnos-servicios-de-voluntariado-o-actividades-formativas",
  postStudy: "https://inclusion.gob.es/web/migraciones/w/20.-autorizacion-de-residencia-para-busqueda-de-empleo-o-inicio-de-proyecto-empresarial",
  degreeRecognition: "https://www.ciencia.gob.es/Universidades/validate/como_reconocer.html",
  jobSearch: "https://www.empleate.gob.es/empleo/#/busqueda",
} as const

export type SpainCommunitySeed = {
  code: string
  ructCode: string
  nameEs: string
  nameEn: string
  nameKo: string
  coOfficialLanguage: string | null
}

export const SPAIN_COMMUNITIES: SpainCommunitySeed[] = [
  { code: "01", ructCode: "01", nameEs: "Andalucía", nameEn: "Andalusia", nameKo: "안달루시아", coOfficialLanguage: null },
  { code: "02", ructCode: "02", nameEs: "Aragón", nameEn: "Aragon", nameKo: "아라곤", coOfficialLanguage: null },
  { code: "03", ructCode: "03", nameEs: "Asturias, Principado de", nameEn: "Asturias", nameKo: "아스투리아스", coOfficialLanguage: null },
  { code: "04", ructCode: "04", nameEs: "Balears, Illes", nameEn: "Balearic Islands", nameKo: "발레아레스 제도", coOfficialLanguage: "Catalan" },
  { code: "05", ructCode: "05", nameEs: "Canarias", nameEn: "Canary Islands", nameKo: "카나리아 제도", coOfficialLanguage: null },
  { code: "06", ructCode: "06", nameEs: "Cantabria", nameEn: "Cantabria", nameKo: "칸타브리아", coOfficialLanguage: null },
  { code: "07", ructCode: "07", nameEs: "Castilla y León", nameEn: "Castile and León", nameKo: "카스티야 이 레온", coOfficialLanguage: null },
  { code: "08", ructCode: "08", nameEs: "Castilla-La Mancha", nameEn: "Castilla-La Mancha", nameKo: "카스티야 라만차", coOfficialLanguage: null },
  { code: "09", ructCode: "09", nameEs: "Cataluña", nameEn: "Catalonia", nameKo: "카탈루냐", coOfficialLanguage: "Catalan" },
  { code: "10", ructCode: "16", nameEs: "Comunitat Valenciana", nameEn: "Valencian Community", nameKo: "발렌시아 공동체", coOfficialLanguage: "Valencian/Catalan" },
  { code: "11", ructCode: "10", nameEs: "Extremadura", nameEn: "Extremadura", nameKo: "엑스트레마두라", coOfficialLanguage: null },
  { code: "12", ructCode: "11", nameEs: "Galicia", nameEn: "Galicia", nameKo: "갈리시아", coOfficialLanguage: "Galician" },
  { code: "13", ructCode: "13", nameEs: "Madrid, Comunidad de", nameEn: "Community of Madrid", nameKo: "마드리드 공동체", coOfficialLanguage: null },
  { code: "14", ructCode: "14", nameEs: "Murcia, Región de", nameEn: "Region of Murcia", nameKo: "무르시아", coOfficialLanguage: null },
  { code: "15", ructCode: "15", nameEs: "Navarra, Comunidad Foral de", nameEn: "Navarre", nameKo: "나바라", coOfficialLanguage: "Basque (limited areas)" },
  { code: "16", ructCode: "17", nameEs: "País Vasco", nameEn: "Basque Country", nameKo: "바스크", coOfficialLanguage: "Basque" },
  { code: "17", ructCode: "12", nameEs: "Rioja, La", nameEn: "La Rioja", nameKo: "라리오하", coOfficialLanguage: null },
]

export type SpainProvinceSeed = { code: string; communityCode: string; nameEs: string; capital: string; aliases?: string[] }

export const SPAIN_PROVINCES: SpainProvinceSeed[] = [
  { code: "01", communityCode: "16", nameEs: "Araba/Álava", capital: "Vitoria-Gasteiz", aliases: ["ARABA", "ALAVA"] },
  { code: "02", communityCode: "08", nameEs: "Albacete", capital: "Albacete" }, { code: "03", communityCode: "10", nameEs: "Alicante/Alacant", capital: "Alicante", aliases: ["ALICANTE"] },
  { code: "04", communityCode: "01", nameEs: "Almería", capital: "Almería" }, { code: "05", communityCode: "07", nameEs: "Ávila", capital: "Ávila" },
  { code: "06", communityCode: "11", nameEs: "Badajoz", capital: "Badajoz" }, { code: "07", communityCode: "04", nameEs: "Balears, Illes", capital: "Palma", aliases: ["MALLORCA", "ILLES BALEARS"] },
  { code: "08", communityCode: "09", nameEs: "Barcelona", capital: "Barcelona" }, { code: "09", communityCode: "07", nameEs: "Burgos", capital: "Burgos" },
  { code: "10", communityCode: "11", nameEs: "Cáceres", capital: "Cáceres" }, { code: "11", communityCode: "01", nameEs: "Cádiz", capital: "Cádiz" },
  { code: "12", communityCode: "10", nameEs: "Castellón/Castelló", capital: "Castellón de la Plana", aliases: ["CASTELLON"] }, { code: "13", communityCode: "08", nameEs: "Ciudad Real", capital: "Ciudad Real" },
  { code: "14", communityCode: "01", nameEs: "Córdoba", capital: "Córdoba" }, { code: "15", communityCode: "12", nameEs: "A Coruña", capital: "A Coruña", aliases: ["CORUNA"] },
  { code: "16", communityCode: "08", nameEs: "Cuenca", capital: "Cuenca" }, { code: "17", communityCode: "09", nameEs: "Girona", capital: "Girona", aliases: ["GERONA"] },
  { code: "18", communityCode: "01", nameEs: "Granada", capital: "Granada" }, { code: "19", communityCode: "08", nameEs: "Guadalajara", capital: "Guadalajara" },
  { code: "20", communityCode: "16", nameEs: "Gipuzkoa", capital: "San Sebastián", aliases: ["GIPUZKOA", "GUIPUZCOA"] }, { code: "21", communityCode: "01", nameEs: "Huelva", capital: "Huelva" },
  { code: "22", communityCode: "02", nameEs: "Huesca", capital: "Huesca" }, { code: "23", communityCode: "01", nameEs: "Jaén", capital: "Jaén" },
  { code: "24", communityCode: "07", nameEs: "León", capital: "León" }, { code: "25", communityCode: "09", nameEs: "Lleida", capital: "Lleida", aliases: ["LERIDA"] },
  { code: "26", communityCode: "17", nameEs: "La Rioja", capital: "Logroño", aliases: ["LA RIOJA"] }, { code: "27", communityCode: "12", nameEs: "Lugo", capital: "Lugo" },
  { code: "28", communityCode: "13", nameEs: "Madrid", capital: "Madrid" }, { code: "29", communityCode: "01", nameEs: "Málaga", capital: "Málaga" },
  { code: "30", communityCode: "14", nameEs: "Murcia", capital: "Murcia" }, { code: "31", communityCode: "15", nameEs: "Navarra", capital: "Pamplona", aliases: ["NAVARRA"] },
  { code: "32", communityCode: "12", nameEs: "Ourense", capital: "Ourense", aliases: ["ORENSE"] }, { code: "33", communityCode: "03", nameEs: "Asturias", capital: "Oviedo", aliases: ["ASTURIAS"] },
  { code: "34", communityCode: "07", nameEs: "Palencia", capital: "Palencia" }, { code: "35", communityCode: "05", nameEs: "Las Palmas", capital: "Las Palmas de Gran Canaria" },
  { code: "36", communityCode: "12", nameEs: "Pontevedra", capital: "Pontevedra" }, { code: "37", communityCode: "07", nameEs: "Salamanca", capital: "Salamanca" },
  { code: "38", communityCode: "05", nameEs: "Santa Cruz de Tenerife", capital: "Santa Cruz de Tenerife" }, { code: "39", communityCode: "06", nameEs: "Cantabria", capital: "Santander", aliases: ["CANTABRIA"] },
  { code: "40", communityCode: "07", nameEs: "Segovia", capital: "Segovia" }, { code: "41", communityCode: "01", nameEs: "Sevilla", capital: "Sevilla" },
  { code: "42", communityCode: "07", nameEs: "Soria", capital: "Soria" }, { code: "43", communityCode: "09", nameEs: "Tarragona", capital: "Tarragona" },
  { code: "44", communityCode: "02", nameEs: "Teruel", capital: "Teruel" }, { code: "45", communityCode: "08", nameEs: "Toledo", capital: "Toledo" },
  { code: "46", communityCode: "10", nameEs: "Valencia/València", capital: "Valencia", aliases: ["VALENCIA"] }, { code: "47", communityCode: "07", nameEs: "Valladolid", capital: "Valladolid" },
  { code: "48", communityCode: "16", nameEs: "Bizkaia", capital: "Bilbao", aliases: ["BIZKAIA", "VIZCAYA"] }, { code: "49", communityCode: "07", nameEs: "Zamora", capital: "Zamora" },
  { code: "50", communityCode: "02", nameEs: "Zaragoza", capital: "Zaragoza" },
]

export const SPAIN_SHORTAGE_TRANSLATIONS: Record<string, { en: string; ko: string }> = {
  "frigoristas navales": { en: "Marine refrigeration technicians", ko: "선박 냉동설비 기술자" },
  "jefes de máquinas de buque mercante": { en: "Merchant-vessel chief engineers", ko: "상선 기관장" },
  "maquinistas navales": { en: "Marine engine operators", ko: "선박 기관사" },
  "mecánicos de litoral": { en: "Coastal-vessel mechanics", ko: "연안 선박 정비사" },
  "mecánicos navales": { en: "Marine mechanics", ko: "선박 정비사" },
  "pilotos de buques mercantes": { en: "Merchant-vessel pilots", ko: "상선 항해사" },
  "sobrecargos de buques": { en: "Ship pursers", ko: "선박 사무장" },
  "deportistas profesionales": { en: "Professional athletes", ko: "프로 운동선수" },
  "entrenadores deportivos": { en: "Sports coaches", ko: "스포츠 코치" },
  "oficiales radioelectrónicos de la marina mercante": { en: "Merchant-marine radio electronics officers", ko: "상선 무선전자 통신사" },
  "cocineros de barco": { en: "Ship cooks", ko: "선박 조리사" },
  "auxiliares de buques de pasaje": { en: "Passenger-vessel assistants", ko: "여객선 보조원" },
  "camareros de barco": { en: "Ship stewards", ko: "선박 승무원" },
  "mayordomos de buque": { en: "Ship head stewards", ko: "선박 총무장" },
  "carpinteros de aluminio, metálico y pvc": { en: "Aluminium, metal and PVC carpenters", ko: "알루미늄·금속·PVC 시공원" },
  "montadores de carpintería metálica, aluminio y pvc": { en: "Metal, aluminium and PVC fitters", ko: "금속·알루미늄·PVC 조립 시공원" },
  "instaladores electricistas de edificios y viviendas": { en: "Building and residential electricians", ko: "건물·주택 전기설비 기사" },
  "instaladores electricistas, en general": { en: "General electrical installers", ko: "전기설비 기사" },
  "caldereteros (maestranzas)": { en: "Boilermakers", ko: "보일러 제작·금속 가공원" },
  "conductores-operadores de grúa en camión": { en: "Truck-mounted crane operators", ko: "트럭 탑재 크레인 운전원" },
  "conductores-operadores de grúa fija, en general": { en: "Fixed crane operators", ko: "고정식 크레인 운전원" },
  "conductores-operadores de grúa móvil": { en: "Mobile crane operators", ko: "이동식 크레인 운전원" },
  "engrasadores de máquinas de barcos": { en: "Ship machinery lubricators", ko: "선박 기관 윤활원" },
  "bomberos de buques especializados": { en: "Specialised ship firefighters", ko: "선박 전문 소방원" },
  "contramaestres de cubierta (excepto pesca)": { en: "Deck boatswains (excluding fishing)", ko: "갑판 갑판장(어업 제외)" },
  "marineros de cubierta (excepto pesca)": { en: "Deck sailors (excluding fishing)", ko: "갑판 선원(어업 제외)" },
  "mozos de cubierta": { en: "Deck hands", ko: "갑판 보조 선원" },
}

export const SPAIN_CNO_GROUPS = [
  { code: "A", nameEs: "Directores y gerentes", nameEn: "Managers and directors", nameKo: "경영자 및 관리자" },
  { code: "B", nameEs: "Técnicos y profesionales científicos e intelectuales", nameEn: "Science and professional specialists", nameKo: "과학·전문직" },
  { code: "C", nameEs: "Otros técnicos y profesionales científicos e intelectuales", nameEn: "Other science and professional specialists", nameKo: "기타 과학·전문직" },
  { code: "D", nameEs: "Técnicos; profesionales de apoyo", nameEn: "Technicians and associate professionals", nameKo: "기술자 및 준전문가" },
  { code: "E", nameEs: "Empleados de oficina no atendiendo al público", nameEn: "Back-office clerks", nameKo: "내근 사무직" },
  { code: "F", nameEs: "Empleados de oficina atendiendo al público", nameEn: "Front-office clerks", nameKo: "대민 사무직" },
  { code: "G", nameEs: "Trabajadores de restauración y comercio", nameEn: "Hospitality and sales workers", nameKo: "외식·판매 종사자" },
  { code: "H", nameEs: "Trabajadores de los servicios de salud y cuidado", nameEn: "Health and care service workers", nameKo: "보건·돌봄 서비스 종사자" },
  { code: "I", nameEs: "Trabajadores de protección y seguridad", nameEn: "Protection and security workers", nameKo: "보호·보안 종사자" },
  { code: "J", nameEs: "Trabajadores cualificados del sector agrícola", nameEn: "Skilled agricultural workers", nameKo: "숙련 농업 종사자" },
  { code: "K", nameEs: "Trabajadores cualificados de la construcción", nameEn: "Skilled construction workers", nameKo: "숙련 건설 종사자" },
  { code: "L", nameEs: "Trabajadores cualificados de las industrias", nameEn: "Skilled industrial workers", nameKo: "숙련 산업 종사자" },
  { code: "M", nameEs: "Operadores de instalaciones y maquinaria", nameEn: "Plant and machine operators", nameKo: "설비·기계 조작원" },
  { code: "N", nameEs: "Conductores y operadores móviles", nameEn: "Drivers and mobile operators", nameKo: "운전·이동장비 조작원" },
  { code: "O", nameEs: "Trabajadores no cualificados en servicios", nameEn: "Elementary service workers", nameKo: "단순 서비스 종사자" },
  { code: "P", nameEs: "Peones de agricultura, pesca y construcción", nameEn: "Agriculture, fishing and construction labourers", nameKo: "농수산·건설 단순노무직" },
] as const

export const SPAIN_UNIVERSITY_SEEDS = [
  { ructCode: "017", regionCode: "01", nameEs: "Universidad de Sevilla", cityName: "Sevilla", officialUrl: "https://www.us.es/" },
  { ructCode: "021", regionCode: "02", nameEs: "Universidad de Zaragoza", cityName: "Zaragoza", officialUrl: "https://www.unizar.es/" },
  { ructCode: "013", regionCode: "03", nameEs: "Universidad de Oviedo", cityName: "Oviedo", officialUrl: "https://www.uniovi.es/" },
  { ructCode: "003", regionCode: "04", nameEs: "Universitat de les Illes Balears", cityName: "Palma", officialUrl: "https://www.uib.es/" },
  { ructCode: "015", regionCode: "05", nameEs: "Universidad de La Laguna", cityName: "San Cristóbal de La Laguna", officialUrl: "https://www.ull.es/" },
  { ructCode: "016", regionCode: "06", nameEs: "Universidad de Cantabria", cityName: "Santander", officialUrl: "https://web.unican.es/" },
  { ructCode: "014", regionCode: "07", nameEs: "Universidad de Salamanca", cityName: "Salamanca", officialUrl: "https://www.usal.es/" },
  { ructCode: "034", regionCode: "08", nameEs: "Universidad de Castilla-La Mancha", cityName: "Ciudad Real", officialUrl: "https://www.uclm.es/" },
  { ructCode: "004", regionCode: "09", nameEs: "Universidad de Barcelona", cityName: "Barcelona", officialUrl: "https://web.ub.edu/" },
  { ructCode: "018", regionCode: "10", nameEs: "Universitat de València", cityName: "Valencia", officialUrl: "https://www.uv.es/" },
  { ructCode: "002", regionCode: "11", nameEs: "Universidad de Extremadura", cityName: "Badajoz", officialUrl: "https://www.unex.es/" },
  { ructCode: "007", regionCode: "12", nameEs: "Universidade de Santiago de Compostela", cityName: "Santiago de Compostela", officialUrl: "https://www.usc.gal/" },
  { ructCode: "010", regionCode: "13", nameEs: "Universidad Complutense de Madrid", cityName: "Madrid", officialUrl: "https://www.ucm.es/" },
  { ructCode: "012", regionCode: "14", nameEs: "Universidad de Murcia", cityName: "Murcia", officialUrl: "https://www.um.es/" },
  { ructCode: "031", regionCode: "15", nameEs: "Universidad de Navarra", cityName: "Pamplona", officialUrl: "https://www.unav.edu/" },
  { ructCode: "020", regionCode: "16", nameEs: "Universidad del País Vasco/Euskal Herriko Unibertsitatea", cityName: "Bilbao", officialUrl: "https://www.ehu.eus/" },
  { ructCode: "045", regionCode: "17", nameEs: "Universidad de La Rioja", cityName: "Logroño", officialUrl: "https://www.unirioja.es/" },
] as const

export const SPAIN_SERPAVI_RENT_2024: Record<string, { eurM2: number; p25EurM2: number; p75EurM2: number; monthlyEur: number }> = {
  "01": { eurM2: 7.4, p25EurM2: 5.4, p75EurM2: 9.8, monthlyEur: 550 }, "02": { eurM2: 7.1, p25EurM2: 5.5, p75EurM2: 8.8, monthlyEur: 500 }, "03": { eurM2: 6.6, p25EurM2: 5.2, p75EurM2: 8.5, monthlyEur: 468 }, "04": { eurM2: 9.6, p25EurM2: 7.0, p75EurM2: 13.0, monthlyEur: 750 }, "05": { eurM2: 7.7, p25EurM2: 5.9, p75EurM2: 10.2, monthlyEur: 550 }, "06": { eurM2: 7.2, p25EurM2: 5.7, p75EurM2: 9.2, monthlyEur: 520 }, "07": { eurM2: 6.0, p25EurM2: 4.6, p75EurM2: 7.6, monthlyEur: 470 }, "08": { eurM2: 5.9, p25EurM2: 4.4, p75EurM2: 7.6, monthlyEur: 471 }, "09": { eurM2: 9.8, p25EurM2: 7.0, p75EurM2: 13.2, monthlyEur: 700 }, "10": { eurM2: 6.3, p25EurM2: 4.6, p75EurM2: 8.7, monthlyEur: 526 }, "11": { eurM2: 5.0, p25EurM2: 3.8, p75EurM2: 6.4, monthlyEur: 425 }, "12": { eurM2: 5.8, p25EurM2: 4.2, p75EurM2: 7.8, monthlyEur: 450 }, "13": { eurM2: 12.1, p25EurM2: 9.4, p75EurM2: 16.0, monthlyEur: 800 }, "14": { eurM2: 5.4, p25EurM2: 4.0, p75EurM2: 7.2, monthlyEur: 450 }, "15": { eurM2: 6.9, p25EurM2: 5.1, p75EurM2: 8.7, monthlyEur: 598 }, "16": { eurM2: 10.1, p25EurM2: 8.3, p75EurM2: 12.4, monthlyEur: 729 }, "17": { eurM2: 5.9, p25EurM2: 4.6, p75EurM2: 7.5, monthlyEur: 483 },
}

export function sha256(input: Uint8Array | string) { return createHash("sha256").update(input).digest("hex") }

export function normalizeSpanish(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, " ").trim().toLowerCase()
}

export function slugifySpanish(value: string) { return normalizeSpanish(value).replace(/\s+/g, "-") }

export function parseSpanishNumber(value: string) {
  const normalized = value.replace(/\*/g, "").replace(/\./g, "").replace(",", ".").trim()
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}
