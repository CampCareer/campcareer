import { createHash } from "crypto"

export const FRANCE_SOURCE_URLS = {
  bmoNational: "https://statistiques.francetravail.org/bmo/bmoexp?le=0&pp=2026",
  bmoRegions: "https://statistiques.francetravail.org/bmo/bmoexp?le=0&na=0&pp=2026",
  bmoBasins: "https://statistiques.francetravail.org/bmo/bmoexp?le=0&nc=0&pp=2026",
  rentDataset: "https://static.data.gouv.fr/resources/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025/20251211-145010/pred-app-mef-dhup.csv",
  rentLanding: "https://www.data.gouv.fr/datasets/carte-des-loyers-indicateurs-de-loyers-dannonce-par-commune-en-2025",
  salaries: "https://www.insee.fr/fr/statistiques/fichier/2021266/DS_BTS_SAL_EQTP_SEX_PCS_2023_CSV_FR.zip",
  salaryLanding: "https://www.insee.fr/fr/statistiques/2021266",
  universities: "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-principaux-etablissements-enseignement-superieur/exports/csv?limit=-1",
  universityLanding: "https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-principaux-etablissements-enseignement-superieur/",
  regions: "https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=ADMINEXPRESS-COG.LATEST:region&OUTPUTFORMAT=application%2Fjson",
  communeBase: "https://geo.api.gouv.fr/communes",
} as const

export const METROPOLITAN_REGION_CODES = ["11", "24", "27", "28", "32", "44", "52", "53", "75", "76", "84", "93", "94"] as const

