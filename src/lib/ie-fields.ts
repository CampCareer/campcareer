export type IscField = {
  code: string
  nameEn: string
  nameKo: string
}

export type IscNarrowField = IscField & {
  detailed: IscField[]
}

export type IscBroadField = IscField & {
  iscedCode: string
  narrow: IscNarrowField[]
}

const ISCED_BROAD: IscBroadField[] = [
  {
    code: "01", nameEn: "Education", nameKo: "교육",
    iscedCode: "01",
    narrow: [
      {
        code: "011", nameEn: "Education", nameKo: "교육학",
        detailed: [
          { code: "0111", nameEn: "Education science", nameKo: "교육과학" },
          { code: "0112", nameEn: "Training for pre-school teachers", nameKo: "유아교육" },
          { code: "0113", nameEn: "Teacher training without subject specialization", nameKo: "교사양성(일반)" },
          { code: "0114", nameEn: "Teacher training with subject specialization", nameKo: "교사양성(전공)" },
        ]
      }
    ]
  },
  {
    code: "02", nameEn: "Arts and Humanities", nameKo: "인문학",
    iscedCode: "02",
    narrow: [
      {
        code: "021", nameEn: "Arts", nameKo: "예술",
        detailed: [
          { code: "0211", nameEn: "Audio-visual techniques and media production", nameKo: "시청각기술및미디어제작" },
          { code: "0212", nameEn: "Fashion, interior and industrial design", nameKo: "패션·인테리어·산업디자인" },
          { code: "0213", nameEn: "Fine arts", nameKo: "순수예술" },
          { code: "0214", nameEn: "Handicrafts", nameKo: "공예" },
          { code: "0215", nameEn: "Music and performing arts", nameKo: "음악및공연예술" },
        ]
      },
      {
        code: "022", nameEn: "Humanities (except languages)", nameKo: "인문학(언어제외)",
        detailed: [
          { code: "0221", nameEn: "Religion and theology", nameKo: "종교학·신학" },
          { code: "0222", nameEn: "History and archaeology", nameKo: "역사학·고고학" },
          { code: "0223", nameEn: "Philosophy and ethics", nameKo: "철학·윤리학" },
        ]
      },
      {
        code: "023", nameEn: "Languages", nameKo: "언어학",
        detailed: [
          { code: "0231", nameEn: "Language acquisition", nameKo: "언어습득" },
          { code: "0232", nameEn: "Literature and linguistics", nameKo: "문학·언어학" },
        ]
      },
    ]
  },
  {
    code: "03", nameEn: "Social Sciences, Journalism and Information", nameKo: "사회과학·저널리즘·정보학",
    iscedCode: "03",
    narrow: [
      {
        code: "031", nameEn: "Social and behavioural sciences", nameKo: "사회·행동과학",
        detailed: [
          { code: "0311", nameEn: "Economics", nameKo: "경제학" },
          { code: "0312", nameEn: "Political sciences and civics", nameKo: "정치학·시민학" },
          { code: "0313", nameEn: "Psychology", nameKo: "심리학" },
          { code: "0314", nameEn: "Sociology and cultural studies", nameKo: "사회학·문화연구" },
        ]
      },
      {
        code: "032", nameEn: "Journalism and information", nameKo: "저널리즘·정보학",
        detailed: [
          { code: "0321", nameEn: "Journalism and reporting", nameKo: "저널리즘·보도" },
          { code: "0322", nameEn: "Library, information and archival studies", nameKo: "도서관·정보·기록학" },
        ]
      },
    ]
  },
  {
    code: "04", nameEn: "Business, Administration and Law", nameKo: "경영·행정·법학",
    iscedCode: "04",
    narrow: [
      {
        code: "041", nameEn: "Business and administration", nameKo: "경영·행정",
        detailed: [
          { code: "0411", nameEn: "Accounting and taxation", nameKo: "회계·세무" },
          { code: "0412", nameEn: "Finance, banking and insurance", nameKo: "금융·은행·보험" },
          { code: "0413", nameEn: "Management and administration", nameKo: "경영·관리" },
          { code: "0414", nameEn: "Marketing and advertising", nameKo: "마케팅·광고" },
          { code: "0415", nameEn: "Secretarial and office work", nameKo: "비서·사무" },
          { code: "0416", nameEn: "Wholesale and retail sales", nameKo: "도소매·판매" },
          { code: "0417", nameEn: "Work skills", nameKo: "직업기초능력" },
        ]
      },
      {
        code: "042", nameEn: "Law", nameKo: "법학",
        detailed: [
          { code: "0421", nameEn: "Law", nameKo: "법학" },
        ]
      },
    ]
  },
  {
    code: "05", nameEn: "Natural Sciences, Mathematics and Statistics", nameKo: "자연과학·수학·통계학",
    iscedCode: "05",
    narrow: [
      {
        code: "051", nameEn: "Biological and related sciences", nameKo: "생물과학",
        detailed: [
          { code: "0511", nameEn: "Biology", nameKo: "생물학" },
          { code: "0512", nameEn: "Biochemistry", nameKo: "생화학" },
        ]
      },
      {
        code: "052", nameEn: "Environment", nameKo: "환경학",
        detailed: [
          { code: "0521", nameEn: "Environmental sciences", nameKo: "환경과학" },
          { code: "0522", nameEn: "Natural environments and wildlife", nameKo: "자연환경·야생동물" },
        ]
      },
      {
        code: "053", nameEn: "Physical sciences", nameKo: "물리과학",
        detailed: [
          { code: "0531", nameEn: "Chemistry", nameKo: "화학" },
          { code: "0532", nameEn: "Earth sciences", nameKo: "지구과학" },
          { code: "0533", nameEn: "Physics", nameKo: "물리학" },
        ]
      },
      {
        code: "054", nameEn: "Mathematics and statistics", nameKo: "수학·통계학",
        detailed: [
          { code: "0541", nameEn: "Mathematics", nameKo: "수학" },
          { code: "0542", nameEn: "Statistics", nameKo: "통계학" },
        ]
      },
    ]
  },
  {
    code: "06", nameEn: "Information and Communication Technologies", nameKo: "정보통신기술(ICT)",
    iscedCode: "06",
    narrow: [
      {
        code: "061", nameEn: "Information and Communication Technologies", nameKo: "정보통신기술",
        detailed: [
          { code: "0611", nameEn: "Computer use", nameKo: "컴퓨터활용" },
          { code: "0612", nameEn: "Database and network design and administration", nameKo: "데이터베이스·네트워크" },
          { code: "0613", nameEn: "Software and applications development and analysis", nameKo: "소프트웨어·앱개발" },
        ]
      },
    ]
  },
  {
    code: "07", nameEn: "Engineering, Manufacturing and Construction", nameKo: "공학·제조·건설",
    iscedCode: "07",
    narrow: [
      {
        code: "071", nameEn: "Engineering and engineering trades", nameKo: "공학·엔지니어링",
        detailed: [
          { code: "0711", nameEn: "Chemical engineering and processes", nameKo: "화학공학" },
          { code: "0712", nameEn: "Environmental protection technology", nameKo: "환경공학" },
          { code: "0713", nameEn: "Electricity and energy", nameKo: "전기·에너지" },
          { code: "0714", nameEn: "Electronics and automation", nameKo: "전자·자동화" },
          { code: "0715", nameEn: "Mechanics and metal trades", nameKo: "기계·금속" },
          { code: "0716", nameEn: "Motor vehicles, ships and aircraft", nameKo: "자동차·선박·항공기" },
        ]
      },
      {
        code: "072", nameEn: "Manufacturing and processing", nameKo: "제조·가공",
        detailed: [
          { code: "0721", nameEn: "Food processing", nameKo: "식품가공" },
          { code: "0722", nameEn: "Materials (glass, paper, plastic and wood)", nameKo: "재료(유리·종이·플라스틱·목재)" },
          { code: "0723", nameEn: "Textiles (clothes, footwear and leather)", nameKo: "섬유·의류·신발·가죽" },
          { code: "0724", nameEn: "Mining and extraction", nameKo: "광업·채굴" },
        ]
      },
      {
        code: "073", nameEn: "Architecture and construction", nameKo: "건축·건설",
        detailed: [
          { code: "0731", nameEn: "Architecture and town planning", nameKo: "건축·도시계획" },
          { code: "0732", nameEn: "Building and civil engineering", nameKo: "건축공학·토목공학" },
        ]
      },
    ]
  },
  {
    code: "08", nameEn: "Agriculture, Forestry, Fisheries and Veterinary", nameKo: "농업·임업·수산·수의학",
    iscedCode: "08",
    narrow: [
      {
        code: "081", nameEn: "Agriculture", nameKo: "농업",
        detailed: [
          { code: "0811", nameEn: "Crop and livestock production", nameKo: "작물·축산" },
          { code: "0812", nameEn: "Horticulture", nameKo: "원예" },
        ]
      },
      {
        code: "082", nameEn: "Forestry", nameKo: "임업",
        detailed: [
          { code: "0821", nameEn: "Forestry", nameKo: "임업" },
        ]
      },
      {
        code: "083", nameEn: "Fisheries", nameKo: "수산업",
        detailed: [
          { code: "0831", nameEn: "Fisheries", nameKo: "수산업" },
        ]
      },
      {
        code: "084", nameEn: "Veterinary", nameKo: "수의학",
        detailed: [
          { code: "0841", nameEn: "Veterinary", nameKo: "수의학" },
        ]
      },
    ]
  },
  {
    code: "09", nameEn: "Health and Welfare", nameKo: "보건·복지",
    iscedCode: "09",
    narrow: [
      {
        code: "091", nameEn: "Health", nameKo: "보건",
        detailed: [
          { code: "0911", nameEn: "Dental studies", nameKo: "치의학" },
          { code: "0912", nameEn: "Medicine", nameKo: "의학" },
          { code: "0913", nameEn: "Nursing and midwifery", nameKo: "간호·조산" },
          { code: "0914", nameEn: "Medical diagnostic and treatment technology", nameKo: "의료진단·치료기술" },
          { code: "0915", nameEn: "Therapy and rehabilitation", nameKo: "치료·재활" },
          { code: "0916", nameEn: "Pharmacy", nameKo: "약학" },
          { code: "0917", nameEn: "Traditional and complementary medicine and therapy", nameKo: "전통·대체의학" },
        ]
      },
      {
        code: "092", nameEn: "Welfare", nameKo: "복지",
        detailed: [
          { code: "0921", nameEn: "Care of the elderly and of disabled adults", nameKo: "노인·장애인돌봄" },
          { code: "0922", nameEn: "Child care and youth services", nameKo: "아동·청소년복지" },
          { code: "0923", nameEn: "Social work and counselling", nameKo: "사회복지·상담" },
        ]
      },
    ]
  },
  {
    code: "10", nameEn: "Services", nameKo: "서비스",
    iscedCode: "10",
    narrow: [
      {
        code: "101", nameEn: "Personal services", nameKo: "개인서비스",
        detailed: [
          { code: "1011", nameEn: "Domestic services", nameKo: "가사서비스" },
          { code: "1012", nameEn: "Hair and beauty services", nameKo: "미용" },
          { code: "1013", nameEn: "Hotel, restaurants and catering", nameKo: "호텔·외식·케이터링" },
          { code: "1014", nameEn: "Sports", nameKo: "스포츠" },
          { code: "1015", nameEn: "Travel, tourism and leisure", nameKo: "여행·관광·레저" },
        ]
      },
      {
        code: "102", nameEn: "Hygiene and occupational health services", nameKo: "위생·산업보건",
        detailed: [
          { code: "1021", nameEn: "Community sanitation", nameKo: "지역환경위생" },
          { code: "1022", nameEn: "Occupational health and safety", nameKo: "산업안전보건" },
        ]
      },
      {
        code: "103", nameEn: "Security services", nameKo: "보안·안전",
        detailed: [
          { code: "1031", nameEn: "Military and defence", nameKo: "군사·국방" },
          { code: "1032", nameEn: "Protection of persons and property", nameKo: "경호·시설보안" },
        ]
      },
      {
        code: "104", nameEn: "Transport services", nameKo: "운송서비스",
        detailed: [
          { code: "1041", nameEn: "Transport services", nameKo: "운송서비스" },
        ]
      },
    ]
  },
]

