// 제휴(affiliate) 파트너 설정 — URL/브랜드 메타만 보관한다.
// 문구는 i18n(dictionaries)에 두어 로케일별로 번역되도록 한다.
// 새 파트너(OSHC 보험·학생 숙소·eSIM 등)는 여기에 Partner 상수를 추가하면 된다.

export type Partner = {
  id: string
  name: string
  /** 제휴 클릭 URL */
  href: string
  /** 버튼/로고 강조색 (브랜드 컬러) */
  accent: string
  /** accent 위에 올라가는 글자색 */
  accentText: string
}

export const WISE: Partner = {
  id: "wise",
  name: "Wise",
  href: "https://wise.prf.hn/click/camref:1100l5La6z",
  accent: "#9FE870", // Wise bright green
  accentText: "#163300", // Wise forest green
}
