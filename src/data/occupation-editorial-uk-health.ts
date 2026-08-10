import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkHealthOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_HEALTH_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkHealthOccupationEditorialOverride[] = [
  {
    id: "registered-nurse",
    countryCode: "UK",
    editorial: {
      headline: "A statutorily regulated nursing profession with a dedicated Health and Care Worker visa route and persistent workforce gaps",
      entryPathway:
        "Registered Nurse is represented as a roll-up of SOC 2232 to 2237, excluding Midwifery nurses in SOC 2231. UK-trained entrants complete an NMC-approved nursing programme, normally at degree level, or an approved Registered Nurse degree apprenticeship before applying to the NMC register.",
      registration:
        "Registration with the Nursing and Midwifery Council is mandatory before practising as a registered nurse in the UK. Internationally trained nurses must complete the NMC application route and may need qualification evaluation, English-language evidence and the Test of Competence depending on their training route.",
      jobMarketNote:
        "The Health and Care Worker visa explicitly covers registered community, specialist, practitioner, mental-health, children's and other registered nursing professionals. NHS England's Long Term Workforce Plan identifies large and persistent nursing shortfalls and substantial expansion of nurse training as a core workforce priority.",
      scoreCaveat:
        "The broad nursing profile deliberately leaves salary unscored because SOC 2232 to 2237 have materially different ASHE medians and the current read model does not yet hold a weighted national roll-up. Shortage credit reflects the NHS workforce plan, while vacancy intensity and trend remain zero until a recurring comparable vacancy series is ingested.",
    },
  },
  {
    id: "midwife",
    countryCode: "UK",
    editorial: {
      headline: "A regulated maternity profession with NMC-approved education and direct Health and Care Worker visa eligibility",
      entryPathway:
        "Midwife maps to SOC 2231 Midwifery nurses. UK entrants complete an NMC-approved pre-registration midwifery programme; the current Skills England integrated degree apprenticeship is Level 6 and typically takes 48 months.",
      registration:
        "The title Midwife is protected and NMC registration is mandatory. NMC-approved programmes combine academic and clinical learning, while internationally trained applicants follow the NMC overseas registration process and may need additional competence and language evidence.",
      jobMarketNote:
        "SOC 2231 is eligible for the Health and Care Worker visa. NHS England continues to plan expanded nursing and midwifery training capacity, but this profile does not treat training expansion alone as proof of the same shortage intensity seen in the most constrained nursing specialties.",
      scoreCaveat:
        "Midwifery receives moderate shortage credit rather than maximum points because the current official evidence is stronger on workforce planning and training expansion than on an occupation-specific recurring vacancy series. Visa credit is kept separate from shortage scoring.",
    },
  },
  {
    id: "care-worker",
    countryCode: "UK",
    editorial: {
      headline: "A large Level 2 care occupation with persistent vacancies but no new overseas sponsorship route since July 2025",
      entryPathway:
        "Care Worker maps to SOC 6135 Care workers and home carers. In England, the Level 2 Adult Care Worker apprenticeship is approved for delivery and provides a structured frontline route across residential, domiciliary and community care settings.",
      registration:
        "There is no single UK-wide statutory Care Worker professional register equivalent to the NMC or HCPC. Employers and care services can require role-specific induction, safeguarding checks, regulated-service requirements and mandatory training.",
      jobMarketNote:
        "Skills for Care reports that England's adult social care vacancy rate fell to 6.2% in 2025/26, around 96,000 vacancies, but remained roughly three times the wider-economy rate. From 22 July 2025, new overseas Health and Care Worker visa applications for care workers closed; limited in-country and transitional routes remain.",
      scoreCaveat:
        "Care Worker receives strong shortage credit from current adult-social-care vacancy evidence but only limited visa credit because overseas recruitment is closed to new entrants. The score therefore does not confuse persistent domestic recruitment need with international visa accessibility.",
    },
  },
  {
    id: "physiotherapist",
    countryCode: "UK",
    editorial: {
      headline: "A regulated allied-health profession with HCPC registration, degree-level entry and direct Health and Care Worker visa eligibility",
      entryPathway:
        "Physiotherapist maps directly to SOC 2221. UK entry requires an HCPC-approved physiotherapy qualification; in England, the current Level 6 Physiotherapist apprenticeship is approved for delivery and typically takes 48 months.",
      registration:
        "Registration with the Health and Care Professions Council is mandatory to use the protected title Physiotherapist. International applicants must demonstrate that their education, training and experience meet the HCPC standards of proficiency and current English-language requirements.",
      jobMarketNote:
        "SOC 2221 is explicitly eligible for the Health and Care Worker visa. NHS England plans continued expansion of allied-health training, although its strongest projected AHP shortfalls are concentrated in other professions such as occupational therapy and diagnostic radiography.",
      scoreCaveat:
        "No strong occupation-specific shortage points are inferred from the broader AHP expansion plan. Visa accessibility is scored fully, while vacancy intensity, employer diversity, trend and growth remain unscored pending direct recurring evidence.",
    },
  },
  {
    id: "medical-laboratory-technician",
    countryCode: "UK",
    editorial: {
      headline: "A Level 3 laboratory technician pathway with current visa access but weak current shortage evidence",
      entryPathway:
        "Medical Laboratory Technician is scoped within SOC 3111 Laboratory technicians. Skills England's Level 3 Laboratory Technician apprenticeship is approved for delivery and provides a broad scientific-laboratory route; this profile does not equate the technician role with the separately regulated Biomedical Scientist profession.",
      registration:
        "The generic Laboratory Technician occupation is not a statutorily regulated HCPC profession. Professional recognition such as Registered Science Technician can be pursued separately, while Biomedical Scientist roles have different education and HCPC registration requirements and are outside this canonical profile.",
      jobMarketNote:
        "SOC 3111 is currently eligible for the Health and Care Worker route and remains on the Temporary Shortage List; the Immigration Salary List separately restricts its concession to jobs requiring at least three years of related experience. The July 2026 MAC review found limited historical and future shortage evidence and recommended no future TSL access.",
      scoreCaveat:
        "Current visa access and shortage evidence are deliberately separated. Laboratory Technician receives current visa credit but zero shortage points because the latest MAC review failed the occupation on the shortage test.",
    },
  },
  {
    id: "radiographer",
    countryCode: "UK",
    editorial: {
      headline: "A regulated imaging profession with direct Health and Care Worker visa access and strong projected NHS workforce need",
      entryPathway:
        "Radiographer maps to SOC 2254 Medical radiographers and covers diagnostic and therapeutic radiography. HCPC-approved degree routes are required; Skills England currently lists both Level 6 Diagnostic Radiographer and Therapeutic Radiographer apprenticeships approved for delivery.",
      registration:
        "Registration with the Health and Care Professions Council is mandatory to practise under the protected radiographer titles. International applicants follow the HCPC international route and must map their education, training and experience to the relevant standards of proficiency.",
      jobMarketNote:
        "SOC 2254 is explicitly eligible for the Health and Care Worker visa. NHS England's Long Term Workforce Plan identifies diagnostic radiography among the allied-health professions with the greatest projected shortfalls and calls for expanded diagnostic and therapeutic radiography training.",
      scoreCaveat:
        "Shortage credit reflects the explicit long-term workforce shortfall signal, not a fabricated vacancy count. Current Health and Care Worker eligibility receives full visa credit; vacancy intensity and trend remain unscored until direct recurring data are available.",
    },
  },
  {
    id: "pharmacist",
    countryCode: "UK",
    editorial: {
      headline: "A regulated pharmacy profession with Health and Care Worker eligibility and substantial planned training expansion",
      entryPathway:
        "Pharmacist maps directly to SOC 2251. In Great Britain, the standard route begins with a GPhC-accredited MPharm, usually four years, followed by foundation training and the registration assessment. Internationally qualified pharmacists may use the applicable overseas registration route, including OSPAP where required.",
      registration:
        "Pharmacists must be registered with the relevant statutory regulator: the General Pharmaceutical Council in Great Britain or the Pharmaceutical Society of Northern Ireland in Northern Ireland. Education and registration requirements differ for UK-trained and internationally qualified applicants.",
      jobMarketNote:
        "SOC 2251 is explicitly eligible for the Health and Care Worker visa. NHS England's Long Term Workforce Plan estimates pharmacist education intake needs to grow materially to meet future demand and plans expansion beginning in 2026/27.",
      scoreCaveat:
        "The shortage component reflects the official workforce plan's large required training expansion rather than current shortage-list membership. Salary uses the existing ONS ASHE national median; vacancy and employer-diversity components remain zero pending recurring direct data.",
    },
  },
  {
    id: "occupational-therapist",
    countryCode: "UK",
    editorial: {
      headline: "A regulated allied-health profession with direct Health and Care Worker access and one of the larger projected AHP shortfalls",
      entryPathway:
        "Occupational Therapist maps directly to SOC 2222. Entry requires an HCPC-approved occupational therapy qualification; in England, the current Level 6 Occupational Therapist apprenticeship is approved for delivery and typically takes 48 months.",
      registration:
        "Registration with the Health and Care Professions Council is mandatory to use the protected title Occupational Therapist. International applicants must satisfy the HCPC international application process, including standards-of-proficiency mapping and applicable English-language requirements.",
      jobMarketNote:
        "SOC 2222 is explicitly eligible for the Health and Care Worker visa. NHS England identifies occupational therapy among the allied-health professions with the greatest projected workforce shortfalls and plans expansion in occupational-therapy training places.",
      scoreCaveat:
        "Shortage credit reflects explicit NHS workforce-planning evidence, while current Health and Care Worker eligibility is scored separately. No synthetic vacancy intensity or growth score is added until direct comparable series are ingested.",
    },
  },
]
