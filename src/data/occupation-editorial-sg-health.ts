import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeHealthOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_HEALTH_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeHealthOccupationEditorialOverride[] = [
  {
    id: "registered-nurse",
    countryCode: "SG",
    editorial: {
      headline: "A directly classified and professionally regulated Registered Nurse occupation under SSOC 22200 and the Singapore Nursing Board",
      entryPathway:
        "SSOC 2024 places registered nurses within 22200 Registered nurse and related nursing professional (excluding enrolled nurse). CampCareer restricts this profile to the Registered Nurse scope. The direct route is an accredited nursing qualification followed by Singapore Nursing Board registration and a valid Practising Certificate. Three reviewed Singapore nursing programmes are retained as direct study pathways.",
      registration:
        "Registration with the Singapore Nursing Board is mandatory. Under the Nurses and Midwives Act, a person must be registered or enrolled with SNB as applicable and possess a valid Practising Certificate before practising nursing in Singapore.",
      jobMarketNote:
        "The classification and registration evidence provide a strong occupation foundation, but CampCareer has not yet normalised an exact recurring shortage, vacancy, salary or growth series for the common cross-country score.",
      scoreCaveat:
        "SG v1 scores the professional entry route and high regulatory burden only. Market-demand and occupation-specific visa components remain unscored until the common enrichment phase.",
    },
  },
  {
    id: "midwife",
    countryCode: "SG",
    editorial: {
      headline: "A regulated Registered Midwife profession without a standalone five-digit SSOC 2024 occupation",
      entryPathway:
        "SSOC 2024 does not publish a separate five-digit Midwife occupation in its classification structure. CampCareer therefore leaves the primary code null and uses 22200 only as a non-rollup nursing-professional reference. Singapore Nursing Board lists the local midwifery route as post-registration training for Registered Nurses, including the Advanced Diploma in Nursing (Midwifery), followed by application for Registered Midwife registration.",
      registration:
        "Registration as a Registered Midwife with the Singapore Nursing Board and a valid Practising Certificate are mandatory before practising midwifery. The midwifery registration is distinct from ordinary Registered Nurse registration even though the local training pathway builds on nursing registration.",
      jobMarketNote:
        "Because there is no standalone SSOC five-digit Midwife code, CampCareer does not treat the wider 22200 nursing group as an exact midwife labour-market series.",
      scoreCaveat:
        "The foundation score reflects the post-registration training path and statutory registration burden only. Market and visa evidence remains unscored.",
    },
  },
  {
    id: "care-worker",
    countryCode: "SG",
    editorial: {
      headline: "A broad personal-care occupation spanning healthcare assistants, nursing aides and other related care workers",
      entryPathway:
        "The CampCareer Care Worker scope does not have one exact SSOC code. Relevant five-digit classifications include 53201 Healthcare assistant, 53202 Nursing aide/assistant and 53209 Healthcare assistant and related personal care worker n.e.c. Entry is commonly through employer training, caregiving or healthcare-support study and supervised workplace experience.",
      registration:
        "There is no single statutory professional registration scheme for the broad Care Worker occupation. Employers and care settings can impose their own training, competency, screening and delegated-care requirements, but these are not a universal occupational licence.",
      jobMarketNote:
        "Five reviewed Singapore nursing and social-work programmes are retained as related educational context only. The healthcare-assistant and nursing-aide classifications remain separate rather than being combined into a fabricated exact market series.",
      scoreCaveat:
        "SG v1 credits accessible practical entry and low universal licensing burden only. Shortage, vacancies, earnings, growth and visa remain unscored.",
    },
  },
  {
    id: "physiotherapist",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 22640 allied-health profession requiring AHPC registration and a valid Practising Certificate",
      entryPathway:
        "Physiotherapist maps directly to SSOC 22640. The professional route requires a recognised entry-to-practice physiotherapy qualification and registration with the Allied Health Professions Council. One reviewed Singapore Physiotherapy programme is retained as a direct study pathway.",
      registration:
        "Physiotherapists are regulated under the Allied Health Professions Act. AHPC states that a physiotherapist must be registered with the Council and hold a valid Practising Certificate before practising in Singapore; foreign-trained applicants can also face recognised-qualification, employment, English-language and qualifying-examination requirements.",
      jobMarketNote:
        "The direct classification and registration boundary are established, but exact comparable labour-market components have not yet been added to SG v1.",
      scoreCaveat:
        "Only entry and regulatory burden are scored now. Registration evidence is not converted into shortage or demand points.",
    },
  },
  {
    id: "medical-laboratory-technician",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 32120 laboratory-technician occupation kept separate from professional-level medical laboratory scientists",
      entryPathway:
        "Medical Laboratory Technician maps directly to SSOC 32120 Medical/Pathology laboratory technician. SSOC separately classifies the professional-level Medical laboratory scientist at 21342, so CampCareer does not merge the two levels. Relevant laboratory or biomedical-science technician education plus supervised laboratory competency is the clearest entry route.",
      registration:
        "Medical Laboratory Technician is not among the healthcare professions currently regulated by the statutory Professional Boards listed by Singapore's Ministry of Health. Laboratories and employers can still require relevant qualifications, biosafety competence, quality-system training and role-specific authorisation.",
      jobMarketNote:
        "There is currently no approved Singapore programme link attached to this canonical technician profile. Technician and scientist classifications remain separate and no exact market series is scored yet.",
      scoreCaveat:
        "SG v1 recognises a structured technical education route and no universal statutory registration. Market and visa components remain zero until later enrichment.",
    },
  },
  {
    id: "radiographer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 22693 Diagnostic Radiographer profession regulated by the Allied Health Professions Council",
      entryPathway:
        "Radiographer maps directly to SSOC 22693 Diagnostic radiographer. SSOC 22694 Radiation therapist is a separate profession and is not rolled into the canonical Radiographer classification. A recognised diagnostic-radiography qualification followed by AHPC registration is the direct route.",
      registration:
        "Diagnostic Radiographers are regulated under the Allied Health Professions Act and must be registered with AHPC and hold a valid Practising Certificate before practising in Singapore.",
      jobMarketNote:
        "Two staging programmes are approved as common pathways and are therefore retained conservatively as related links, including the separate Radiation Therapy programme. Programme proximity does not collapse the two regulated professions into one occupation.",
      scoreCaveat:
        "The score covers entry and regulatory burden only. Diagnostic radiography and radiation therapy remain separate for future market enrichment.",
    },
  },
  {
    id: "pharmacist",
    countryCode: "SG",
    editorial: {
      headline: "A patient-care Pharmacist scope mapped to SSOC 22621 with mandatory Singapore Pharmacy Council registration",
      entryPathway:
        "CampCareer's patient-facing Pharmacist scope maps to SSOC 22621 Pharmacist (patient care), while residual pharmacist work remains under 22629 and is not automatically included. The route starts with an SPC-recognised pharmacy degree and the prescribed practical experience and registration process. One reviewed Singapore Pharmacy programme is retained as direct.",
      registration:
        "Registration with the Singapore Pharmacy Council is mandatory to practise as a pharmacist. A pharmacy degree alone does not confer unrestricted practice; local and foreign-trained routes include the applicable practical experience, examinations, conditional registration and other SPC requirements.",
      jobMarketNote:
        "The foundation intentionally keeps patient-care pharmacy separate from residual pharmacist scopes rather than combining them into unsupported exact labour-market observations.",
      scoreCaveat:
        "SG v1 scores the long professional pathway and statutory registration burden only. Shortage, salary, vacancy, growth and visa remain unscored.",
    },
  },
  {
    id: "occupational-therapist",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 22680 Occupational Therapist profession requiring AHPC registration",
      entryPathway:
        "Occupational Therapist maps directly to SSOC 22680. The direct route is a recognised occupational-therapy qualification followed by Allied Health Professions Council registration. One reviewed Singapore Occupational Therapy programme is retained as a direct study pathway.",
      registration:
        "Occupational Therapists are regulated under the Allied Health Professions Act and must be registered with AHPC and hold a valid Practising Certificate before practising in Singapore.",
      jobMarketNote:
        "The occupation and registration boundary are direct, but exact comparable shortage, vacancy, salary and growth signals are deferred to the common market-data phase.",
      scoreCaveat:
        "The provisional score reflects professional entry and regulatory burden only. Market and visa components remain unscored.",
    },
  },
]
