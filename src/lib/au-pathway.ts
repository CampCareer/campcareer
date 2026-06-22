import type { StateCode } from "@/app/map/states"

// 직업 → 교육 경로 판별 및 주(state)별 공식 링크.
// 학위(대학) vs 자격증(VET/TAFE)은 ANZSCO 대분류(첫 자리)로 가른다:
//   1 관리자 · 2 전문직 → degree (대학 학위)
//   3 기능공 · 4 서비스 · 5~8 → vet (TAFE·도제 등 직업훈련)
// 데이터 없이 anzsco_code만으로 동작한다.

export type Pathway = "degree" | "vet"

export function getPathway(anzscoCode: string | null | undefined): Pathway {
  const major = anzscoCode?.trim().charAt(0)
  return major === "1" || major === "2" ? "degree" : "vet"
}

export interface OfficialLink {
  name: string
  url: string
}

// 주별 공식 TAFE / 직업훈련 기관. (VET 직업의 1차 공식 링크)
export const TAFE_BY_STATE: Record<StateCode, OfficialLink> = {
  NSW: { name: "TAFE NSW", url: "https://www.tafensw.edu.au/" },
  VIC: { name: "Victorian Skills Gateway", url: "https://www.skills.vic.gov.au/" },
  QLD: { name: "TAFE Queensland", url: "https://tafeqld.edu.au/" },
  SA: { name: "TAFE SA", url: "https://www.tafesa.edu.au/" },
  WA: { name: "Jobs and Skills WA", url: "https://www.jobsandskills.wa.gov.au/" },
  TAS: { name: "TasTAFE", url: "https://www.tastafe.tas.edu.au/" },
  NT: {
    name: "Charles Darwin University (VET)",
    url: "https://www.cdu.edu.au/study/vocational-education-training",
  },
  ACT: { name: "Canberra Institute of Technology (CIT)", url: "https://cit.edu.au/" },
}

// 국가 공식 VET 검색/등록 포털. (주 구분은 포털 내 필터로)
export const VET_PORTALS: OfficialLink[] = [
  { name: "My Skills", url: "https://www.myskills.gov.au/" },
  { name: "training.gov.au", url: "https://training.gov.au/" },
  { name: "Australian Apprenticeships", url: "https://www.apprenticeships.gov.au/" },
]

// 학위 폴백: 우리 DB에 그 주 등록 대학이 없을 때 CRICOS 공식 등록부 검색으로 보낸다.
// (개별 코스는 courses_au.cricos_url 로 정확 링크가 이미 존재한다.)
export function cricosSearchUrl(): string {
  return "https://cricos.education.gov.au/"
}
