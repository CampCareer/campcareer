import type { VisaEntry } from "./visa-catalog"

export const BATCH_1_VISA_ENTRIES: readonly VisaEntry[] = [
  {
    country: "Singapore",
    countryCode: "SG",
    name: "Student's Pass",
    kind: "Study",
    note: "Study at an eligible Singapore education institution with an ICA-issued Student's Pass.",
    authority: "Immigration & Checkpoints Authority",
    url: "https://www.ica.gov.sg/reside/STP/apply/ihl",
  },
  {
    country: "Singapore",
    countryCode: "SG",
    name: "Graduate employment-search LTVP",
    kind: "Temporary",
    note: "Long-Term Visit Pass for eligible graduates of listed Singapore institutes of higher learning who are seeking employment.",
    authority: "Immigration & Checkpoints Authority",
    url: "https://www.ica.gov.sg/reside/LTVP/apply",
  },
  {
    country: "Singapore",
    countryCode: "SG",
    name: "Employment Pass",
    kind: "Skilled",
    note: "Employer-sponsored pass for qualifying professionals, managers and executives who meet salary and COMPASS requirements.",
    authority: "Ministry of Manpower",
    url: "https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility",
  },
  {
    country: "Singapore",
    countryCode: "SG",
    name: "S Pass",
    kind: "Work",
    note: "Employer-sponsored pass for qualifying associate professionals and technicians, subject to salary, quota and levy rules.",
    authority: "Ministry of Manpower",
    url: "https://www.mom.gov.sg/passes-and-permits/s-pass/eligibility",
  },
  {
    country: "Singapore",
    countryCode: "SG",
    name: "Training Employment Pass",
    kind: "Work",
    note: "Short, non-renewable professional training attachment for eligible foreign students or overseas-company trainees.",
    authority: "Ministry of Manpower",
    url: "https://www.mom.gov.sg/passes-and-permits/training-employment-pass/eligibility",
  },
  {
    country: "Singapore",
    countryCode: "SG",
    name: "Work Holiday Pass",
    kind: "Working holiday",
    note: "Six- or twelve-month work-and-holiday route for eligible young students and graduates, depending on nationality and programme.",
    authority: "Ministry of Manpower",
    url: "https://www.mom.gov.sg/passes-and-permits/work-holiday-programme/eligibility",
  },
  {
    country: "South Korea",
    countryCode: "KR",
    name: "D-2 Academic Study",
    kind: "Study",
    note: "Degree, exchange or eligible research study at a Korean higher-education institution.",
    authority: "Korea Immigration Service",
    url: "https://studyinkorea.go.kr/ko/plan/visaAndStay.do",
  },
  {
    country: "South Korea",
    countryCode: "KR",
    name: "D-4-1 Korean Language Training",
    kind: "Study",
    note: "Non-degree Korean-language training with an eligible education institution.",
    authority: "Korea Immigration Service",
    url: "https://studyinkorea.go.kr/ko/plan/visaAndStay.do",
  },
  {
    country: "South Korea",
    countryCode: "KR",
    name: "D-10-1 Job Seeker",
    kind: "Temporary",
    note: "Post-study professional job search and qualifying internship activity before changing to an employment status.",
    authority: "Korea Immigration Service",
    url: "https://www.studyinkorea.go.kr/cmm/life/residenceAndStayInfo.do?tab=job-seeker-visa",
  },
  {
    country: "South Korea",
    countryCode: "KR",
    name: "E-7-1 Specific Activities",
    kind: "Skilled",
    note: "Employer-backed professional employment in an occupation permitted under the Specific Activities framework.",
    authority: "Korea Immigration Service",
    url: "https://studyinkorea.go.kr/ko/work/aboutForeignerEmploymentSystem.do",
  },
  {
    country: "South Korea",
    countryCode: "KR",
    name: "H-1 Working Holiday",
    kind: "Working holiday",
    note: "Holiday-first youth mobility route with limited short-term work for eligible partner-country nationals.",
    authority: "Working Holiday Info Center",
    url: "https://whic.mofa.go.kr/contents.do?contentsNo=38",
  },
]

const REPLACED_COUNTRY_CODES = new Set(
  BATCH_1_VISA_ENTRIES.map((visa) => visa.countryCode),
)

export function applyBatch1VisaCatalog(base: readonly VisaEntry[]): readonly VisaEntry[] {
  return [
    ...base.filter((visa) => !REPLACED_COUNTRY_CODES.has(visa.countryCode)),
    ...BATCH_1_VISA_ENTRIES,
  ]
}