export const FR_OCCUPATION_TRANSLATIONS: Record<string, { en: string; ko: string }> = {
  "Aides de cuisine et employés polyvalents de la restauration": { en: "Kitchen assistants and multi-skilled restaurant workers", ko: "주방 보조 및 다기능 식당 종사자" },
  "Serveurs de cafés restaurants": { en: "Cafe and restaurant servers", ko: "카페 및 레스토랑 서버" },
  "Viticulteurs, arboriculteurs": { en: "Winegrowers and arboriculturists", ko: "포도 재배자 및 과수 재배자" },
  "Agriculteurs": { en: "Farmers", ko: "농업 종사자" },
  "Agents d'entretien de locaux": { en: "Building cleaning workers", ko: "건물 청소원" },
  "Aides à domicile et auxiliaires de vie": { en: "Home care aides and personal care assistants", ko: "재가 돌봄 보조원 및 생활지원사" },
  "Professionnels de l'animation socioculturelle": { en: "Community and cultural activity professionals", ko: "사회·문화 활동 전문가" },
  "Aides-soignants": { en: "Nursing assistants", ko: "간호조무사 및 간병 보조원" },
  "Employés de libre service": { en: "Shelf stockers and self-service retail workers", ko: "매장 진열 및 셀프서비스 소매 직원" },
  "Cuisiniers": { en: "Cooks", ko: "요리사" },
  "Artistes (musique, danse, spectacles)": { en: "Performing artists (music, dance and shows)", ko: "공연 예술가(음악·무용·쇼)" },
  "Employés de l'hôtellerie": { en: "Hotel service workers", ko: "호텔 서비스 직원" },
  "Personnels de ménage chez des particuliers": { en: "Private household cleaners", ko: "가정 방문 청소원" },
  "Infirmiers et sages-femmes": { en: "Nurses and midwives", ko: "간호사 및 조산사" },
  "Caissiers": { en: "Cashiers", ko: "계산원" },
  "Jardiniers des espaces verts et naturels": { en: "Landscape and green-space gardeners", ko: "조경 및 녹지 관리원" },
  "Vendeurs en produits alimentaires": { en: "Food sales workers", ko: "식품 판매원" },
  "Professionnels des spectacles": { en: "Entertainment professionals", ko: "공연 산업 전문가" },
  "Magasiniers et préparateurs de commandes peu qualifiés": { en: "Entry-level warehouse and order-picking workers", ko: "초급 창고·주문 처리 직원" },
  "Vendeurs en habillement et accessoires, articles de luxe, de sport, de loisirs et culturels": { en: "Clothing, luxury, sports, leisure and cultural goods sales workers", ko: "의류·명품·스포츠·문화상품 판매원" },
  "Agents d'accueil et d'information": { en: "Reception and information staff", ko: "안내 및 접수 직원" },
  "Conducteurs routiers": { en: "Road freight drivers", ko: "화물차 운전원" },
  "Secrétaires bureautiques et assimilés": { en: "Office secretaries and related workers", ko: "사무 비서 및 유사 직종" },
  "Agents administratifs": { en: "Administrative clerks", ko: "행정 사무원" },
  "Agents de sécurité et de surveillance": { en: "Security and surveillance officers", ko: "보안 및 감시 요원" },
  "Educateurs spécialisés et autres intervenants socio-éducatifs": { en: "Special education and social support professionals", ko: "특수교육 및 사회복지 지원 전문가" },
  "Assistants maternels, auxiliaires de puériculture, assistants familiaux et gardes à domicile": { en: "Childcare assistants and home child carers", ko: "보육 보조원 및 가정 돌봄 제공자" },
  "Ouvriers peu qualifiés des industries agro-alimentaires": { en: "Entry-level food manufacturing workers", ko: "초급 식품 제조 노동자" },
  "Maraîchers et horticulteurs": { en: "Market gardeners and horticulturists", ko: "채소 재배자 및 원예가" },
  "Sportifs et animateurs sportifs": { en: "Athletes and sports activity instructors", ko: "운동선수 및 스포츠 지도자" },
  "Attachés commerciaux": { en: "Sales representatives", ko: "영업 담당자" },
  "Manutentionnaires et déménageurs peu qualifiés": { en: "Entry-level material handlers and movers", ko: "초급 하역·이사 작업자" },
  "Ouvriers mécaniciens de véhicules": { en: "Vehicle mechanics", ko: "자동차 정비원" },
  "Ingénieurs et cadres d'étude, recherche et développement en informatique et télécom": { en: "IT and telecommunications R&D engineers and managers", ko: "IT·통신 연구개발 엔지니어 및 관리자" },
  "Agents de service hospitaliers": { en: "Hospital service workers", ko: "병원 서비스 직원" },
  "Formateurs": { en: "Vocational trainers", ko: "직업 교육 강사" },
  "Conducteurs et livreurs sur courte distance (hors distribution de documents)": { en: "Short-distance drivers and delivery workers", ko: "단거리 운전 및 배송원" },
  "Ouvriers de l'assainissement et du traitement des déchets": { en: "Sanitation and waste-treatment workers", ko: "위생 및 폐기물 처리 노동자" },
  "Boulangers, pâtissiers": { en: "Bakers and pastry chefs", ko: "제빵사 및 파티시에" },
  "Maçons qualifiés": { en: "Skilled masons", ko: "숙련 석공" },
  "Coiffeurs, esthéticiens": { en: "Hairdressers and beauticians", ko: "미용사 및 피부관리사" },
  "Ouvriers de la maintenance générale et mécanique": { en: "General and mechanical maintenance workers", ko: "일반·기계 유지보수 노동자" },
  "Surveillants d'établissements scolaires et accompagnateurs des élèves en situation de handicap": { en: "School supervisors and disability support assistants", ko: "학교 생활지도원 및 장애학생 지원 인력" },
  "Employés de la comptabilité": { en: "Accounting clerks", ko: "회계 사무원" },
  "Télévendeurs et téléconseillers": { en: "Telemarketers and call-centre advisers", ko: "텔레마케터 및 콜센터 상담원" },
  "Conducteurs de transport en commun sur route": { en: "Road public-transport drivers", ko: "도로 대중교통 운전원" },
  "Conducteurs de véhicules légers": { en: "Light vehicle drivers", ko: "승용·경차 운전원" },
  "Ouvriers qualifiés des industries agro-alimentaires": { en: "Skilled food manufacturing workers", ko: "숙련 식품 제조 노동자" },
  "Ouvriers du conditionnement, du tri et de l'emballage": { en: "Packaging, sorting and packing workers", ko: "포장·분류·선별 노동자" },
  "Ingénieurs et cadres d'étude, recherche et développement (industrie)": { en: "Industrial R&D engineers and managers", ko: "산업 연구개발 엔지니어 및 관리자" },
  "Plombiers chauffagistes": { en: "Plumbers and heating installers", ko: "배관공 및 난방 설비 기사" },
  "Ouvriers en électricité du bâtiment": { en: "Building electrical workers", ko: "건축 전기 시공 노동자" },
  "Professionnels de l'action sociale": { en: "Social work professionals", ko: "사회복지 전문가" },
  "Vendeurs en ameublement, équipement du foyer, bricolage": { en: "Furniture, home equipment and DIY sales workers", ko: "가구·생활용품·DIY 판매원" },
  "Employés et professions intermédiaires de l'immobilier": { en: "Real-estate employees and associate professionals", ko: "부동산 사무·중간전문직" },
  "Technico-commerciaux": { en: "Technical sales representatives", ko: "기술 영업 담당자" },
  "Techniciens d'étude et de développement en informatique": { en: "IT analysis and development technicians", ko: "IT 분석·개발 기술자" },
  "Ouvriers qualifiés en menuiserie et en agencement du BTP": { en: "Skilled construction carpentry and fitting workers", ko: "숙련 건설 목공 및 인테리어 시공 노동자" },
  "Couvreurs": { en: "Roofers", ko: "지붕 시공원" },
  "Cadres administratifs, comptables et financiers (hors juristes)": { en: "Administrative, accounting and finance managers", ko: "행정·회계·재무 관리자" },
  "Médecins": { en: "Physicians", ko: "의사" },
  "Ouvriers de la construction en béton": { en: "Concrete construction workers", ko: "콘크리트 건설 노동자" },
  "Magasiniers et préparateurs de commande qualifiés": { en: "Skilled warehouse and order-picking workers", ko: "숙련 창고·주문 처리 직원" },
  "Ouvriers de l'électricité et de l'électronique": { en: "Electrical and electronics workers", ko: "전기·전자 노동자" },
  "Aides médico-psychologiques": { en: "Medical and psychological care assistants", ko: "의료·심리 돌봄 보조원" },
  "Techniciens de production, d'exploitation, d'installation, et de maintenance, support et services aux utilisateurs en informatique": { en: "IT production, operations and user-support technicians", ko: "IT 운영·설치·유지보수 및 사용자 지원 기술자" },
  "Chefs cuisiniers": { en: "Head chefs", ko: "주방장" },
  "Techniciens médicaux et préparateurs": { en: "Medical technicians and preparers", ko: "의료 기술자 및 조제 담당자" },
  "Conducteurs de travaux et chefs de chantier non cadres": { en: "Construction site supervisors", ko: "건설 현장 감독자" },
}

export function sha256(input: Uint8Array | string) {
  return createHash("sha256").update(input).digest("hex")
}

export function normalizeFrench(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toUpperCase()
}

export function slugifyFrench(value: string) {
  return normalizeFrench(value).toLowerCase().replace(/\s+/g, "-")
}

export function parseFrenchNumber(value: string) {
  const normalized = value.replace(/\u00a0/g, " ").replace(/\s/g, "").replace(/%/g, "").replace(",", ".").trim()
  if (!normalized) return null
  const number = Number(normalized)
  return Number.isFinite(number) ? number : null
}

export function parseSemicolonCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let value = ""
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]
    if (char === '"' && quoted && next === '"') { value += '"'; index += 1; continue }
    if (char === '"') { quoted = !quoted; continue }
    if (!quoted && char === ";") { row.push(value.trim()); value = ""; continue }
    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1
      row.push(value.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      value = ""
      continue
    }
    value += char
  }
  row.push(value.trim())
  if (row.some(Boolean)) rows.push(row)
  return rows
}

export function percentile(value: number, population: number[]) {
  if (population.length === 0) return 0
  return Math.round((population.filter((item) => item <= value).length / population.length) * 100)
}