export function getIscBroadField(code: string): IscBroadField | undefined {
  return ISCED_BROAD.find(b => b.code === code)
}

export function getIscNarrowField(broadCode: string, narrowCode: string): IscNarrowField | undefined {
  const broad = getIscBroadField(broadCode)
  return broad?.narrow.find(n => n.code === narrowCode)
}

export function getIscDetailedField(broadCode: string, narrowCode: string, detailedCode: string): IscField | undefined {
  const narrow = getIscNarrowField(broadCode, narrowCode)
  return narrow?.detailed.find(d => d.code === detailedCode)
}

export function findIscBroadByHearName(heaName: string): IscBroadField | undefined {
  const norm = heaName.trim().toLowerCase()
  return ISCED_BROAD.find(b =>
    b.nameEn.toLowerCase() === norm || b.nameEn.toLowerCase().replace(/[^a-z]/g, '') === norm.replace(/[^a-z]/g, '')
  )
}

export {
  ISCED_BROAD,
}

/**
 * Maps HEO06 CSV field names to ISCED broad field codes.
 * Usage: heo06ToIscCode("Business, Administration and Law") => "04"
 */
export const HEO06_FIELD_TO_ISCED: Record<string, string> = {
  "Education": "01",
  "Arts and Humanities": "02",
  "Social Sciences, Journalism and Information": "03",
  "Business, Administration and Law": "04",
  "Natural Sciences, Mathematics and Statistics": "05",
  "Information and Communication Technologies": "06",
  "Engineering, Manufacturing and Construction": "07",
  "Agriculture, Forestry, Fisheries and Veterinary": "08",
  "Health and Welfare": "09",
  "Services": "10",
}

export function heo06FieldToIscCode(heaName: string): string | null {
  return HEO06_FIELD_TO_ISCED[heaName.trim()] ?? null
}

export const IE_BROAD_FIELDS: IscField[] = ISCED_BROAD.map(b => ({
  code: b.code,
  nameEn: b.nameEn,
  nameKo: b.nameKo,
}))
