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
