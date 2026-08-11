import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UsHealthOccupationEditorialOverride = {
  id: string
  countryCode: "US"
  editorial: CountryOccupationEditorial
}

export const US_HEALTH_OCCUPATION_EDITORIAL_OVERRIDES: readonly UsHealthOccupationEditorialOverride[] = [
  {
    id: "registered-nurse",
    countryCode: "US",
    editorial: {
      headline: "A very large licensed profession with direct Schedule A labor-certification treatment and steady national demand",
      entryPathway:
        "Registered Nurse maps to SOC 2018 29-1141. BLS recognizes bachelor, associate and approved diploma nursing pathways, followed by state licensure and the applicable NCLEX-RN requirements.",
      registration:
        "Registered nurses must be licensed. Licensure is state-based rather than federal, so applicants must satisfy the board-of-nursing requirements in the state of intended practice.",
      jobMarketNote:
        "BLS reports 3,391,000 registered-nurse jobs in 2024, a May 2024 median annual wage of $93,600, and 5% projected employment growth for 2024–2034.",
      scoreCaveat:
        "Professional nurses are explicitly covered by Schedule A Group I when the regulatory qualifications are met. That is treated as a formal labor-certification shortage pathway, not as a blanket guarantee of visa issuance or state licensure.",
    },
  },
  {
    id: "midwife",
    countryCode: "US",
    editorial: {
      headline: "A high-pay advanced-practice nursing profession with strong projected growth and state-based practice authority",
      entryPathway:
        "Midwife maps to SOC 2018 29-1161 Nurse Midwives. BLS treats nurse midwives as advanced practice registered nurses and describes graduate-level education, RN licensure, national certification and state APRN authorization as the normal pathway.",
      registration:
        "Nurse-midwife practice is regulated at state level. The role requires registered-nurse licensure plus the applicable advanced-practice authority and certification requirements in the state of practice.",
      jobMarketNote:
        "BLS reports 8,600 nurse-midwife jobs in 2024, a May 2024 median annual wage of $128,790, and 11% projected growth for 2024–2034.",
      scoreCaveat:
        "Strong growth is scored directly but is not converted into a separate national shortage designation. Professional immigration routes remain job- and employer-specific unless the filing independently meets a defined federal pathway.",
    },
  },
  {
    id: "care-worker",
    countryCode: "US",
    editorial: {
      headline: "The largest health-support occupation in the cohort, with very high projected growth but limited professional-visa fit",
      entryPathway:
        "Care Worker is mapped to SOC 2018 31-1120 Home Health and Personal Care Aides. BLS says a high school diploma is typical although some jobs require no formal educational credential; certified home-health or hospice settings may require formal training and a standardized test.",
      registration:
        "There is no single nationwide personal-care-aide licence. Certification or training rules depend on the state, employer and whether the worker is employed by a certified home-health or hospice agency.",
      jobMarketNote:
        "BLS reports 4,347,700 home health and personal care aide jobs in 2024, a May 2024 median annual wage of $34,900, and 17% projected growth for 2024–2034.",
      scoreCaveat:
        "The 17% growth rate is a demand indicator, not a federal shortage-occupation designation. The role generally does not fit the degree-specific H-1B model, so immigration credit is deliberately limited.",
    },
  },
  {
    id: "physiotherapist",
    countryCode: "US",
    editorial: {
      headline: "A doctoral-entry licensed profession with very strong growth and direct Schedule A treatment",
      entryPathway:
        "Physiotherapist maps to the U.S. title Physical Therapist, SOC 2018 29-1123. BLS says entrants need a Doctor of Physical Therapy degree and must meet state licensure requirements.",
      registration:
        "All states require physical therapists to be licensed. The exact examination, education and endorsement requirements are administered by the state of intended practice.",
      jobMarketNote:
        "BLS reports 267,200 physical-therapist jobs in 2024, a May 2024 median annual wage of $101,020, and 11% projected employment growth for 2024–2034.",
      scoreCaveat:
        "Physical therapists are explicitly listed in Schedule A Group I when the worker has the qualifications necessary for the licensing examination in the intended state. This earns targeted labor-certification credit but does not remove licensing or other immigration requirements.",
    },
  },
  {
    id: "medical-laboratory-technician",
    countryCode: "US",
    editorial: {
      headline: "A laboratory diagnostic pathway with moderate pay, limited net growth and state-dependent licensing",
      entryPathway:
        "Medical Laboratory Technician is constrained to the technician side of SOC 2018 29-2010 Clinical Laboratory Technologists and Technicians. BLS notes technicians may qualify with an associate degree even though the combined occupation typically lists bachelor-level entry.",
      registration:
        "There is no single nationwide licence. BLS states that some states require clinical laboratory technologists and technicians to be licensed; employer certification requirements may also apply.",
      jobMarketNote:
        "BLS reports 351,200 jobs for the combined clinical-laboratory technologist/technician occupation in 2024, a May 2024 median annual wage of $61,890, and 2% projected growth for 2024–2034.",
      scoreCaveat:
        "Employment and wage figures are the published combined 29-2010 BLS series, so they must not be presented as technician-only counts. No Schedule A shortage credit is borrowed from nursing or physical therapy.",
    },
  },
  {
    id: "radiographer",
    countryCode: "US",
    editorial: {
      headline: "An associate-degree imaging profession with above-median pay and licensing or certification in most states",
      entryPathway:
        "Radiographer maps to SOC 2018 29-2034 Radiologic Technologists and Technicians, excluding MRI technologists. BLS says an associate degree is typical.",
      registration:
        "BLS states that most states require radiologic technologists to be licensed or certified. Because requirements are not universal nationwide, the profile records a state-level rather than federal credential boundary.",
      jobMarketNote:
        "BLS reports 228,000 radiologic technologist and technician jobs in 2024, a May 2024 median annual wage of $77,660, and 4% projected employment growth for 2024–2034.",
      scoreCaveat:
        "The profile excludes MRI technologists under SOC 29-2035. State credential requirements and any employer certification remain separate from immigration eligibility.",
    },
  },
  {
    id: "pharmacist",
    countryCode: "US",
    editorial: {
      headline: "A high-pay doctoral-entry profession with universal state licensure and moderate projected growth",
      entryPathway:
        "Pharmacist maps to SOC 2018 29-1051. BLS says pharmacists typically need a Doctor of Pharmacy degree and must complete the licensing requirements for the state in which they practice.",
      registration:
        "Every state requires pharmacists to be licensed. Licensure is administered by state pharmacy boards and normally includes education, examination and jurisdiction-specific requirements.",
      jobMarketNote:
        "BLS reports 335,100 pharmacist jobs in 2024, a May 2024 median annual wage of $137,480, and 5% projected growth for 2024–2034.",
      scoreCaveat:
        "High salary does not create shortage status. H-1B or permanent employer sponsorship may be possible only when the specific position and filing independently satisfy the applicable federal requirements.",
    },
  },
  {
    id: "occupational-therapist",
    countryCode: "US",
    editorial: {
      headline: "A licensed graduate-entry therapy profession with strong double-digit national growth",
      entryPathway:
        "Occupational Therapist maps to SOC 2018 29-1122. BLS says occupational therapists typically need a master's degree in occupational therapy.",
      registration:
        "All states require occupational therapists to be licensed. Exact education, examination and renewal requirements are state-based.",
      jobMarketNote:
        "BLS reports 160,000 occupational-therapist jobs in 2024, a May 2024 median annual wage of $98,340, and 14% projected employment growth for 2024–2034.",
      scoreCaveat:
        "The 14% projection receives the maximum U.S. v1 growth component but is not relabeled as a national shortage. Immigration access remains employer- and job-specific rather than occupation-targeted.",
    },
  },
]
