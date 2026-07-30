export type RouteLocale = "en" | "ko"

export type LocalizedText = Record<RouteLocale, string>

export type RouteSourceType =
  | "official-government"
  | "government-job-board"
  | "training-register"
  | "education-provider"
  | "professional-regulator"
  | "job-board"
  | "employer"
  | "map-evidence"

export type RouteLinkType = "visa" | "course" | "job" | "employer" | "map"

export type RouteGoal = "work" | "study" | "study-to-work"

export type RoutePublicationStatus = "published" | "research_required"
export type RouteAvailabilityStatus = "conditional" | "needs_confirmation" | "unverified"

export type RouteSource = {
  name: string
  operator: string
  sourceType: RouteSourceType
  url: string
  checkedAt: string
}

export type RouteLink = {
  label: LocalizedText
  detail: LocalizedText
  url: string
  linkType: RouteLinkType
  relevance: LocalizedText
  source: RouteSource
}

export type RouteGuide = {
  id: string
  /** Canonical user intent from the destination taxonomy, when one exists. */
  candidateId?: string
  origin: { code: string; slug: string; name: LocalizedText }
  destination: { code: string; slug: string; name: LocalizedText }
  slug: string
  target: LocalizedText
  goals: readonly RouteGoal[]
  searchTerms: readonly string[]
  title: LocalizedText
  summary: LocalizedText
  lastVerified: string
  publication: {
    status: RoutePublicationStatus
    gates: {
      visa: boolean
      preparation: boolean
      jobs: boolean
      courses: boolean
      map: boolean
    }
  }
  availability: {
    status: RouteAvailabilityStatus
    label: LocalizedText
    summary: LocalizedText
    source: RouteSource
  }
  visa: {
    name: string
    summary: LocalizedText
    eligibility: LocalizedText[]
    workConditions: LocalizedText[]
    sources: RouteSource[]
  }
  preparation: Array<{
    title: LocalizedText
    detail: LocalizedText
    source?: RouteSource
  }>
  jobs: RouteLink[]
  courses: RouteLink[]
  employers: RouteLink[]
  map: {
    label: LocalizedText
    detail: LocalizedText
    href: string
    source: RouteSource
    signals: Array<{
      region: LocalizedText
      detail: LocalizedText
      readiness: "ready" | "partial" | "research_required"
      source: RouteSource
    }>
  }
  sources: RouteSource[]
}

const homeAffairsOverview: RouteSource = {
  name: "Working Holiday Maker program overview",
  operator: "Australian Department of Home Affairs",
  sourceType: "official-government",
  url: "https://immi.homeaffairs.gov.au/what-we-do/whm-program/overview",
  checkedAt: "2026-07-29",
}

const homeAffairsConditions: RouteSource = {
  name: "Working Holiday Maker work conditions",
  operator: "Australian Department of Home Affairs",
  sourceType: "official-government",
  url: "https://immi.homeaffairs.gov.au/what-we-do/whm-program/specified-work-conditions",
  checkedAt: "2026-07-29",
}

const homeAffairsKoreaUpdate: RouteSource = {
  name: "Working Holiday Maker latest news",
  operator: "Australian Department of Home Affairs",
  sourceType: "official-government",
  url: "https://immi.homeaffairs.gov.au/what-we-do/whm-program/latest-news",
  checkedAt: "2026-07-29",
}

const homeAffairsSpecified417: RouteSource = {
  name: "Specified work for subclass 417",
  operator: "Australian Department of Home Affairs",
  sourceType: "official-government",
  url: "https://immi.homeaffairs.gov.au/what-we-do/whm-program/specified-work-conditions/specified-work-417",
  checkedAt: "2026-07-29",
}

const trainingGovRii20120: RouteSource = {
  name: "RII20120 Certificate II in Resources and Infrastructure Work Preparation",
  operator: "National Training Register (training.gov.au)",
  sourceType: "training-register",
  url: "https://training.gov.au/training/details/RII20120/qualdetails",
  checkedAt: "2026-07-29",
}

const workforceAustralia: RouteSource = {
  name: "Find a job",
  operator: "Workforce Australia",
  sourceType: "government-job-board",
  url: "https://www.workforceaustralia.gov.au/individuals/jobs/search",
  checkedAt: "2026-07-29",
}

const seekMiningWa: RouteSource = {
  name: "Mining jobs in Western Australia",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/mining-jobs/in-Western-Australia-WA",
  checkedAt: "2026-07-29",
}

const seekEntryMiningWa: RouteSource = {
  name: "Entry-level mining jobs in Western Australia",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/entry-level-mining-jobs/in-Western-Australia-WA",
  checkedAt: "2026-07-29",
}

const bhpPilbara: RouteSource = {
  name: "Western Australia Iron Ore operations",
  operator: "BHP",
  sourceType: "employer",
  url: "https://www.bhp.com/what-we-do/global-locations/australia/western-australia",
  checkedAt: "2026-07-29",
}

const rioPilbara: RouteSource = {
  name: "Careers",
  operator: "Rio Tinto",
  sourceType: "employer",
  url: "https://jobs.riotinto.com/",
  checkedAt: "2026-07-29",
}

const waPilbaraMapEvidence: RouteSource = {
  name: "Pilbara Development Commission",
  operator: "Government of Western Australia",
  sourceType: "map-evidence",
  url: "https://www.wa.gov.au/organisation/pilbara-development-commission",
  checkedAt: "2026-07-29",
}

const homeAffairsStudent500: RouteSource = {
  name: "Student visa (subclass 500)",
  operator: "Australian Department of Home Affairs",
  sourceType: "official-government",
  url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
  checkedAt: "2026-07-29",
}

const homeAffairsGraduate485: RouteSource = {
  name: "Temporary Graduate visa (subclass 485) — Post-Higher Education Work stream",
  operator: "Australian Department of Home Affairs",
  sourceType: "official-government",
  url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485/post-higher-education-work",
  checkedAt: "2026-07-29",
}

const jobsSkillsShortage: RouteSource = {
  name: "Occupation Shortage List",
  operator: "Jobs and Skills Australia",
  sourceType: "map-evidence",
  url: "https://www.jobsandskills.gov.au/data/occupation-shortage/occupation-shortage-list",
  checkedAt: "2026-07-29",
}

const ahpraNursingStandards: RouteSource = {
  name: "Nursing and Midwifery Board registration standards",
  operator: "Australian Health Practitioner Regulation Agency",
  sourceType: "professional-regulator",
  url: "https://www.ahpra.gov.au/sitecore/content/Nursing/Registration-Standards.aspx",
  checkedAt: "2026-07-29",
}

const nmbaApprovedPrograms: RouteSource = {
  name: "Nursing and Midwifery Board approved programs of study",
  operator: "Nursing and Midwifery Board of Australia",
  sourceType: "professional-regulator",
  url: "https://www.nursingmidwiferyboard.gov.au/sitecore/content/Home/Accreditation/Approved-Programs-of-Study.aspx",
  checkedAt: "2026-07-29",
}

const acecqaQualified: RouteSource = {
  name: "Are you qualified?",
  operator: "Australian Children’s Education and Care Quality Authority",
  sourceType: "professional-regulator",
  url: "https://www.acecqa.gov.au/qualifications-0/are-you-qualified",
  checkedAt: "2026-07-29",
}

const monashNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "Monash University",
  sourceType: "education-provider",
  url: "https://www.monash.edu/study/courses/find-a-course/nursing-m2006",
  checkedAt: "2026-07-18",
}
const qutNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "Queensland University of Technology",
  sourceType: "education-provider",
  url: "https://www.qut.edu.au/courses/bachelor-of-nursing",
  checkedAt: "2026-07-30",
};

const uniscNursing: RouteSource = {
  name: "Bachelor of Nursing Science",
  operator: "University of the Sunshine Coast",
  sourceType: "education-provider",
  url: "https://www.unisc.edu.au/study/courses-and-programs/bachelor-degrees-undergraduate-programs/bachelor-of-nursing-science",
  checkedAt: "2026-07-30",
};

const uniscNursingGrad: RouteSource = {
  name: "Bachelor of Nursing Science (Graduate Entry)",
  operator: "University of the Sunshine Coast",
  sourceType: "education-provider",
  url: "https://www.unisc.edu.au/study/courses-and-programs/bachelor-degrees-undergraduate-programs/bachelor-of-nursing-science-graduate-entry",
  checkedAt: "2026-07-30",
};

const deakinNursing: RouteSource = {
  name: "Bachelor of Nursing (International)",
  operator: "Deakin University",
  sourceType: "education-provider",
  url: "https://www.deakin.edu.au/course/bachelor-nursing-international",
  checkedAt: "2026-07-30",
};

const rmitNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-nursing-bp032",
  checkedAt: "2026-07-30",
};

const westernSydneyNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "Western Sydney University",
  sourceType: "education-provider",
  url: "https://www.westernsydney.edu.au/future/study/courses/undergraduate/bachelor-of-nursing",
  checkedAt: "2026-07-30",
};

const flindersNursing: RouteSource = {
  name: "Bachelor of Nursing (Preregistration)",
  operator: "Flinders University",
  sourceType: "education-provider",
  url: "https://www.flinders.edu.au/study/courses/bachelor-nursing-preregistration",
  checkedAt: "2026-07-30",
};

const flindersNursingGrad: RouteSource = {
  name: "Bachelor of Nursing (Graduate Entry)",
  operator: "Flinders University",
  sourceType: "education-provider",
  url: "https://www.flinders.edu.au/study/courses/bachelor-nursing-graduate-entry",
  checkedAt: "2026-07-30",
};

const ecuNursing: RouteSource = {
  name: "Bachelor of Science (Nursing)",
  operator: "Edith Cowan University",
  sourceType: "education-provider",
  url: "https://www.ecu.edu.au/degrees/courses/bachelor-of-science-nursing",
  checkedAt: "2026-07-30",
};

const ecuNursingGrad: RouteSource = {
  name: "Master of Nursing (Graduate Entry)",
  operator: "Edith Cowan University",
  sourceType: "education-provider",
  url: "https://www.ecu.edu.au/degrees/courses/master-of-nursing-graduate-entry",
  checkedAt: "2026-07-30",
};

const utasNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "University of Tasmania",
  sourceType: "education-provider",
  url: "https://www.utas.edu.au/courses/health/courses/h3o-bachelor-of-nursing",
  checkedAt: "2026-07-30",
};

const cduNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "Charles Darwin University",
  sourceType: "education-provider",
  url: "https://www.cdu.edu.au/study/course/bachelor-nursing-wnur02?year=2026",
  checkedAt: "2026-07-30",
};

const cduNursingGrad: RouteSource = {
  name: "Master of Nursing Practice (Pre-Registration)",
  operator: "Charles Darwin University",
  sourceType: "education-provider",
  url: "https://www.cdu.edu.au/study/course/master-nursing-practice-pre-registration-snppr2?year=2026",
  checkedAt: "2026-07-30",
};

const uowNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "University of Wollongong",
  sourceType: "education-provider",
  url: "https://www.uow.edu.au/study/courses/bachelor-of-nursing/",
  checkedAt: "2026-07-30",
};

const uqNursingGrad: RouteSource = {
  name: "Master of Nursing (Graduate Entry)",
  operator: "The University of Queensland",
  sourceType: "education-provider",
  url: "https://study.uq.edu.au/study-options/programs/master-nursing-graduate-entry-5776",
  checkedAt: "2026-07-30",
};


const unswComputerScience: RouteSource = {
  name: "Bachelor of Computer Science",
  operator: "UNSW Sydney",
  sourceType: "education-provider",
  url: "https://www.unsw.edu.au/study/undergraduate/bachelor-of-computer-science",
  checkedAt: "2026-07-18",
}

const melbourneEarlyChildhoodTeaching: RouteSource = {
  name: "Master of Teaching (Early Childhood and Primary)",
  operator: "The University of Melbourne",
  sourceType: "education-provider",
  url: "https://study.unimelb.edu.au/find/courses/graduate/master-of-teaching-early-childhood-and-primary",
  checkedAt: "2026-07-18",
}

const seekRegisteredNurse: RouteSource = {
  name: "Registered Nurse jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/registered-nurse-jobs",
  checkedAt: "2026-07-29",
}

const seekSoftwareEngineer: RouteSource = {
  name: "Software Engineer jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/software-engineer-jobs",
  checkedAt: "2026-07-29",
}

const seekEarlyChildhoodEducator: RouteSource = {
  name: "Early Childhood Educator jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/early-childhood-educator-jobs",
  checkedAt: "2026-07-29",
}

const nswHealthCareers: RouteSource = {
  name: "NSW Health careers",
  operator: "NSW Health",
  sourceType: "employer",
  url: "https://www.health.nsw.gov.au/careers",
  checkedAt: "2026-07-29",
}

const atlassianCareers: RouteSource = {
  name: "Atlassian careers",
  operator: "Atlassian",
  sourceType: "employer",
  url: "https://www.atlassian.com/company/careers",
  checkedAt: "2026-07-29",
}

const goodstartCareers: RouteSource = {
  name: "Goodstart Early Learning careers",
  operator: "Goodstart Early Learning",
  sourceType: "employer",
  url: "https://careers.goodstart.org.au/",
  checkedAt: "2026-07-29",
}

const tafeAgeingSupport: RouteSource = {
  name: "Certificate IV in Ageing Support",
  operator: "TAFE NSW International",
  sourceType: "education-provider",
  url: "https://www.tafensw.edu.au/international/courses/certificate-iv-in-ageing-support--CHC43015",
  checkedAt: "2026-07-18",
}

const tafeCommercialCookery: RouteSource = {
  name: "Certificate III in Commercial Cookery",
  operator: "TAFE NSW International",
  sourceType: "education-provider",
  url: "https://www.tafensw.edu.au/international/courses/certificate-iii-in-commercial-cookery--SIT30821",
  checkedAt: "2026-07-18",
}

const tafeBeautyTherapy: RouteSource = {
  name: "Diploma of Beauty Therapy",
  operator: "TAFE NSW International",
  sourceType: "education-provider",
  url: "https://www.tafensw.edu.au/international/courses/diploma-of-beauty-therapy--SHB50121",
  checkedAt: "2026-07-18",
}

const seekAgedCareWorker: RouteSource = {
  name: "Aged Care Worker jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/aged-care-worker-jobs",
  checkedAt: "2026-07-29",
}

const seekChef: RouteSource = {
  name: "Chef jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/chef-jobs",
  checkedAt: "2026-07-29",
}

const seekBeautyTherapist: RouteSource = {
  name: "Beauty Therapist jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/beauty-therapist-jobs",
  checkedAt: "2026-07-29",
}

const bupaCareers: RouteSource = {
  name: "Bupa careers",
  operator: "Bupa",
  sourceType: "employer",
  url: "https://careers.bupa.com.au/",
  checkedAt: "2026-07-29",
}

const accorCareers: RouteSource = {
  name: "Accor careers",
  operator: "Accor",
  sourceType: "employer",
  url: "https://careers.accor.com/global/en",
  checkedAt: "2026-07-29",
}

const endotaCareers: RouteSource = {
  name: "endota careers",
  operator: "endota spa",
  sourceType: "employer",
  url: "https://endotaspa.com.au/careers/",
  checkedAt: "2026-07-29",
}

const tafeCommunityServices: RouteSource = {
  name: "Diploma of Community Services",
  operator: "TAFE NSW International",
  sourceType: "education-provider",
  url: "https://www.tafensw.edu.au/international/courses/diploma-of-community-services-part-of-package--CHC52021CS",
  checkedAt: "2026-07-29",
}

const ndisWorkerScreening: RouteSource = {
  name: "NDIS worker screening",
  operator: "NDIS Quality and Safeguards Commission",
  sourceType: "professional-regulator",
  url: "https://www.ndiscommission.gov.au/workforce/worker-screening",
  checkedAt: "2026-07-29",
}

const seekDisabilitySupportWorker: RouteSource = {
  name: "Disability Support Worker jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/disability-support-worker-jobs",
  checkedAt: "2026-07-29",
}

const endeavourCareers: RouteSource = {
  name: "Endeavour Foundation careers",
  operator: "Endeavour Foundation",
  sourceType: "employer",
  url: "https://careers.endeavour.com.au/",
  checkedAt: "2026-07-29",
}

const rmitCyberSecurity: RouteSource = {
  name: "Bachelor of Cyber Security",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-cyber-security-bp355",
  checkedAt: "2026-07-29",
}

const nswElectricalWork: RouteSource = {
  name: "Electrical work licensing",
  operator: "NSW Government",
  sourceType: "professional-regulator",
  url: "https://www.nsw.gov.au/business-and-economy/licences-and-credentials/building-and-trade-licences-and-registrations/electrical",
  checkedAt: "2026-07-29",
}

const tafeElectrician: RouteSource = {
  name: "Certificate III in Electrotechnology Electrician",
  operator: "TAFE NSW",
  sourceType: "education-provider",
  url: "https://www.tafensw.edu.au/course-areas/electrotechnology/courses/certificate-iii-in-electrotechnology-electrician--UEE30820-01",
  checkedAt: "2026-07-29",
}

const seekCyberSecurity: RouteSource = {
  name: "Cyber Security jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/cyber-security-jobs",
  checkedAt: "2026-07-29",
}

const seekElectrician: RouteSource = {
  name: "Electrician jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/electrician-jobs",
  checkedAt: "2026-07-29",
}

const cyberCxCareers: RouteSource = {
  name: "CyberCX careers",
  operator: "CyberCX",
  sourceType: "employer",
  url: "https://cybercx.com/careers/",
  checkedAt: "2026-07-29",
}

const ventiaCareers: RouteSource = {
  name: "Ventia careers",
  operator: "Ventia",
  sourceType: "employer",
  url: "https://www.ventia.com/careers",
  checkedAt: "2026-07-29",
}

const rmitDataScience: RouteSource = {
  name: "Bachelor of Data Science",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-data-science-bp340",
  checkedAt: "2026-07-29",
}

const tafeAutomotive: RouteSource = {
  name: "Certificate III in Light Vehicle Mechanical Technology",
  operator: "TAFE NSW",
  sourceType: "education-provider",
  url: "https://www.tafensw.edu.au/course-areas/automotive/courses/AUTO--AUR30620-01",
  checkedAt: "2026-07-29",
}

const seekDataAnalyst: RouteSource = {
  name: "Data Analyst jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/data-analyst-jobs",
  checkedAt: "2026-07-29",
}

const seekAutomotiveTechnician: RouteSource = {
  name: "Automotive Technician jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/automotive-technician-jobs",
  checkedAt: "2026-07-29",
}

const komatsuCareers: RouteSource = {
  name: "Komatsu careers",
  operator: "Komatsu Australia",
  sourceType: "employer",
  url: "https://www.komatsu.com.au/careers",
  checkedAt: "2026-07-29",
}

const engineersAustraliaMigrationAssessment: RouteSource = {
  name: "Migration skills assessment",
  operator: "Engineers Australia",
  sourceType: "professional-regulator",
  url: "https://www.engineersaustralia.org.au/migrants/migration-skills-assessment",
  checkedAt: "2026-07-29",
}

const rmitCivilEngineering: RouteSource = {
  name: "Bachelor of Engineering (Civil and Infrastructure) (Honours)",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/honours-degrees/bachelor-of-engineering-civil-and-infrastructure-honours-bh077",
  checkedAt: "2026-07-29",
}

const rmitMechanicalEngineering: RouteSource = {
  name: "Bachelor of Engineering (Mechanical Engineering) (Honours)",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/honours-degrees/bachelor-of-engineering-mechanical-engineering-honours-bh070",
  checkedAt: "2026-07-29",
}

const rmitAccounting: RouteSource = {
  name: "Bachelor of Accounting",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-accounting-bp351",
  checkedAt: "2026-07-29",
}

const rmitBusinessAnalytics: RouteSource = {
  name: "Bachelor of Commerce — Enterprise AI and Business Analytics major",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-commerce-bp357/enterprise-ai-and-business-analytics",
  checkedAt: "2026-07-29",
}

const seekCivilEngineer: RouteSource = {
  name: "Civil Engineer jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/civil-engineer-jobs",
  checkedAt: "2026-07-29",
}

const seekMechanicalEngineer: RouteSource = {
  name: "Mechanical Engineer jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/mechanical-engineer-jobs",
  checkedAt: "2026-07-29",
}

const seekAccountant: RouteSource = {
  name: "Accountant jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/accountant-jobs",
  checkedAt: "2026-07-29",
}

const seekBusinessAnalyst: RouteSource = {
  name: "Business Analyst jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/business-analyst-jobs",
  checkedAt: "2026-07-29",
}

const aureconCareers: RouteSource = {
  name: "Aurecon careers",
  operator: "Aurecon",
  sourceType: "employer",
  url: "https://www.aurecongroup.com/careers",
  checkedAt: "2026-07-29",
}

const worleyAustraliaCareers: RouteSource = {
  name: "Australia and New Zealand careers",
  operator: "Worley",
  sourceType: "employer",
  url: "https://prod-cm.worley.com/en/careers/your-global-career/australia-and-new-zealand",
  checkedAt: "2026-07-29",
}

const bdoCareers: RouteSource = {
  name: "Professional careers",
  operator: "BDO Australia",
  sourceType: "employer",
  url: "https://www.bdo.com.au/en-au/about/careers/experienced-professionals",
  checkedAt: "2026-07-29",
}

const aaswAccreditation: RouteSource = {
  name: "Social work program accreditation",
  operator: "Australian Association of Social Workers",
  sourceType: "professional-regulator",
  url: "https://www.aasw.asn.au/education-employment/higher-education-providers/accreditation/",
  checkedAt: "2026-07-29",
}

const melbourneSocialWork: RouteSource = {
  name: "Master of Social Work",
  operator: "The University of Melbourne",
  sourceType: "education-provider",
  url: "https://study.unimelb.edu.au/find/courses/graduate/master-of-social-work",
  checkedAt: "2026-07-29",
}

const rmitDigitalMedia: RouteSource = {
  name: "Bachelor of Design (Digital Media)",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-design-digital-media-bp309",
  checkedAt: "2026-07-29",
}

const seekSocialWorker: RouteSource = {
  name: "Social Worker jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/social-worker-jobs",
  checkedAt: "2026-07-29",
}

const seekUiDesigner: RouteSource = {
  name: "UI Designer jobs",
  operator: "SEEK",
  sourceType: "job-board",
  url: "https://www.seek.com.au/ui-designer-jobs",
  checkedAt: "2026-07-29",
}

const koreaAustraliaStudyOrWorkVisa: RouteGuide["visa"] = {
  name: "Choose the visa route before you commit to a course or job",
  summary: {
    en: "For a Korean passport holder, a Working Holiday visa and a Student visa are different routes with different conditions. A course, a shortage signal, or a job advertisement does not itself grant a visa or a right to practise a regulated occupation.",
    ko: "한국 여권자에게 워킹홀리데이 비자와 학생 비자는 조건이 다른 별개의 경로입니다. 과정, 부족직종 신호, 채용공고만으로 비자나 규제 직종의 업무 권한이 생기지는 않습니다.",
  },
  eligibility: [
    {
      en: "For study, confirm a current Confirmation of Enrolment (CoE), health cover, and the Student visa criteria directly with Home Affairs before paying non-refundable fees.",
      ko: "학업 경로는 환불 불가 비용을 내기 전에 현재 CoE, 건강보험, 학생비자 기준을 Home Affairs에서 직접 확인하세요.",
    },
    {
      en: "For a direct work start, check the current Working Holiday Maker eligibility for a Republic of Korea passport and your individual visa conditions.",
      ko: "직접 취업을 시작하려면 대한민국 여권의 현재 워킹홀리데이 대상 여부와 본인 비자 조건을 확인하세요.",
    },
  ],
  workConditions: [
    {
      en: "Student visa holders can work only within the current visa conditions while their course is in session; the official page states the standard limit and exceptions.",
      ko: "학생비자 소지자는 수업 기간 중 현재 비자 조건 범위에서만 일할 수 있습니다. 일반 제한과 예외는 공식 페이지에서 확인하세요.",
    },
    {
      en: "A degree-level Australian study route may lead to a Temporary Graduate visa application, but you must independently meet its current eligibility requirements and find your own job.",
      ko: "호주의 학위 과정은 졸업 후 임시졸업비자 신청 경로가 될 수 있지만, 현재 자격 요건은 별도로 충족해야 하며 일자리는 직접 구해야 합니다.",
    },
  ],
  sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, ahpraNursingStandards, nmbaApprovedPrograms, monashNursing, qutNursing, uniscNursing, uniscNursingGrad, deakinNursing, rmitNursing, westernSydneyNursing, flindersNursing, flindersNursingGrad, ecuNursing, ecuNursingGrad, utasNursing, cduNursing, cduNursingGrad, uowNursing, uqNursingGrad, workforceAustralia, seekRegisteredNurse, nswHealthCareers, jobsSkillsShortage],
}

export const ROUTE_GUIDES: readonly RouteGuide[] = [
  {
    id: "kr-au-mining-work",
    candidateId: "mining-site-work",
    origin: {
      code: "KR",
      slug: "south-korea",
      name: { en: "South Korea", ko: "대한민국" },
    },
    destination: {
      code: "AU",
      slug: "australia",
      name: { en: "Australia", ko: "호주" },
    },
    slug: "mining-work",
    target: { en: "Mining work", ko: "광업 취업" },
    goals: ["work"],
    searchTerms: ["mining", "mine", "resources", "광업", "광산", "자원"],
    title: {
      en: "A source-backed route for a Korean passport holder seeking mining work in Australia",
      ko: "한국 여권자가 호주 광업 취업을 준비하는 검증 경로",
    },
    summary: {
      en: "This published route separates Working Holiday visa conditions from site and employer requirements, then connects you to current training, job, employer, and Western Australia regional evidence.",
      ko: "이 공개 경로는 워킹홀리데이 비자 조건과 현장·고용주 요건을 분리하고, 최신 교육·구직·고용주·서호주 지역 근거를 연결합니다.",
    },
    lastVerified: "2026-07-29",
    publication: {
      status: "published",
      gates: { visa: true, preparation: true, jobs: true, courses: true, map: true },
    },
    availability: {
      status: "conditional",
      label: { en: "Conditionally possible", ko: "조건부 가능" },
      summary: {
        en: "The information below identifies a possible route; it is not a visa grant, job offer, or confirmation that a particular site will accept you.",
        ko: "아래 정보는 가능한 경로를 보여줄 뿐, 비자 승인·채용 제안·특정 현장의 채용 가능 여부를 보장하지 않습니다.",
      },
      source: homeAffairsKoreaUpdate,
    },
    visa: {
      name: "Working Holiday visa (subclass 417)",
      summary: {
        en: "As checked on 29 July 2026, Republic of Korea passport holders aged 18 to 35 inclusive are listed in the Working Holiday Maker program. Applications are assessed individually; check the current visa listing before applying.",
        ko: "2026년 7월 29일 확인 기준으로 대한민국 여권 소지자는 만 18세부터 35세까지 워킹홀리데이 메이커 프로그램 대상에 안내되어 있습니다. 개별 심사이므로 신청 전 현재 비자 안내를 다시 확인해야 합니다.",
      },
      eligibility: [
        {
          en: "Hold a Republic of Korea passport and be within the published 18 to 35 inclusive age range.",
          ko: "대한민국 여권을 소지하고 공개된 만 18세부터 35세까지의 연령 요건 안에 있어야 합니다.",
        },
        {
          en: "Apply through the official process and wait for the written grant before booking non-refundable travel or employment commitments.",
          ko: "공식 절차로 신청하고, 환불 불가한 항공권이나 고용 약속을 하기 전 서면 비자 승인 통지를 기다리세요.",
        },
      ],
      workConditions: [
        {
          en: "The WHM program permits a 12-month holiday with short-term work and study, subject to the visa conditions in your grant.",
          ko: "WHM 프로그램은 비자 승인서에 적힌 조건을 전제로 12개월 체류 중 단기 취업과 학업을 허용합니다.",
        },
        {
          en: "Condition 8547 generally limits work with one employer to 6 months unless a current exemption or written permission applies.",
          ko: "조건 8547에 따라 현재 면제 또는 서면 허가가 없는 한 동일 고용주 근무는 일반적으로 최대 6개월입니다.",
        },
        {
          en: "Mining can be relevant to a later WHM visa only when the role, location, dates, and evidence meet the current specified-work rules. A job title alone is not enough.",
          ko: "광업은 직무·지역·근무 기간·증빙이 현재 지정근무 규정을 충족할 때만 이후 WHM 비자에 관련될 수 있습니다. 직함만으로 판단하면 안 됩니다.",
        },
      ],
      sources: [homeAffairsKoreaUpdate, homeAffairsOverview, homeAffairsConditions, homeAffairsSpecified417],
    },
    preparation: [
      {
        title: { en: "Confirm the visa before spending", ko: "비용을 쓰기 전 비자부터 확인" },
        detail: {
          en: "Use the Department of Home Affairs guidance and wait for a written visa decision before committing to travel or a course.",
          ko: "Department of Home Affairs 안내를 확인하고, 여행이나 과정에 비용을 쓰기 전 서면 비자 결정을 기다리세요.",
        },
        source: homeAffairsKoreaUpdate,
      },
      {
        title: { en: "Read the employer limit before accepting a roster", ko: "로스터 수락 전 동일 고용주 제한 확인" },
        detail: {
          en: "Long FIFO assignments can reach the same-employer limit. Check the current exception or permission process before extending work.",
          ko: "장기 FIFO 배정은 동일 고용주 제한에 닿을 수 있습니다. 근무 연장 전 현재의 예외 또는 허가 절차를 확인하세요.",
        },
        source: homeAffairsConditions,
      },
      {
        title: { en: "Use the specific job listing as the site-requirement source", ko: "현장 요건은 지원할 공고에서 확인" },
        detail: {
          en: "Ask the recruiter or operator which induction, medical, licence, safety, or experience evidence applies before you pay for training.",
          ko: "교육비를 내기 전에 채용 담당자나 운영사에 필요한 인덕션, 건강검진, 면허, 안전·경력 증빙을 확인하세요.",
        },
      },
      {
        title: { en: "Keep specified-work evidence from day one", ko: "지정근무 증빙은 첫날부터 보관" },
        detail: {
          en: "If a later WHM visa matters, read the official specified-work rules before accepting a role and keep the records the rules require.",
          ko: "추후 WHM 비자가 중요하다면 채용 수락 전 공식 지정근무 규정을 읽고, 요구되는 증빙을 보관하세요.",
        },
        source: homeAffairsSpecified417,
      },
    ],
    jobs: [
      {
        label: { en: "Workforce Australia job search", ko: "Workforce Australia 구직 검색" },
        detail: { en: "Australian Government job search. Use mining terms and a Western Australia location filter.", ko: "호주 정부 구직 검색입니다. 광업 키워드와 서호주 지역 필터를 함께 사용하세요." },
        url: workforceAustralia.url,
        linkType: "job",
        relevance: { en: "Government-operated job-search starting point.", ko: "정부 운영 구직 검색의 시작점입니다." },
        source: workforceAustralia,
      },
      {
        label: { en: "SEEK: mining jobs in Western Australia", ko: "SEEK: 서호주 광업 채용" },
        detail: { en: "Live mining, resources, and energy listings across Western Australia.", ko: "서호주 전역의 광업·자원·에너지 실시간 공고입니다." },
        url: seekMiningWa.url,
        linkType: "job",
        relevance: { en: "Use live listings to compare role and site requirements.", ko: "실시간 공고로 직무·현장 요건을 비교하세요." },
        source: seekMiningWa,
      },
      {
        label: { en: "SEEK: entry-level mining jobs in Western Australia", ko: "SEEK: 서호주 신입·초급 광업 채용" },
        detail: { en: "A narrower live search for entry-level wording and employer requirements.", ko: "신입·초급 표현과 고용주 요건을 살피는 더 좁은 실시간 검색입니다." },
        url: seekEntryMiningWa.url,
        linkType: "job",
        relevance: { en: "Use it to learn the language employers use for junior roles.", ko: "초급 직무에 고용주가 쓰는 표현을 확인하는 데 사용하세요." },
        source: seekEntryMiningWa,
      },
    ],
    courses: [
      { label: { en: "Monash Bachelor of Nursing", ko: "Monash Bachelor of Nursing" }, detail: { en: "An international course page to research alongside the Nursing and Midwifery Board approved-program search. Confirm current intake, fee, CoE and approval status before applying.", ko: "Nursing and Midwifery Board 승인 과정 검색과 함께 검토할 국제학생 과정 페이지입니다. 지원 전 현재 입학, 학비, CoE, 승인 상태를 확인하세요." }, url: monashNursing.url, linkType: "course", relevance: { en: "A course page is not proof of registration eligibility by itself.", ko: "과정 페이지 자체가 등록 자격의 증거는 아닙니다." }, source: monashNursing },
      { label: { en: "QUT Bachelor of Nursing", ko: "QUT 간호학사" }, detail: { en: "QUT Bachelor of Nursing (CRICOS 003501K). Annual tuition A$43,500 (2026). IELTS 7.0 overall (L/R/S 7.0, W 6.5). Kelvin Grove campus. ANMAC/NMBA accredited with reaccreditation underway.", ko: "QUT 간호학사 (CRICOS 003501K). 연학비 A$43,500 (2026). IELTS 7.0 overall (L/R/S 7.0, W 6.5). Kelvin Grove 캠퍼스. ANMAC/NMBA 인증, 재인증 진행 중." }, url: qutNursing.url, linkType: "course", relevance: { en: "Verify current intake availability and NMBA approval status before applying.", ko: "지원 전 현재 입학 가능 여부와 NMBA 승인 상태를 확인하세요." }, source: qutNursing },
      { label: { en: "UniSC Bachelor of Nursing Science", ko: "UniSC 간호과학 학사" }, detail: { en: "UniSC Bachelor of Nursing Science (CRICOS 078086M). Annual tuition A$32,500 (2026). IELTS 7.0 all bands. Multiple QLD campuses (Sunshine Coast, Gympie, Fraser Coast, Caboolture, Moreton Bay). Blended delivery. ANMAC accredited.", ko: "UniSC 간호과학 학사 (CRICOS 078086M). 연학비 A$32,500 (2026). IELTS 7.0 전 과목. QLD 다수 캠퍼스. 혼합 수업. ANMAC 인증." }, url: uniscNursing.url, linkType: "course", relevance: { en: "Blended delivery; confirm campus attendance requirements for student visa.", ko: "혼합 수업 방식이므로 학생비자 캠퍼스 출석 요건을 확인하세요." }, source: uniscNursing },
      { label: { en: "UniSC Bachelor of Nursing Science (Graduate Entry)", ko: "UniSC 간호과학 학사 (졸업자 입학)" }, detail: { en: "Graduate entry pathway (CRICOS 072637M). 2.3 years. Annual tuition A$32,500 (2026). IELTS 7.0 all bands. Requires prior bachelor degree. ANMAC accredited.", ko: "졸업자 입학 과정 (CRICOS 072637M). 2.3년. 연학비 A$32,500 (2026). IELTS 7.0 전 과목. 학사 학위 소지 필요. ANMAC 인증." }, url: uniscNursingGrad.url, linkType: "course", relevance: { en: "For applicants with a prior degree; check 10-year recency rule.", ko: "기존 학위 소지자 대상; 10년 이내 학위 요건 확인 필요." }, source: uniscNursingGrad },
      { label: { en: "Deakin Bachelor of Nursing (International)", ko: "Deakin 간호학사 (국제학생)" }, detail: { en: "Deakin Bachelor of Nursing (CRICOS 018327G). Annual tuition A$45,800 (2026). IELTS 7.0 overall (S 7.0, R 7.0, L 7.0, W 6.5). Burwood, Waterfront, Warrnambool campuses. ANMAC accredited, NMBA approved. Verified status.", ko: "Deakin 간호학사 (CRICOS 018327G). 연학비 A$45,800 (2026). IELTS 7.0 overall (S 7.0, R 7.0, L 7.0, W 6.5). Burwood, Waterfront, Warrnambool 캠퍼스. ANMAC 인증, NMBA 승인. 검증됨." }, url: deakinNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; check trimester 1 (March) intake only.", ko: "NMBA 승인 검증됨; Trimester 1 (3월) 입학만 가능 확인." }, source: deakinNursing },
      { label: { en: "RMIT Bachelor of Nursing", ko: "RMIT 간호학사" }, detail: { en: "RMIT Bachelor of Nursing (CRICOS 114027H). Annual tuition A$45,120 (2026). IELTS 7.0 overall (no band below 6.5). Bundoora campus. ANMAC accredited.", ko: "RMIT 간호학사 (CRICOS 114027H). 연학비 A$45,120 (2026). IELTS 7.0 overall (전 과목 6.5 이상). Bundoora 캠퍼스. ANMAC 인증." }, url: rmitNursing.url, linkType: "course", relevance: { en: "Confirm separate Enrolled Nurse pathway (BP032P24D2) is not selected.", ko: "등록간호사 경로(BP032P24D2)와 혼동하지 않도록 주의." }, source: rmitNursing },
      { label: { en: "Western Sydney Bachelor of Nursing", ko: "Western Sydney 간호학사" }, detail: { en: "Western Sydney Bachelor of Nursing (CRICOS 041099M). Annual tuition A$38,833 (2026). IELTS 7.0 overall. Campbelltown, Hawkesbury, Parramatta campuses. ANMAC accredited, NMBA approved. Verified status.", ko: "Western Sydney 간호학사 (CRICOS 041099M). 연학비 A$38,833 (2026). IELTS 7.0 overall. Campbelltown, Hawkesbury, Parramatta 캠퍼스. ANMAC 인증, NMBA 승인. 검증됨." }, url: westernSydneyNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; check separate Enrolled Nurse pathway.", ko: "NMBA 승인 검증됨; 등록간호보조사 경로와 구분 필요." }, source: westernSydneyNursing },
      { label: { en: "Flinders Bachelor of Nursing (Preregistration)", ko: "Flinders 간호학사 (사전등록)" }, detail: { en: "Flinders Bachelor of Nursing (Preregistration) (CRICOS 005195K). Annual tuition A$44,300 (2026). IELTS 7.0 overall. Bedford Park, City campuses. March; July intakes. ANMAC accredited until 2030, NMBA approved. Verified status.", ko: "Flinders 간호학사 (사전등록) (CRICOS 005195K). 연학비 A$44,300 (2026). IELTS 7.0 overall. Bedford Park, City 캠퍼스. 3월, 7월 입학. ANMAC 2030년까지 인증, NMBA 승인. 검증됨." }, url: flindersNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; graduate entry also available (2 years).", ko: "NMBA 승인 검증됨; 졸업자 입학 과정(2년)도 별도 존재." }, source: flindersNursing },
      { label: { en: "Flinders Bachelor of Nursing (Graduate Entry)", ko: "Flinders 간호학사 (졸업자 입학)" }, detail: { en: "Graduate entry (CRICOS 002701K). 2 years full-time. Annual tuition A$44,300 (2026). IELTS 7.0 overall. Bedford Park campus. January intake for international. ANMAC accredited, NMBA approved. Verified status.", ko: "졸업자 입학 (CRICOS 002701K). 2년 풀타임. 연학비 A$44,300 (2026). IELTS 7.0 overall. Bedford Park 캠퍼스. 국제학생 1월 입학. ANMAC 인증, NMBA 승인. 검증됨." }, url: flindersNursingGrad.url, linkType: "course", relevance: { en: "For prior degree holders; January intake specific to international students.", ko: "기존 학위 소지자 대상; 국제학생 1월 입학 별도 확인." }, source: flindersNursingGrad },
      { label: { en: "ECU Bachelor of Science (Nursing)", ko: "ECU 간호학 이학사" }, detail: { en: "ECU Bachelor of Science (Nursing) (CRICOS 077132G). Annual tuition A$44,000 (2026). IELTS 7.0 overall. Joondalup campus. ANMAC accredited.", ko: "ECU 간호학 이학사 (CRICOS 077132G). 연학비 A$44,000 (2026). IELTS 7.0 overall. Joondalup 캠퍼스. ANMAC 인증." }, url: ecuNursing.url, linkType: "course", relevance: { en: "Also offers Master of Nursing (Graduate Entry) for prior degree holders.", ko: "기존 학위 소지자용 Master of Nursing (Graduate Entry)도 별도 제공." }, source: ecuNursing },
      { label: { en: "ECU Master of Nursing (Graduate Entry)", ko: "ECU 간호학 석사 (졸업자 입학)" }, detail: { en: "Graduate entry master (CRICOS 091870M). Annual tuition A$45,400 (2026). IELTS 7.0 overall. For applicants with prior bachelor degree. ANMAC accredited.", ko: "졸업자 입학 석사 (CRICOS 091870M). 연학비 A$45,400 (2026). IELTS 7.0 overall. 학사 학위 소지자 대상. ANMAC 인증." }, url: ecuNursingGrad.url, linkType: "course", relevance: { en: "Graduate entry master pathway; confirm 10-year degree recency.", ko: "졸업자 입학 석사 경로; 10년 이내 학위 요건 확인." }, source: ecuNursingGrad },
      { label: { en: "UTAS Bachelor of Nursing", ko: "UTAS 간호학사" }, detail: { en: "UTAS Bachelor of Nursing (CRICOS 102253H). Annual tuition A$42,998 (2026). IELTS 7.0 overall. Hobart, Launceston, Sydney campuses. ANMAC accredited.", ko: "UTAS 간호학사 (CRICOS 102253H). 연학비 A$42,998 (2026). IELTS 7.0 overall. Hobart, Launceston, Sydney 캠퍼스. ANMAC 인증." }, url: utasNursing.url, linkType: "course", relevance: { en: "Multi-state campuses; confirm campus availability for international students.", ko: "다주 캠퍼스; 국제학생 캠퍼스별 개설 여부 확인." }, source: utasNursing },
      { label: { en: "CDU Bachelor of Nursing", ko: "CDU 간호학사" }, detail: { en: "CDU Bachelor of Nursing (CRICOS 118197B). Annual tuition A$38,720 (2026). IELTS 7.0 overall. Casuarina campus. ANMAC accredited.", ko: "CDU 간호학사 (CRICOS 118197B). 연학비 A$38,720 (2026). IELTS 7.0 overall. Casuarina 캠퍼스. ANMAC 인증." }, url: cduNursing.url, linkType: "course", relevance: { en: "Also offers Master of Nursing Practice (Pre-Registration).", ko: "Master of Nursing Practice (Pre-Registration)도 별도 제공." }, source: cduNursing },
      { label: { en: "CDU Master of Nursing Practice (Pre-Registration)", ko: "CDU 간호실무 석사 (사전등록)" }, detail: { en: "Pre-registration master (CRICOS 118951F). Annual tuition A$40,416 (2026). IELTS 7.0 overall. For non-nursing graduates. ANMAC accredited.", ko: "사전등록 석사 (CRICOS 118951F). 연학비 A$40,416 (2026). IELTS 7.0 overall. 비간호학 학사 소지자 대상. ANMAC 인증." }, url: cduNursingGrad.url, linkType: "course", relevance: { en: "For career changers without nursing background; check eligibility.", ko: "비간호학 전공자 전환 경로; 자격 요건 확인 필요." }, source: cduNursingGrad },
      { label: { en: "UOW Bachelor of Nursing", ko: "UOW 간호학사" }, detail: { en: "UOW Bachelor of Nursing (CRICOS 113585H). Annual tuition A$39,936 (2026). IELTS 7.0 overall. Wollongong campus. ANMAC accredited.", ko: "UOW 간호학사 (CRICOS 113585H). 연학비 A$39,936 (2026). IELTS 7.0 overall. Wollongong 캠퍼스. ANMAC 인증." }, url: uowNursing.url, linkType: "course", relevance: { en: "Single campus; confirm 2026 intake availability.", ko: "단일 캠퍼스; 2026년 입학 가능 여부 확인." }, source: uowNursing },
      { label: { en: "UQ Master of Nursing (Graduate Entry)", ko: "UQ 간호학 석사 (졸업자 입학)" }, detail: { en: "UQ Master of Nursing (Graduate Entry) (CRICOS 069418D). Annual tuition A$52,528 (2026). IELTS 7.0 overall. St Lucia campus. ANMAC accredited.", ko: "UQ 간호학 석사 (졸업자 입학) (CRICOS 069418D). 연학비 A$52,528 (2026). IELTS 7.0 overall. St Lucia 캠퍼스. ANMAC 인증." }, url: uqNursingGrad.url, linkType: "course", relevance: { en: "Graduate entry master; highest tuition in this list; confirm 10-year degree recency.", ko: "졸업자 입학 석사; 리스트 내 최고 학비; 10년 이내 학위 요건 확인." }, source: uqNursingGrad },
      { label: { en: "Approved nursing programs search", ko: "승인 간호 과정 검색" }, detail: { en: "Use the Board's live search to verify whether the exact program is approved and leads toward registration.", ko: "지원하려는 정확한 과정이 승인되어 등록으로 이어지는지 Board의 실시간 검색에서 확인하세요." }, url: nmbaApprovedPrograms.url, linkType: "course", relevance: { en: "Check the exact program, not a similarly named degree.", ko: "비슷한 이름의 학위가 아니라 정확한 과정을 확인하세요." }, source: nmbaApprovedPrograms },
    ],
    employers: [
      {
        label: { en: "BHP careers", ko: "BHP 채용" },
        detail: { en: "Employer careers page; review its current roles and each listing’s requirements.", ko: "고용주 채용 페이지입니다. 현재 공고와 각 공고의 요건을 검토하세요." },
        url: "https://www.bhp.com/careers",
        linkType: "employer",
        relevance: { en: "BHP publishes Western Australia Iron Ore operations evidence for this regional focus.", ko: "BHP는 이 지역 초점에 대한 서호주 철광석 운영 근거를 공개합니다." },
        source: bhpPilbara,
      },
      {
        label: { en: "Rio Tinto careers", ko: "Rio Tinto 채용" },
        detail: { en: "Employer careers page; review current roles and each listing’s requirements.", ko: "고용주 채용 페이지입니다. 현재 공고와 각 공고의 요건을 검토하세요." },
        url: "https://jobs.riotinto.com/",
        linkType: "employer",
        relevance: { en: "Use current employer listings to confirm role location and site requirements.", ko: "현재 고용주 공고에서 직무 위치와 현장 요건을 확인하세요." },
        source: rioPilbara,
      },
    ],
    map: {
      label: { en: "Explore Western Australia and Pilbara mining signals", ko: "서호주·Pilbara 광업 신호 탐색" },
      detail: { en: "Start with a small, source-labelled regional explorer. It is not a country comparison or university catalogue.", ko: "출처가 표시된 작은 지역 탐색부터 시작합니다. 국가 비교나 대학 카탈로그가 아닙니다." },
      href: "/maps?route=kr-au-mining-work",
      source: waPilbaraMapEvidence,
      signals: [
        {
          region: { en: "Western Australia", ko: "서호주" },
          detail: { en: "Ready: this route’s live job searches are scoped to Western Australia; compare every listing’s exact location and roster.", ko: "준비됨: 이 경로의 실시간 구직 검색은 서호주를 대상으로 합니다. 각 공고의 정확한 위치와 로스터를 비교하세요." },
          readiness: "ready",
          source: seekMiningWa,
        },
        {
          region: { en: "Pilbara", ko: "Pilbara" },
          detail: { en: "Ready as a regional employer signal, not a vacancy count. Open the employer links for current roles and site conditions.", ko: "채용 건수는 아닌 지역 고용주 신호로 준비됨 상태입니다. 현재 공고와 현장 조건은 고용주 링크에서 확인하세요." },
          readiness: "ready",
          source: waPilbaraMapEvidence,
        },
      ],
    },
    sources: [
      homeAffairsKoreaUpdate,
      homeAffairsOverview,
      homeAffairsConditions,
      homeAffairsSpecified417,
      trainingGovRii20120,
      workforceAustralia,
      seekMiningWa,
      seekEntryMiningWa,
      bhpPilbara,
      rioPilbara,
      waPilbaraMapEvidence,
    ],
  },
  {
    id: "kr-au-registered-nurse",
    candidateId: "registered-nurse",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "registered-nurse",
    target: { en: "Registered Nurse", ko: "간호사" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["registered nurse", "nurse", "nursing", "간호", "간호사", "간호학"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring nursing", ko: "한국 여권자가 호주 간호사 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to separate visa eligibility, nursing registration, approved study, and live job searching. A nursing course or shortage signal does not replace registration requirements.", ko: "이 경로는 비자 자격, 간호사 등록, 승인된 학업, 실제 구직을 분리해 보여줍니다. 간호 과정이나 부족직종 신호가 등록 요건을 대신하지는 않습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: {
      status: "conditional",
      label: { en: "Conditionally possible", ko: "조건부 가능" },
      summary: { en: "Working as a Registered Nurse requires the relevant Australian registration. Confirm the current Nursing and Midwifery Board requirements before treating a course or job listing as a viable path.", ko: "간호사로 일하려면 관련 호주 등록이 필요합니다. 과정이나 공고를 가능한 경로로 판단하기 전 Nursing and Midwifery Board의 현재 요건을 확인하세요." },
      source: ahpraNursingStandards,
    },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Check nursing registration first", ko: "간호사 등록부터 확인" }, detail: { en: "Read the Nursing and Midwifery Board registration standards before committing to a course, recruitment agency, or relocation plan.", ko: "과정, 채용 에이전시, 이주 계획에 비용을 쓰기 전에 Nursing and Midwifery Board 등록 기준을 읽으세요." }, source: ahpraNursingStandards },
      { title: { en: "Use an approved-program search", ko: "승인 과정부터 검색" }, detail: { en: "A Board-approved program can support graduate registration, but you still apply for registration and meet every other current requirement.", ko: "Board 승인 과정은 졸업 후 등록 경로가 될 수 있지만, 등록은 별도로 신청하고 다른 현재 요건도 모두 충족해야 합니다." }, source: nmbaApprovedPrograms },
      { title: { en: "Plan English evidence as a registration item", ko: "영어 요건은 등록 항목으로 준비" }, detail: { en: "English-language evidence is a registration requirement, not merely a university-admission preference. Check the current Board standard and accepted-test rules.", ko: "영어 증빙은 대학 입학 선호 사항이 아니라 등록 요건입니다. 현재 Board 기준과 인정 시험 규정을 확인하세요." }, source: ahpraNursingStandards },
    ],
    courses: [
      { label: { en: "Monash Bachelor of Nursing", ko: "Monash Bachelor of Nursing" }, detail: { en: "An international course page to research alongside the Nursing and Midwifery Board approved-program search. Confirm current intake, fee, CoE and approval status before applying.", ko: "Nursing and Midwifery Board 승인 과정 검색과 함께 검토할 국제학생 과정 페이지입니다. 지원 전 현재 입학, 학비, CoE, 승인 상태를 확인하세요." }, url: monashNursing.url, linkType: "course", relevance: { en: "A course page is not proof of registration eligibility by itself.", ko: "과정 페이지 자체가 등록 자격의 증거는 아닙니다." }, source: monashNursing },
      { label: { en: "QUT Bachelor of Nursing", ko: "QUT 간호학사" }, detail: { en: "QUT Bachelor of Nursing (CRICOS 003501K). Annual tuition A$43,500 (2026). IELTS 7.0 overall (L/R/S 7.0, W 6.5). Kelvin Grove campus. ANMAC/NMBA accredited with reaccreditation underway.", ko: "QUT 간호학사 (CRICOS 003501K). 연학비 A$43,500 (2026). IELTS 7.0 overall (L/R/S 7.0, W 6.5). Kelvin Grove 캠퍼스. ANMAC/NMBA 인증, 재인증 진행 중." }, url: qutNursing.url, linkType: "course", relevance: { en: "Verify current intake availability and NMBA approval status before applying.", ko: "지원 전 현재 입학 가능 여부와 NMBA 승인 상태를 확인하세요." }, source: qutNursing },
      { label: { en: "UniSC Bachelor of Nursing Science", ko: "UniSC 간호과학 학사" }, detail: { en: "UniSC Bachelor of Nursing Science (CRICOS 078086M). Annual tuition A$32,500 (2026). IELTS 7.0 all bands. Multiple QLD campuses (Sunshine Coast, Gympie, Fraser Coast, Caboolture, Moreton Bay). Blended delivery. ANMAC accredited.", ko: "UniSC 간호과학 학사 (CRICOS 078086M). 연학비 A$32,500 (2026). IELTS 7.0 전 과목. QLD 다수 캠퍼스. 혼합 수업. ANMAC 인증." }, url: uniscNursing.url, linkType: "course", relevance: { en: "Blended delivery; confirm campus attendance requirements for student visa.", ko: "혼합 수업 방식이므로 학생비자 캠퍼스 출석 요건을 확인하세요." }, source: uniscNursing },
      { label: { en: "UniSC Bachelor of Nursing Science (Graduate Entry)", ko: "UniSC 간호과학 학사 (졸업자 입학)" }, detail: { en: "Graduate entry pathway (CRICOS 072637M). 2.3 years. Annual tuition A$32,500 (2026). IELTS 7.0 all bands. Requires prior bachelor degree. ANMAC accredited.", ko: "졸업자 입학 과정 (CRICOS 072637M). 2.3년. 연학비 A$32,500 (2026). IELTS 7.0 전 과목. 학사 학위 소지 필요. ANMAC 인증." }, url: uniscNursingGrad.url, linkType: "course", relevance: { en: "For applicants with a prior degree; check 10-year recency rule.", ko: "기존 학위 소지자 대상; 10년 이내 학위 요건 확인 필요." }, source: uniscNursingGrad },
      { label: { en: "Deakin Bachelor of Nursing (International)", ko: "Deakin 간호학사 (국제학생)" }, detail: { en: "Deakin Bachelor of Nursing (CRICOS 018327G). Annual tuition A$45,800 (2026). IELTS 7.0 overall (S 7.0, R 7.0, L 7.0, W 6.5). Burwood, Waterfront, Warrnambool campuses. ANMAC accredited, NMBA approved. Verified status.", ko: "Deakin 간호학사 (CRICOS 018327G). 연학비 A$45,800 (2026). IELTS 7.0 overall (S 7.0, R 7.0, L 7.0, W 6.5). Burwood, Waterfront, Warrnambool 캠퍼스. ANMAC 인증, NMBA 승인. 검증됨." }, url: deakinNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; check trimester 1 (March) intake only.", ko: "NMBA 승인 검증됨; Trimester 1 (3월) 입학만 가능 확인." }, source: deakinNursing },
      { label: { en: "RMIT Bachelor of Nursing", ko: "RMIT 간호학사" }, detail: { en: "RMIT Bachelor of Nursing (CRICOS 114027H). Annual tuition A$45,120 (2026). IELTS 7.0 overall (no band below 6.5). Bundoora campus. ANMAC accredited.", ko: "RMIT 간호학사 (CRICOS 114027H). 연학비 A$45,120 (2026). IELTS 7.0 overall (전 과목 6.5 이상). Bundoora 캠퍼스. ANMAC 인증." }, url: rmitNursing.url, linkType: "course", relevance: { en: "Confirm separate Enrolled Nurse pathway (BP032P24D2) is not selected.", ko: "등록간호사 경로(BP032P24D2)와 혼동하지 않도록 주의." }, source: rmitNursing },
      { label: { en: "Western Sydney Bachelor of Nursing", ko: "Western Sydney 간호학사" }, detail: { en: "Western Sydney Bachelor of Nursing (CRICOS 041099M). Annual tuition A$38,833 (2026). IELTS 7.0 overall. Campbelltown, Hawkesbury, Parramatta campuses. ANMAC accredited, NMBA approved. Verified status.", ko: "Western Sydney 간호학사 (CRICOS 041099M). 연학비 A$38,833 (2026). IELTS 7.0 overall. Campbelltown, Hawkesbury, Parramatta 캠퍼스. ANMAC 인증, NMBA 승인. 검증됨." }, url: westernSydneyNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; check separate Enrolled Nurse pathway.", ko: "NMBA 승인 검증됨; 등록간호보조사 경로와 구분 필요." }, source: westernSydneyNursing },
      { label: { en: "Flinders Bachelor of Nursing (Preregistration)", ko: "Flinders 간호학사 (사전등록)" }, detail: { en: "Flinders Bachelor of Nursing (Preregistration) (CRICOS 005195K). Annual tuition A$44,300 (2026). IELTS 7.0 overall. Bedford Park, City campuses. March; July intakes. ANMAC accredited until 2030, NMBA approved. Verified status.", ko: "Flinders 간호학사 (사전등록) (CRICOS 005195K). 연학비 A$44,300 (2026). IELTS 7.0 overall. Bedford Park, City 캠퍼스. 3월, 7월 입학. ANMAC 2030년까지 인증, NMBA 승인. 검증됨." }, url: flindersNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; graduate entry also available (2 years).", ko: "NMBA 승인 검증됨; 졸업자 입학 과정(2년)도 별도 존재." }, source: flindersNursing },
      { label: { en: "Flinders Bachelor of Nursing (Graduate Entry)", ko: "Flinders 간호학사 (졸업자 입학)" }, detail: { en: "Graduate entry (CRICOS 002701K). 2 years full-time. Annual tuition A$44,300 (2026). IELTS 7.0 overall. Bedford Park campus. January intake for international. ANMAC accredited, NMBA approved. Verified status.", ko: "졸업자 입학 (CRICOS 002701K). 2년 풀타임. 연학비 A$44,300 (2026). IELTS 7.0 overall. Bedford Park 캠퍼스. 국제학생 1월 입학. ANMAC 인증, NMBA 승인. 검증됨." }, url: flindersNursingGrad.url, linkType: "course", relevance: { en: "For prior degree holders; January intake specific to international students.", ko: "기존 학위 소지자 대상; 국제학생 1월 입학 별도 확인." }, source: flindersNursingGrad },
      { label: { en: "ECU Bachelor of Science (Nursing)", ko: "ECU 간호학 이학사" }, detail: { en: "ECU Bachelor of Science (Nursing) (CRICOS 077132G). Annual tuition A$44,000 (2026). IELTS 7.0 overall. Joondalup campus. ANMAC accredited.", ko: "ECU 간호학 이학사 (CRICOS 077132G). 연학비 A$44,000 (2026). IELTS 7.0 overall. Joondalup 캠퍼스. ANMAC 인증." }, url: ecuNursing.url, linkType: "course", relevance: { en: "Also offers Master of Nursing (Graduate Entry) for prior degree holders.", ko: "기존 학위 소지자용 Master of Nursing (Graduate Entry)도 별도 제공." }, source: ecuNursing },
      { label: { en: "ECU Master of Nursing (Graduate Entry)", ko: "ECU 간호학 석사 (졸업자 입학)" }, detail: { en: "Graduate entry master (CRICOS 091870M). Annual tuition A$45,400 (2026). IELTS 7.0 overall. For applicants with prior bachelor degree. ANMAC accredited.", ko: "졸업자 입학 석사 (CRICOS 091870M). 연학비 A$45,400 (2026). IELTS 7.0 overall. 학사 학위 소지자 대상. ANMAC 인증." }, url: ecuNursingGrad.url, linkType: "course", relevance: { en: "Graduate entry master pathway; confirm 10-year degree recency.", ko: "졸업자 입학 석사 경로; 10년 이내 학위 요건 확인." }, source: ecuNursingGrad },
      { label: { en: "UTAS Bachelor of Nursing", ko: "UTAS 간호학사" }, detail: { en: "UTAS Bachelor of Nursing (CRICOS 102253H). Annual tuition A$42,998 (2026). IELTS 7.0 overall. Hobart, Launceston, Sydney campuses. ANMAC accredited.", ko: "UTAS 간호학사 (CRICOS 102253H). 연학비 A$42,998 (2026). IELTS 7.0 overall. Hobart, Launceston, Sydney 캠퍼스. ANMAC 인증." }, url: utasNursing.url, linkType: "course", relevance: { en: "Multi-state campuses; confirm campus availability for international students.", ko: "다주 캠퍼스; 국제학생 캠퍼스별 개설 여부 확인." }, source: utasNursing },
      { label: { en: "CDU Bachelor of Nursing", ko: "CDU 간호학사" }, detail: { en: "CDU Bachelor of Nursing (CRICOS 118197B). Annual tuition A$38,720 (2026). IELTS 7.0 overall. Casuarina campus. ANMAC accredited.", ko: "CDU 간호학사 (CRICOS 118197B). 연학비 A$38,720 (2026). IELTS 7.0 overall. Casuarina 캠퍼스. ANMAC 인증." }, url: cduNursing.url, linkType: "course", relevance: { en: "Also offers Master of Nursing Practice (Pre-Registration).", ko: "Master of Nursing Practice (Pre-Registration)도 별도 제공." }, source: cduNursing },
      { label: { en: "CDU Master of Nursing Practice (Pre-Registration)", ko: "CDU 간호실무 석사 (사전등록)" }, detail: { en: "Pre-registration master (CRICOS 118951F). Annual tuition A$40,416 (2026). IELTS 7.0 overall. For non-nursing graduates. ANMAC accredited.", ko: "사전등록 석사 (CRICOS 118951F). 연학비 A$40,416 (2026). IELTS 7.0 overall. 비간호학 졸업자 대상. ANMAC 인증." }, url: cduNursingGrad.url, linkType: "course", relevance: { en: "Pre-registration master for career changers; verify eligibility.", ko: "전직자용 사전등록 석사; 자격 요건 확인 필요." }, source: cduNursingGrad },
      { label: { en: "UOW Bachelor of Nursing", ko: "UOW 간호학사" }, detail: { en: "UOW Bachelor of Nursing (CRICOS 113585H). Annual tuition A$39,936 (2026). IELTS 7.0 overall. Wollongong campus. ANMAC accredited.", ko: "UOW 간호학사 (CRICOS 113585H). 연학비 A$39,936 (2026). IELTS 7.0 overall. Wollongong 캠퍼스. ANMAC 인증." }, url: uowNursing.url, linkType: "course", relevance: { en: "Regional NSW campus; check graduate outcomes for regional migration.", ko: "지방 NSW 캠퍼스; 지방 이민용 졸업 결과 확인." }, source: uowNursing },
      { label: { en: "UQ Master of Nursing (Graduate Entry)", ko: "UQ 간호학 석사 (졸업자 입학)" }, detail: { en: "UQ Master of Nursing (Graduate Entry) (CRICOS 069418D). Annual tuition A$52,528 (2026). IELTS 7.0 overall. For prior degree holders. ANMAC accredited.", ko: "UQ 간호학 석사 (졸업자 입학) (CRICOS 069418D). 연학비 A$52,528 (2026). IELTS 7.0 overall. 기존 학위 소지자 대상. ANMAC 인증." }, url: uqNursingGrad.url, linkType: "course", relevance: { en: "Graduate entry master at Go8 university; higher tuition but strong reputation.", ko: "Go8 대학 졸업자 입학 석사; 학비 높지만 평판 강함." }, source: uqNursingGrad },
      { label: { en: "Approved nursing programs search", ko: "승인 간호 과정 검색" }, detail: { en: "Use the Board's live search to verify whether the exact program is approved and leads toward registration.", ko: "지원하려는 정확한 과정이 승인되어 등록으로 이어지는지 Board의 실시간 검색에서 확인하세요." }, url: nmbaApprovedPrograms.url, linkType: "course", relevance: { en: "Check the exact program, not a similarly named degree.", ko: "비슷한 이름의 학위가 아니라 정확한 과정을 확인하세요." }, source: nmbaApprovedPrograms },
    ],
    jobs: [
      { label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; use Registered Nurse and state filters, then read each employer’s registration and roster requirements.", ko: "정부 구직 서비스입니다. Registered Nurse와 주 필터를 사용한 뒤, 각 고용주의 등록·근무 요건을 확인하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "A live listing is the source of truth for the role’s current requirements.", ko: "현재 공고가 직무의 최신 요건을 판단하는 기준입니다." }, source: workforceAustralia },
      { label: { en: "SEEK Registered Nurse jobs", ko: "SEEK 간호사 채용" }, detail: { en: "Use title, state, clinical setting, and registration filters to compare current roles.", ko: "직함, 주, 임상 환경, 등록 요건 필터로 현재 공고를 비교하세요." }, url: seekRegisteredNurse.url, linkType: "job", relevance: { en: "Use live listings to see employers’ language for experience and registration.", ko: "실시간 공고에서 고용주가 요구하는 경력·등록 표현을 확인하세요." }, source: seekRegisteredNurse },
    ],
    employers: [
      { label: { en: "NSW Health careers", ko: "NSW Health 채용" }, detail: { en: "A large public-health employer’s careers starting point; review each listing’s location, registration, and visa requirements.", ko: "대형 공공 보건 고용주의 채용 시작점입니다. 각 공고의 지역, 등록, 비자 요건을 확인하세요." }, url: nswHealthCareers.url, linkType: "employer", relevance: { en: "Use an employer’s own listing instead of assuming a shortage signal means every role is open to every applicant.", ko: "부족직종 신호만으로 누구에게나 공고가 열려 있다고 가정하지 말고 고용주의 실제 공고를 확인하세요." }, source: nswHealthCareers },
    ],
    map: {
      label: { en: "Compare nursing signals by state", ko: "주별 간호 수요 신호 비교" },
      detail: { en: "Start with Jobs and Skills Australia’s state and territory shortage view, then validate a specific hospital or service through its live listing.", ko: "Jobs and Skills Australia의 주·준주 부족직종 화면부터 보고, 특정 병원·서비스는 실제 공고에서 다시 확인하세요." },
      href: "/maps?route=kr-au-registered-nurse",
      source: jobsSkillsShortage,
      signals: [
        { region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Use the Occupation Shortage List’s current state and territory filters rather than treating a national label as a job offer.", ko: "전국 신호를 채용 제안처럼 보지 말고, Occupation Shortage List의 현재 주·준주 필터를 사용하세요." }, readiness: "ready", source: jobsSkillsShortage },
        { region: { en: "Your chosen state", ko: "선택한 주" }, detail: { en: "Hospital systems, registration expectations, and vacancies vary by employer and location. Open a live listing before choosing a city.", ko: "병원 시스템, 등록 기대치, 공석은 고용주와 지역에 따라 다릅니다. 도시를 정하기 전에 실제 공고를 여세요." }, readiness: "partial", source: seekRegisteredNurse },
      ],
    },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, ahpraNursingStandards, nmbaApprovedPrograms, monashNursing, workforceAustralia, seekRegisteredNurse, nswHealthCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-software-engineer",
    candidateId: "software-engineer",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "software-engineer",
    target: { en: "Software Engineer", ko: "소프트웨어 개발자" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["software engineer", "software developer", "developer", "programmer", "개발자", "소프트웨어 개발자", "프로그래머", "컴공"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring software engineering", ko: "한국 여권자가 호주 소프트웨어 개발자 경로를 준비하는 검증 가이드" },
    summary: { en: "This route keeps a degree, visa eligibility, and actual hiring requirements separate. Use it to compare study options with live software-engineering job language and locations.", ko: "이 경로는 학위, 비자 자격, 실제 채용 요건을 분리합니다. 학업 선택지와 실시간 개발자 공고의 요구 역량·지역을 함께 비교하세요." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: {
      status: "conditional",
      label: { en: "Conditionally possible", ko: "조건부 가능" },
      summary: { en: "Software engineering is not nationally licensed in the way nursing is, but employers set their own experience, portfolio, security-clearance, and work-right requirements. A course does not guarantee a job.", ko: "소프트웨어 개발은 간호처럼 전국 단위 면허 직종은 아니지만, 고용주가 경력·포트폴리오·보안 인가·근무 권한을 직접 정합니다. 과정이 취업을 보장하지는 않습니다." },
      source: jobsSkillsShortage,
    },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Choose a target role before buying training", ko: "교육비보다 목표 직무를 먼저 정하기" }, detail: { en: "Compare current listings for software engineer, developer, platform, and security-adjacent roles. The title and stack can change the evidence employers ask for.", ko: "소프트웨어 엔지니어, 개발자, 플랫폼, 보안 인접 직무의 현재 공고를 비교하세요. 직함과 기술 스택에 따라 고용주가 요구하는 증빙이 달라집니다." }, source: seekSoftwareEngineer },
      { title: { en: "Treat a degree as one pathway, not a job guarantee", ko: "학위는 하나의 경로일 뿐, 취업 보장은 아님" }, detail: { en: "Use the provider’s course page to check the current curriculum and entry requirements, then compare it with the role requirements in live listings.", ko: "학교 과정 페이지에서 현재 커리큘럼과 입학 요건을 확인한 뒤, 실시간 공고의 직무 요건과 비교하세요." }, source: unswComputerScience },
      { title: { en: "Check work rights before accepting an offer", ko: "오퍼 수락 전 근무 권한 확인" }, detail: { en: "The employer’s offer and any visa condition must both allow the proposed work. Do not infer work rights from a skills-shortage label.", ko: "고용주의 오퍼와 비자 조건 모두 제안된 근무를 허용해야 합니다. 부족직종 표기만으로 근무 권한을 추정하지 마세요." }, source: homeAffairsKoreaUpdate },
    ],
    courses: [
      { label: { en: "UNSW Bachelor of Computer Science", ko: "UNSW 컴퓨터과학 학사" }, detail: { en: "An official international course page to compare against your target role. Confirm current entry requirements, fees, CoE and course availability directly with the provider.", ko: "목표 직무와 비교할 수 있는 공식 국제학생 과정 페이지입니다. 현재 입학 요건, 학비, CoE, 개설 여부는 학교에 직접 확인하세요." }, url: unswComputerScience.url, linkType: "course", relevance: { en: "A computer-science degree is one study option; individual employers still set hiring requirements.", ko: "컴퓨터과학 학위는 하나의 학업 선택지이며, 개별 고용주가 채용 요건을 정합니다." }, source: unswComputerScience },
    ],
    jobs: [
      { label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; test Software Engineer, Developer, and related titles separately.", ko: "정부 구직 서비스입니다. Software Engineer, Developer 등 관련 직함을 따로 검색해 보세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Use current listings to identify location and work-right requirements.", ko: "현재 공고에서 지역과 근무 권한 요건을 확인하세요." }, source: workforceAustralia },
      { label: { en: "SEEK Software Engineer jobs", ko: "SEEK 소프트웨어 엔지니어 채용" }, detail: { en: "Compare role title, technology stack, seniority, location, and work-right language in current listings.", ko: "현재 공고에서 직함, 기술 스택, 경력 수준, 지역, 근무 권한 표현을 비교하세요." }, url: seekSoftwareEngineer.url, linkType: "job", relevance: { en: "The listing, not a broad field label, is the current hiring source.", ko: "넓은 분야명이 아니라 실제 공고가 최신 채용 근거입니다." }, source: seekSoftwareEngineer },
    ],
    employers: [
      { label: { en: "Atlassian careers", ko: "Atlassian 채용" }, detail: { en: "Employer career page; use current openings to understand role families and hiring requirements.", ko: "고용주 채용 페이지입니다. 현재 공고로 직무군과 채용 요건을 확인하세요." }, url: atlassianCareers.url, linkType: "employer", relevance: { en: "An employer page is a research starting point, not evidence of an offer or visa sponsorship.", ko: "고용주 페이지는 조사 시작점이며, 오퍼나 비자 스폰서의 증거는 아닙니다." }, source: atlassianCareers },
    ],
    map: {
      label: { en: "Compare software-engineering signals before choosing a city", ko: "도시 선택 전 개발자 수요 신호 비교" },
      detail: { en: "Use the official shortage view and live listings together. Neither source should be read as a promise that a particular city or employer will hire you.", ko: "공식 부족직종 화면과 실제 공고를 함께 보세요. 어느 자료도 특정 도시나 고용주가 채용한다는 약속은 아닙니다." },
      href: "/maps?route=kr-au-software-engineer",
      source: jobsSkillsShortage,
      signals: [
        { region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Open the current Jobs and Skills Australia filters before relying on an older shortage claim.", ko: "과거 부족직종 주장에 의존하기 전에 Jobs and Skills Australia의 현재 필터를 여세요." }, readiness: "ready", source: jobsSkillsShortage },
        { region: { en: "Role-specific locations", ko: "직무별 지역" }, detail: { en: "Use live listings to compare the location and work arrangement for your exact role and seniority.", ko: "실시간 공고에서 본인의 정확한 직무·경력 수준에 맞는 근무 지역과 형태를 비교하세요." }, readiness: "partial", source: seekSoftwareEngineer },
      ],
    },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, unswComputerScience, workforceAustralia, seekSoftwareEngineer, atlassianCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-early-childhood-educator",
    candidateId: "early-childhood-educator",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "early-childhood-educator",
    target: { en: "Early Childhood Educator", ko: "유아교육 보육교사" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["early childhood educator", "childcare", "child care", "educator", "차일드 케어", "차일드케어", "보육교사", "유아교육", "어린이집 교사"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring early childhood education and care", ko: "한국 여권자가 호주 유아교육·보육교사 경로를 준비하는 검증 가이드" },
    summary: { en: "This route distinguishes an early childhood educator from an early childhood teacher, then connects qualification checks, study options, job searches, and employer requirements.", ko: "이 경로는 유아교육 보육교사와 유아교사를 구분하고, 자격 확인·학업 선택지·구직·고용주 요건을 연결합니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: {
      status: "conditional",
      label: { en: "Conditionally possible", ko: "조건부 가능" },
      summary: { en: "Qualification expectations differ between educator and teacher roles, and state or employer requirements can add further checks. Do not rely on a broad childcare label alone.", ko: "보육교사와 유아교사는 요구 자격이 다르며 주별·고용주별 추가 확인이 있을 수 있습니다. 넓은 차일드케어 표현만으로 판단하면 안 됩니다." },
      source: acecqaQualified,
    },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Choose educator or teacher before selecting a course", ko: "과정 선택 전 보육교사·유아교사 구분" }, detail: { en: "ACECQA separates early childhood teaching, diploma-level educator, and Certificate III-level educator qualifications. Start by choosing the role you want.", ko: "ACECQA는 유아교사, Diploma 수준 보육교사, Certificate III 수준 보육교사 자격을 구분합니다. 먼저 원하는 역할을 정하세요." }, source: acecqaQualified },
      { title: { en: "Check the approved-qualification list", ko: "승인 자격 목록 확인" }, detail: { en: "If your qualification is not listed, ACECQA explains the individual-assessment route. An assessment result does not by itself guarantee teacher registration or employment.", ko: "보유 자격이 목록에 없으면 ACECQA의 개별 심사 경로를 확인하세요. 심사 결과만으로 교사 등록이나 취업이 보장되지는 않습니다." }, source: acecqaQualified },
      { title: { en: "Read the exact employer listing", ko: "정확한 고용주 공고 읽기" }, detail: { en: "Employers can set checks beyond a qualification, including role, location, and safeguarding requirements. Confirm these before applying or paying for training.", ko: "고용주는 자격 외에도 직무·지역·아동보호 요건을 정할 수 있습니다. 지원이나 교육비 지출 전에 확인하세요." }, source: goodstartCareers },
    ],
    courses: [
      { label: { en: "ACECQA approved qualifications search", ko: "ACECQA 승인 자격 검색" }, detail: { en: "Use the national approved-qualification list to distinguish Certificate III, Diploma, and early-childhood-teaching routes before choosing a provider.", ko: "교육기관을 고르기 전에 국가 승인 자격 목록에서 Certificate III, Diploma, 유아교사 경로를 구분하세요." }, url: acecqaQualified.url, linkType: "course", relevance: { en: "This is the qualification check, not a provider recommendation.", ko: "이 링크는 교육기관 추천이 아니라 자격 확인용입니다." }, source: acecqaQualified },
      { label: { en: "University of Melbourne Master of Teaching (Early Childhood and Primary)", ko: "멜버른대학교 유아·초등 교육 석사" }, detail: { en: "An official course page for an early-childhood-teaching route. It is not interchangeable with every educator role; confirm the role and current requirements first.", ko: "유아교사 경로의 공식 과정 페이지입니다. 모든 보육교사 직무와 동일하지 않으므로, 먼저 직무와 현재 요건을 확인하세요." }, url: melbourneEarlyChildhoodTeaching.url, linkType: "course", relevance: { en: "Use it when you are researching the teacher route, not as a default childcare course.", ko: "일반 차일드케어 과정이 아니라 유아교사 경로를 조사할 때 사용하세요." }, source: melbourneEarlyChildhoodTeaching },
    ],
    jobs: [
      { label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare Early Childhood Educator and Early Childhood Teacher as separate searches.", ko: "정부 구직 서비스입니다. Early Childhood Educator와 Early Childhood Teacher를 별도 검색으로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Current listings show the employer’s exact qualification and safeguarding language.", ko: "현재 공고에서 고용주의 정확한 자격·아동보호 표현을 확인할 수 있습니다." }, source: workforceAustralia },
      { label: { en: "SEEK Early Childhood Educator jobs", ko: "SEEK 유아교육 보육교사 채용" }, detail: { en: "Filter by educator or teacher, state, setting, and qualification wording in current listings.", ko: "현재 공고에서 보육교사·유아교사, 주, 근무 환경, 자격 표현으로 필터링하세요." }, url: seekEarlyChildhoodEducator.url, linkType: "job", relevance: { en: "Do not infer a teacher role from an educator listing, or the reverse.", ko: "보육교사 공고를 유아교사 공고로, 또는 그 반대로 추정하지 마세요." }, source: seekEarlyChildhoodEducator },
    ],
    employers: [
      { label: { en: "Goodstart Early Learning careers", ko: "Goodstart Early Learning 채용" }, detail: { en: "Employer careers page; review the current role, location, and qualification wording in each listing.", ko: "고용주 채용 페이지입니다. 각 공고의 현재 직무, 지역, 자격 표현을 확인하세요." }, url: goodstartCareers.url, linkType: "employer", relevance: { en: "An employer’s own listing is the source for its current hiring requirements.", ko: "고용주의 실제 공고가 현재 채용 요건의 기준입니다." }, source: goodstartCareers },
    ],
    map: {
      label: { en: "Compare early-childhood signals by state", ko: "주별 유아교육 수요 신호 비교" },
      detail: { en: "Use national and state shortage information as a research signal, then verify a particular service or city through live employer listings.", ko: "전국·주별 부족직종 정보는 조사 신호로 사용하고, 특정 서비스·도시는 실제 고용주 공고로 검증하세요." },
      href: "/maps?route=kr-au-early-childhood-educator",
      source: jobsSkillsShortage,
      signals: [
        { region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Open the live Occupation Shortage List and its state filters before relying on a general demand claim.", ko: "일반적인 수요 주장에 의존하기 전에 실시간 Occupation Shortage List와 주별 필터를 여세요." }, readiness: "ready", source: jobsSkillsShortage },
        { region: { en: "Your target service area", ko: "희망 서비스 지역" }, detail: { en: "Use current provider listings to confirm the setting, qualification type, and local requirements before choosing a city.", ko: "도시를 정하기 전에 현재 교육기관 공고에서 근무 환경, 자격 유형, 지역 요건을 확인하세요." }, readiness: "partial", source: goodstartCareers },
      ],
    },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, acecqaQualified, melbourneEarlyChildhoodTeaching, workforceAustralia, seekEarlyChildhoodEducator, goodstartCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-aged-care-worker",
    candidateId: "aged-care-worker",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "aged-care-worker",
    target: { en: "Aged Care Worker", ko: "요양·노인돌봄 종사자" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["aged care", "aged care worker", "personal care worker", "요양", "노인돌봄", "에이지드 케어", "요양보호사"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring aged care work", ko: "한국 여권자가 호주 요양·노인돌봄 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to separate a course option, live job requirements, and employer checks. A care qualification does not replace the screening, experience, or right-to-work requirements in a specific role.", ko: "이 경로는 과정 선택지, 실제 채용 요건, 고용주 확인을 분리합니다. 돌봄 자격만으로 특정 직무의 신원조회·경력·근무 권한 요건이 대체되지는 않습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Employers set role-specific care, screening, immunisation, experience, and work-right requirements. Treat each current listing as the decision source.", ko: "고용주는 직무별 돌봄·신원조회·예방접종·경력·근무 권한 요건을 정합니다. 각 현재 공고를 판단 기준으로 보세요." }, source: seekAgedCareWorker },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Read live listings before choosing a course", ko: "과정 선택 전 실제 공고 읽기" }, detail: { en: "Compare the qualification, shift, screening, and experience wording in current aged-care listings before paying for training.", ko: "교육비를 내기 전에 현재 요양 공고의 자격·교대근무·신원조회·경력 표현을 비교하세요." }, source: seekAgedCareWorker },
      { title: { en: "Check the provider's live course conditions", ko: "교육기관의 현재 과정 조건 확인" }, detail: { en: "Confirm current intake, international eligibility, fee, placement, CoE, and any prerequisite directly with TAFE NSW International.", ko: "현재 입학, 국제학생 대상 여부, 학비, 실습, CoE, 선수요건을 TAFE NSW International에 직접 확인하세요." }, source: tafeAgeingSupport },
      { title: { en: "Verify the employer’s care and screening checks", ko: "고용주의 돌봄·신원조회 확인" }, detail: { en: "Care employers can require checks or evidence beyond a course. Confirm the exact requirement with the employer before accepting an offer.", ko: "돌봄 고용주는 과정 외 추가 조회·증빙을 요구할 수 있습니다. 오퍼 수락 전 해당 고용주에게 정확한 요건을 확인하세요." }, source: bupaCareers },
    ],
    courses: [{ label: { en: "TAFE NSW Certificate IV in Ageing Support", ko: "TAFE NSW 노인돌봄 Certificate IV" }, detail: { en: "An official international course page to evaluate against the role you want. Confirm current delivery and placement conditions with the provider.", ko: "원하는 직무와 비교해 볼 공식 국제학생 과정 페이지입니다. 현재 개설·실습 조건은 교육기관에 확인하세요." }, url: tafeAgeingSupport.url, linkType: "course", relevance: { en: "A course is one study option, not proof that every employer will accept it for every role.", ko: "과정은 하나의 학업 선택지이며, 모든 고용주·직무가 이를 인정한다는 증거는 아닙니다." }, source: tafeAgeingSupport }],
    jobs: [
      { label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare Aged Care Worker, Personal Care Worker, and support-related titles separately.", ko: "정부 구직 서비스입니다. Aged Care Worker, Personal Care Worker 등 관련 직함을 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Use live listings to identify employer and location requirements.", ko: "실시간 공고에서 고용주·지역 요건을 확인하세요." }, source: workforceAustralia },
      { label: { en: "SEEK Aged Care Worker jobs", ko: "SEEK 요양·노인돌봄 채용" }, detail: { en: "Compare current shift, qualification, screening, and work-right wording.", ko: "현재 공고의 교대근무·자격·신원조회·근무 권한 표현을 비교하세요." }, url: seekAgedCareWorker.url, linkType: "job", relevance: { en: "The live listing is the source for the job’s current requirements.", ko: "실제 공고가 직무의 최신 요건 근거입니다." }, source: seekAgedCareWorker },
    ],
    employers: [{ label: { en: "Bupa careers", ko: "Bupa 채용" }, detail: { en: "Employer careers page; open current aged-care roles and verify each location’s requirements.", ko: "고용주 채용 페이지입니다. 현재 요양 직무를 열어 지역별 요건을 확인하세요." }, url: bupaCareers.url, linkType: "employer", relevance: { en: "An employer’s own listing is the source for its current hiring requirements.", ko: "고용주의 실제 공고가 현재 채용 요건의 근거입니다." }, source: bupaCareers }],
    map: { label: { en: "Compare aged-care signals by state", ko: "주별 요양·노인돌봄 신호 비교" }, detail: { en: "Use the national shortage view as a research signal, then validate a chosen area with live employer listings.", ko: "전국 부족직종 화면을 조사 신호로 사용한 뒤, 희망 지역은 실제 고용주 공고로 검증하세요." }, href: "/maps?route=kr-au-aged-care-worker", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Check the current state and territory filters rather than relying on an old national demand claim.", ko: "과거 전국 수요 주장보다 현재 주·준주 필터를 확인하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Your target provider area", ko: "희망 고용주 지역" }, detail: { en: "Compare live provider listings before choosing a city or paying for training.", ko: "도시를 정하거나 교육비를 내기 전에 실제 고용주 공고를 비교하세요." }, readiness: "partial", source: bupaCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, tafeAgeingSupport, workforceAustralia, seekAgedCareWorker, bupaCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-chef",
    candidateId: "chef",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "chef",
    target: { en: "Chef", ko: "셰프·조리사" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["chef", "cook", "commercial cookery", "culinary", "셰프", "요리사", "조리사", "요리"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring chef work", ko: "한국 여권자가 호주 셰프·조리사 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to compare commercial-cookery study with the kitchen experience, roster, food-safety, and work-right requirements in current job listings.", ko: "이 경로는 상업 조리 학업과 실제 공고의 주방 경력·로스터·식품안전·근무 권한 요건을 비교하도록 돕습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Kitchen roles vary materially by venue, seniority, shift pattern, food-safety obligations, and work rights. A cookery course does not guarantee a chef role.", ko: "주방 직무는 업장·경력 수준·교대 패턴·식품안전 의무·근무 권한에 따라 크게 달라집니다. 조리 과정이 셰프 직무를 보장하지는 않습니다." }, source: seekChef },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Choose the kitchen role first", ko: "먼저 목표 주방 직무 정하기" }, detail: { en: "Compare chef, cook, commis, and venue-specific listings. The title changes the experience and roster employers request.", ko: "chef, cook, commis, 업장별 공고를 비교하세요. 직함에 따라 고용주가 요구하는 경력과 로스터가 달라집니다." }, source: seekChef },
      { title: { en: "Confirm the international course facts directly", ko: "국제학생 과정 정보 직접 확인" }, detail: { en: "Check current intake, fee, campus, CoE, and placement conditions on the provider’s live course page before applying.", ko: "지원 전 교육기관의 실제 과정 페이지에서 현재 입학·학비·캠퍼스·CoE·실습 조건을 확인하세요." }, source: tafeCommercialCookery },
      { title: { en: "Use the employer listing for venue-specific conditions", ko: "업장별 조건은 고용주 공고로 확인" }, detail: { en: "Food-safety certificates, weekend work, experience, and work-right expectations must be confirmed in the actual role listing.", ko: "식품안전 증명, 주말 근무, 경력, 근무 권한 요건은 실제 직무 공고에서 확인해야 합니다." }, source: accorCareers },
    ],
    courses: [{ label: { en: "TAFE NSW Certificate III in Commercial Cookery", ko: "TAFE NSW 상업 조리 Certificate III" }, detail: { en: "An official international course page. Confirm the current course and its conditions with the provider before making a payment.", ko: "공식 국제학생 과정 페이지입니다. 결제 전에 현재 과정과 조건을 교육기관에 확인하세요." }, url: tafeCommercialCookery.url, linkType: "course", relevance: { en: "Study option for commercial-cookery research; it does not replace the experience requested in a job ad.", ko: "상업 조리 학업을 위한 선택지이며, 채용공고가 요구하는 경력을 대체하지는 않습니다." }, source: tafeCommercialCookery }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; test chef and cook titles separately.", ko: "정부 구직 서비스입니다. chef와 cook 직함을 따로 검색하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Use live listings for current role requirements.", ko: "현재 직무 요건은 실시간 공고로 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Chef jobs", ko: "SEEK 셰프 채용" }, detail: { en: "Compare venue, cuisine, seniority, roster, and work-right language in current listings.", ko: "현재 공고의 업장·요리 분야·경력 수준·로스터·근무 권한 표현을 비교하세요." }, url: seekChef.url, linkType: "job", relevance: { en: "A live listing is the source of truth for the role.", ko: "실제 공고가 직무의 최신 판단 기준입니다." }, source: seekChef }],
    employers: [{ label: { en: "Accor careers", ko: "Accor 채용" }, detail: { en: "Employer careers page; filter current Australia hospitality roles and read every listing’s requirements.", ko: "고용주 채용 페이지입니다. 현재 호주 호스피탈리티 직무를 필터링하고 각 공고 요건을 읽으세요." }, url: accorCareers.url, linkType: "employer", relevance: { en: "Employer listings show the venue’s actual current requirements.", ko: "고용주 공고가 업장의 실제 최신 요건을 보여줍니다." }, source: accorCareers }],
    map: { label: { en: "Compare hospitality signals before choosing a city", ko: "도시 선택 전 호스피탈리티 신호 비교" }, detail: { en: "Start with the official shortage view and then compare current hospitality listings in the places you would actually live.", ko: "공식 부족직종 화면부터 보고, 실제로 살 곳의 현재 호스피탈리티 공고를 비교하세요." }, href: "/maps?route=kr-au-chef", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Use the live shortage filters as a research signal, not a job offer.", ko: "실시간 부족직종 필터는 채용 제안이 아닌 조사 신호로 사용하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Your target venue area", ko: "희망 업장 지역" }, detail: { en: "Open live venue listings before deciding on a city or course.", ko: "도시나 과정을 정하기 전에 실제 업장 공고를 여세요." }, readiness: "partial", source: accorCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, tafeCommercialCookery, workforceAustralia, seekChef, accorCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-disability-support-worker",
    candidateId: "disability-support-worker",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "disability-support-worker",
    target: { en: "Disability Support Worker", ko: "장애인 지원 종사자" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["disability support", "disability support worker", "support worker", "장애인 지원", "장애인 돌봄", "서포트 워커"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring disability support work", ko: "한국 여권자가 호주 장애인 지원 직종을 준비하는 검증 가이드" },
    summary: { en: "This route distinguishes an international community-services study option from the screening, employer, and live-listing conditions that apply to a particular disability-support role.", ko: "이 경로는 국제학생 커뮤니티 서비스 학업 선택지와 특정 장애인 지원 직무에 적용되는 신원조회·고용주·실제 공고 조건을 구분합니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Registered NDIS providers must screen workers in risk-assessed roles, while exact requirements can vary by role, state, provider, and participant. A course does not replace the employer’s checks.", ko: "등록 NDIS 제공기관은 위험평가 직무 종사자를 심사해야 하며, 정확한 요건은 직무·주·제공기관·참여자에 따라 달라질 수 있습니다. 과정이 고용주의 확인 절차를 대체하지는 않습니다." }, source: ndisWorkerScreening },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Read the NDIS screening rule before applying", ko: "지원 전 NDIS 심사 규정 읽기" }, detail: { en: "For registered providers, risk-assessed roles require an NDIS worker screening check. The provider identifies whether the particular role is risk-assessed.", ko: "등록 제공기관에서는 위험평가 직무에 NDIS 근로자 심사가 필요합니다. 해당 직무가 위험평가 대상인지 제공기관이 판단합니다." }, source: ndisWorkerScreening },
      { title: { en: "Separate a study option from a job requirement", ko: "학업 선택지와 채용 요건 분리" }, detail: { en: "The community-services diploma is a related international study option, not proof that it is the required qualification for every disability-support role.", ko: "커뮤니티 서비스 Diploma는 관련 국제학생 학업 선택지이며, 모든 장애인 지원 직무의 필수 자격이라는 증거는 아닙니다." }, source: tafeCommunityServices },
      { title: { en: "Confirm the exact employer checks", ko: "정확한 고용주 확인 절차 검증" }, detail: { en: "Before accepting an offer, read the live listing for screening, background-check, experience, work-right, and location requirements.", ko: "오퍼 수락 전 실제 공고에서 심사·신원조회·경력·근무 권한·지역 요건을 읽으세요." }, source: endeavourCareers },
    ],
    courses: [{ label: { en: "TAFE NSW Diploma of Community Services", ko: "TAFE NSW 커뮤니티 서비스 Diploma" }, detail: { en: "An official international course page with community-services content and work placement. Confirm entry, fees, CoE, current delivery, and its fit for your exact target role with the provider.", ko: "커뮤니티 서비스 내용과 실습을 포함한 공식 국제학생 과정 페이지입니다. 입학·학비·CoE·현재 개설·목표 직무와의 적합성은 교육기관에 확인하세요." }, url: tafeCommunityServices.url, linkType: "course", relevance: { en: "Related study option, not a universal disability-support qualification or job guarantee.", ko: "관련 학업 선택지이며, 보편적인 장애인 지원 자격 또는 취업 보장은 아닙니다." }, source: tafeCommunityServices }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare disability support and related support-worker titles separately.", ko: "정부 구직 서비스입니다. disability support와 관련 support worker 직함을 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Use current listings for role-specific requirements.", ko: "직무별 최신 요건은 실제 공고로 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Disability Support Worker jobs", ko: "SEEK 장애인 지원 종사자 채용" }, detail: { en: "Compare current role, provider, roster, screening, and work-right wording.", ko: "현재 직무·제공기관·로스터·심사·근무 권한 표현을 비교하세요." }, url: seekDisabilitySupportWorker.url, linkType: "job", relevance: { en: "The live listing is the source of truth for the role’s current conditions.", ko: "실제 공고가 직무의 최신 조건 근거입니다." }, source: seekDisabilitySupportWorker }],
    employers: [{ label: { en: "Endeavour Foundation careers", ko: "Endeavour Foundation 채용" }, detail: { en: "Employer careers page; use current roles to verify provider, location, and screening conditions.", ko: "고용주 채용 페이지입니다. 현재 직무로 제공기관·지역·심사 조건을 확인하세요." }, url: endeavourCareers.url, linkType: "employer", relevance: { en: "Use the employer’s own role listing rather than assuming every support role has the same conditions.", ko: "모든 지원 직무가 같은 조건이라고 가정하지 말고 고용주의 실제 공고를 사용하세요." }, source: endeavourCareers }],
    map: { label: { en: "Compare disability-support signals by state", ko: "주별 장애인 지원 직종 신호 비교" }, detail: { en: "Use the official shortage view as a research signal, then confirm conditions with a live provider listing in the relevant area.", ko: "공식 부족직종 화면을 조사 신호로 사용한 뒤, 관련 지역의 실제 제공기관 공고로 조건을 확인하세요." }, href: "/maps?route=kr-au-disability-support-worker", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Open the live state and territory filters; do not treat a national signal as an offer.", ko: "실시간 주·준주 필터를 열고, 전국 신호를 오퍼로 보지 마세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Your target provider area", ko: "희망 제공기관 지역" }, detail: { en: "Use a current provider role to confirm screening and local conditions before choosing a location.", ko: "지역을 정하기 전에 현재 제공기관 직무로 심사·지역 조건을 확인하세요." }, readiness: "partial", source: endeavourCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, ndisWorkerScreening, tafeCommunityServices, workforceAustralia, seekDisabilitySupportWorker, endeavourCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-beauty-therapist",
    candidateId: "beauty-therapist",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "beauty-therapist",
    target: { en: "Beauty Therapist", ko: "뷰티 테라피스트" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["beauty", "beautician", "beauty therapist", "skin care", "뷰티", "피부관리", "피부 관리사", "에스테티션", "뷰티 테라피스트"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring beauty therapy", ko: "한국 여권자가 호주 뷰티 테라피스트 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to distinguish a beauty-therapy study option from the exact treatment, experience, hygiene, and employer requirements in current roles.", ko: "이 경로는 뷰티 테라피 학업 선택지와 실제 직무의 시술·경력·위생·고용주 요건을 구분해 보여드립니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Beauty roles differ by treatment scope, venue, experience, hygiene requirements, and work rights. A diploma alone is not a job offer or permission to perform every treatment.", ko: "뷰티 직무는 시술 범위·업장·경력·위생 요건·근무 권한에 따라 다릅니다. Diploma만으로 취업이나 모든 시술 수행 권한이 생기지는 않습니다." }, source: seekBeautyTherapist },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Name the treatment and role you want", ko: "원하는 시술과 직무를 구체화" }, detail: { en: "Compare beauty therapist, dermal, spa, and clinic listings separately; employers can ask for different treatment and experience evidence.", ko: "beauty therapist, dermal, spa, clinic 공고를 따로 비교하세요. 고용주마다 시술·경력 증빙이 다를 수 있습니다." }, source: seekBeautyTherapist },
      { title: { en: "Check the provider’s current international course details", ko: "교육기관의 현재 국제학생 과정 확인" }, detail: { en: "Confirm current intake, fee, campus, CoE, and practical-training conditions directly with the provider.", ko: "현재 입학·학비·캠퍼스·CoE·실습 조건을 교육기관에 직접 확인하세요." }, source: tafeBeautyTherapy },
      { title: { en: "Read employer conditions before paying for extra training", ko: "추가 교육비 전 고용주 조건 읽기" }, detail: { en: "Check the live role listing for the treatment scope, hygiene standards, customer-facing experience, and work-right requirements.", ko: "추가 교육비를 내기 전에 실제 공고에서 시술 범위·위생 기준·고객 응대 경력·근무 권한 요건을 확인하세요." }, source: endotaCareers },
    ],
    courses: [{ label: { en: "TAFE NSW Diploma of Beauty Therapy", ko: "TAFE NSW 뷰티 테라피 Diploma" }, detail: { en: "An official international course page to research before applying. Confirm the course’s current availability and conditions directly with the provider.", ko: "지원 전에 검토할 공식 국제학생 과정 페이지입니다. 현재 개설 여부와 조건은 교육기관에 직접 확인하세요." }, url: tafeBeautyTherapy.url, linkType: "course", relevance: { en: "A study option; check each role’s exact treatment and experience requirements separately.", ko: "학업 선택지입니다. 각 직무의 시술·경력 요건은 별도로 확인하세요." }, source: tafeBeautyTherapy }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; test beauty, spa, and clinic titles separately.", ko: "정부 구직 서비스입니다. beauty, spa, clinic 직함을 따로 검색하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Use current listings to compare requirements.", ko: "현재 공고에서 요건을 비교하세요." }, source: workforceAustralia }, { label: { en: "SEEK Beauty Therapist jobs", ko: "SEEK 뷰티 테라피스트 채용" }, detail: { en: "Compare treatment scope, experience, location, and work-right wording in current roles.", ko: "현재 직무의 시술 범위·경력·지역·근무 권한 표현을 비교하세요." }, url: seekBeautyTherapist.url, linkType: "job", relevance: { en: "The live listing is the current role requirement source.", ko: "실제 공고가 현재 직무 요건 근거입니다." }, source: seekBeautyTherapist }],
    employers: [{ label: { en: "endota careers", ko: "endota 채용" }, detail: { en: "Employer careers page; read each current spa role before assuming the same conditions apply elsewhere.", ko: "고용주 채용 페이지입니다. 같은 조건이 다른 곳에도 적용된다고 가정하지 말고 현재 스파 직무를 읽으세요." }, url: endotaCareers.url, linkType: "employer", relevance: { en: "An employer’s own listing is the source for its current treatment and hiring requirements.", ko: "고용주의 실제 공고가 현재 시술·채용 요건의 근거입니다." }, source: endotaCareers }],
    map: { label: { en: "Compare beauty-work signals before choosing a city", ko: "도시 선택 전 뷰티 직무 신호 비교" }, detail: { en: "Use the official shortage view and current employer listings together; neither is a promise of a job.", ko: "공식 부족직종 화면과 현재 고용주 공고를 함께 보세요. 어느 것도 취업 약속은 아닙니다." }, href: "/maps?route=kr-au-beauty-therapist", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Use current official filters as a research signal and check the exact role separately.", ko: "현재 공식 필터를 조사 신호로 사용하고, 정확한 직무는 별도로 확인하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Your target clinic area", ko: "희망 클리닉 지역" }, detail: { en: "Open current spa listings before choosing a city or a course.", ko: "도시나 과정을 정하기 전에 현재 스파 공고를 여세요." }, readiness: "partial", source: endotaCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, tafeBeautyTherapy, workforceAustralia, seekBeautyTherapist, endotaCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-cyber-security-analyst",
    candidateId: "cyber-security-analyst",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "cyber-security-analyst",
    target: { en: "Cyber Security Analyst", ko: "사이버 보안 분석가" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["cyber security", "cybersecurity", "security analyst", "사이버 보안", "보안 분석가", "정보보안"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring cyber security", ko: "한국 여권자가 호주 사이버 보안 분석가 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to compare a cyber-security study option with the seniority, clearance, technical evidence, and work-right conditions in current roles.", ko: "이 경로는 사이버 보안 학업 선택지와 실제 직무의 경력 수준·보안 인가·기술 증빙·근무 권한 조건을 비교하도록 돕습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Cyber-security roles vary by seniority, employer, client access, technical evidence, security-clearance eligibility, and work rights. A degree does not guarantee a role or clearance.", ko: "사이버 보안 직무는 경력 수준·고용주·고객 접근 권한·기술 증빙·보안 인가 자격·근무 권한에 따라 다릅니다. 학위가 직무나 인가를 보장하지는 않습니다." }, source: seekCyberSecurity },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Choose the cyber role and seniority first", ko: "먼저 보안 직무와 경력 수준 정하기" }, detail: { en: "Compare analyst, engineering, SOC, governance, and consulting listings separately; their technical and work-right requirements can be different.", ko: "analyst, engineering, SOC, governance, consulting 공고를 따로 비교하세요. 기술·근무 권한 요건이 다를 수 있습니다." }, source: seekCyberSecurity },
      { title: { en: "Check the current international course facts", ko: "현재 국제학생 과정 정보 확인" }, detail: { en: "Confirm current international entry requirements, fees, location, CoE, and course availability directly with RMIT before applying.", ko: "지원 전 RMIT에 현재 국제학생 입학 요건·학비·지역·CoE·과정 개설 여부를 직접 확인하세요." }, source: rmitCyberSecurity },
      { title: { en: "Treat employer conditions as role-specific", ko: "고용주 조건은 직무별로 보기" }, detail: { en: "Read every live employer listing for its experience, client-access, security, and work-right conditions. Do not infer them from the field name.", ko: "각 실제 고용주 공고에서 경력·고객 접근·보안·근무 권한 조건을 읽으세요. 분야명만으로 추정하지 마세요." }, source: cyberCxCareers },
    ],
    courses: [{ label: { en: "RMIT Bachelor of Cyber Security", ko: "RMIT 사이버 보안 학사" }, detail: { en: "An official university course page for an international study route. Confirm its current international conditions directly with the provider.", ko: "국제학생 학업 경로를 위한 공식 대학 과정 페이지입니다. 현재 국제학생 조건은 교육기관에 직접 확인하세요." }, url: rmitCyberSecurity.url, linkType: "course", relevance: { en: "A study option, not evidence that every cyber role accepts a graduate or sponsors a visa.", ko: "학업 선택지이며, 모든 보안 직무가 신입을 채용하거나 비자를 지원한다는 증거는 아닙니다." }, source: rmitCyberSecurity }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; test analyst, SOC, security engineering, and governance titles separately.", ko: "정부 구직 서비스입니다. analyst, SOC, security engineering, governance 직함을 따로 검색하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Live listings show role-specific conditions.", ko: "실시간 공고에서 직무별 조건을 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Cyber Security jobs", ko: "SEEK 사이버 보안 채용" }, detail: { en: "Compare seniority, skill, clearance, location, and work-right wording in live listings.", ko: "실시간 공고의 경력 수준·기술·인가·지역·근무 권한 표현을 비교하세요." }, url: seekCyberSecurity.url, linkType: "job", relevance: { en: "The listing is the current source for its hiring conditions.", ko: "실제 공고가 해당 채용 조건의 최신 근거입니다." }, source: seekCyberSecurity }],
    employers: [{ label: { en: "CyberCX careers", ko: "CyberCX 채용" }, detail: { en: "Employer careers page; review each current role’s client, security, and location requirements.", ko: "고용주 채용 페이지입니다. 현재 직무별 고객·보안·지역 요건을 검토하세요." }, url: cyberCxCareers.url, linkType: "employer", relevance: { en: "Use the employer’s own listing for its actual role conditions.", ko: "실제 직무 조건은 고용주의 공고를 사용하세요." }, source: cyberCxCareers }],
    map: { label: { en: "Compare cyber-security signals before choosing a city", ko: "도시 선택 전 사이버 보안 신호 비교" }, detail: { en: "Use official shortage information and live employer roles together; neither is a promise of an offer.", ko: "공식 부족직종 정보와 실제 고용주 직무를 함께 보세요. 어느 것도 오퍼 약속은 아닙니다." }, href: "/maps?route=kr-au-cyber-security-analyst", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Open the current state and territory filters before relying on a broad demand claim.", ko: "넓은 수요 주장에 의존하기 전에 현재 주·준주 필터를 여세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Role-specific locations", ko: "직무별 지역" }, detail: { en: "Compare the exact role and work arrangement in live employer listings before choosing a city.", ko: "도시를 정하기 전에 실제 고용주 공고에서 정확한 직무·근무 형태를 비교하세요." }, readiness: "partial", source: cyberCxCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, rmitCyberSecurity, workforceAustralia, seekCyberSecurity, cyberCxCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-electrician",
    candidateId: "electrician",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "electrician",
    target: { en: "Electrician", ko: "전기기사·전기기술자" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["electrician", "electrical trade", "electrical worker", "전기기사", "전기기술자", "전기공", "전기"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring electrical work", ko: "한국 여권자가 호주 전기 기술직 경로를 준비하는 검증 가이드" },
    summary: { en: "This route keeps a trade course, an apprenticeship, NSW licensing, and a live job listing separate. One qualification is not permission to do electrical wiring work.", ko: "이 경로는 기술 과정, 도제, NSW 면허, 실제 구직 공고를 분리합니다. 하나의 자격만으로 전기 배선 작업 권한이 생기지는 않습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Electrical work is regulated. In NSW, wiring work requires an electrical licence or certificate, and approved qualifications and experience are required before application. Check the state where you intend to work.", ko: "전기 작업은 규제됩니다. NSW에서는 배선 작업에 전기 면허 또는 자격증이 필요하며, 신청 전 승인된 자격과 경력이 요구됩니다. 일하려는 주의 규정을 확인하세요." }, source: nswElectricalWork },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Check the state licence before choosing training", ko: "교육 선택 전 주별 면허 확인" }, detail: { en: "NSW is one example: electrical wiring work requires a licence or certificate, with approved qualifications and experience. Other states have their own rules.", ko: "NSW는 예시입니다. 전기 배선 작업에는 승인된 자격·경력에 기반한 면허 또는 자격증이 필요합니다. 다른 주에는 자체 규정이 있습니다." }, source: nswElectricalWork },
      { title: { en: "Verify the course and apprenticeship status", ko: "과정·도제 상태 검증" }, detail: { en: "TAFE NSW lists this Certificate III as an apprenticeship pathway. Confirm current intake, eligibility, employer arrangement, and recognition options before paying.", ko: "TAFE NSW는 이 Certificate III를 도제 경로로 안내합니다. 결제 전 현재 입학·자격·고용주 배정·경력 인정 선택지를 확인하세요." }, source: tafeElectrician },
      { title: { en: "Read the live employer role", ko: "실제 고용주 직무 읽기" }, detail: { en: "Check the role’s licence, supervision, safety, experience, location, and work-right requirements in the actual listing.", ko: "실제 공고에서 면허·감독·안전·경력·지역·근무 권한 요건을 확인하세요." }, source: ventiaCareers },
    ],
    courses: [{ label: { en: "TAFE NSW Certificate III in Electrotechnology Electrician", ko: "TAFE NSW 전기기술 Certificate III" }, detail: { en: "Official course page for an apprenticeship pathway. It is not an international-enrolment promise or an electrical licence by itself.", ko: "도제 경로를 위한 공식 과정 페이지입니다. 국제학생 입학 보장이나 전기 면허 자체가 아닙니다." }, url: tafeElectrician.url, linkType: "course", relevance: { en: "Use it to verify the training pathway; confirm state licensing and live eligibility separately.", ko: "교육 경로 검증에 사용하고, 주별 면허·현재 입학 자격은 별도로 확인하세요." }, source: tafeElectrician }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare electrician and electrical-trade titles separately.", ko: "정부 구직 서비스입니다. electrician과 electrical trade 직함을 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Use live roles for current conditions.", ko: "현재 조건은 실제 직무 공고에서 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Electrician jobs", ko: "SEEK 전기 기술직 채용" }, detail: { en: "Compare licence, experience, location, supervision, and work-right wording in live listings.", ko: "실시간 공고의 면허·경력·지역·감독·근무 권한 표현을 비교하세요." }, url: seekElectrician.url, linkType: "job", relevance: { en: "A live listing is the current job-requirement source.", ko: "실제 공고가 최신 직무 요건의 근거입니다." }, source: seekElectrician }],
    employers: [{ label: { en: "Ventia careers", ko: "Ventia 채용" }, detail: { en: "Employer careers page; use each current electrical role to verify its own licence and location requirements.", ko: "고용주 채용 페이지입니다. 현재 전기 직무마다 면허·지역 요건을 확인하세요." }, url: ventiaCareers.url, linkType: "employer", relevance: { en: "An employer’s listing, not a generic trade label, sets the current role conditions.", ko: "일반 직종명이 아니라 고용주의 공고가 현재 직무 조건을 정합니다." }, source: ventiaCareers }],
    map: { label: { en: "Compare electrical-work signals by state", ko: "주별 전기 기술직 신호 비교" }, detail: { en: "Use official shortage information as a research signal, then check licensing and live employer roles in the state you choose.", ko: "공식 부족직종 정보는 조사 신호로 사용하고, 선택한 주의 면허·실제 고용주 직무를 확인하세요." }, href: "/maps?route=kr-au-electrician", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Check current official filters; they do not replace a state licence check.", ko: "현재 공식 필터를 확인하세요. 이는 주별 면허 확인을 대체하지 않습니다." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Your target state", ko: "희망 주" }, detail: { en: "State licensing and employer conditions must be checked before choosing a city or paying for training.", ko: "도시나 교육을 정하기 전에 주별 면허·고용주 조건을 확인해야 합니다." }, readiness: "partial", source: nswElectricalWork }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, nswElectricalWork, tafeElectrician, workforceAustralia, seekElectrician, ventiaCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-data-analyst",
    candidateId: "data-analyst",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "data-analyst",
    target: { en: "Data Analyst", ko: "데이터 분석가" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["data analyst", "data analytics", "business intelligence", "데이터 분석", "데이터 분석가", "데이터 사이언스"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring data analytics", ko: "한국 여권자가 호주 데이터 분석가 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to compare a data-science degree with the portfolio, tools, seniority, work-right, and domain requirements in live data-analyst roles.", ko: "이 경로는 데이터 사이언스 학위와 실제 데이터 분석 직무의 포트폴리오·도구·경력 수준·근무 권한·도메인 요건을 비교하도록 돕습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Data analyst titles cover different technical stacks, industries, seniority levels, and work-right requirements. A degree is not proof that you meet a particular role’s requirements.", ko: "데이터 분석가 직함은 기술 스택·산업·경력 수준·근무 권한 요건이 서로 다릅니다. 학위만으로 특정 직무 요건 충족이 증명되지는 않습니다." }, source: seekDataAnalyst },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Choose a role family before choosing a course", ko: "과정 선택 전 직무군 정하기" }, detail: { en: "Compare data analyst, BI, product analytics, and data-science listings separately. The tools and experience evidence differ.", ko: "data analyst, BI, product analytics, data science 공고를 따로 비교하세요. 도구·경력 증빙이 다릅니다." }, source: seekDataAnalyst },
      { title: { en: "Check the current international course details", ko: "현재 국제학생 과정 정보 확인" }, detail: { en: "Confirm RMIT’s current entry, fees, location, CoE, and international-study conditions before applying.", ko: "지원 전 RMIT의 현재 입학·학비·지역·CoE·국제학생 학업 조건을 확인하세요." }, source: rmitDataScience },
      { title: { en: "Use employer listings for the real hiring bar", ko: "실제 채용 기준은 고용주 공고로 확인" }, detail: { en: "Read every live role for the domain, tools, seniority, security, and work-right conditions rather than assuming all analyst jobs are equivalent.", ko: "모든 분석가 직무가 같다고 가정하지 말고, 실제 공고에서 도메인·도구·경력 수준·보안·근무 권한 조건을 읽으세요." }, source: atlassianCareers },
    ],
    courses: [{ label: { en: "RMIT Bachelor of Data Science", ko: "RMIT 데이터 사이언스 학사" }, detail: { en: "Official university course page for an international study route. Confirm current international admission and course conditions with RMIT.", ko: "국제학생 학업 경로를 위한 공식 대학 과정 페이지입니다. 현재 국제학생 입학·과정 조건은 RMIT에 확인하세요." }, url: rmitDataScience.url, linkType: "course", relevance: { en: "A related study option, not a guarantee of a data-analyst job.", ko: "관련 학업 선택지이며, 데이터 분석가 취업 보장은 아닙니다." }, source: rmitDataScience }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; test analyst, BI, and data-science titles separately.", ko: "정부 구직 서비스입니다. analyst, BI, data science 직함을 따로 검색하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Live listings provide the current role requirements.", ko: "현재 직무 요건은 실시간 공고로 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Data Analyst jobs", ko: "SEEK 데이터 분석가 채용" }, detail: { en: "Compare tools, portfolio, industry, location, seniority, and work-right wording in live roles.", ko: "실시간 직무의 도구·포트폴리오·산업·지역·경력 수준·근무 권한 표현을 비교하세요." }, url: seekDataAnalyst.url, linkType: "job", relevance: { en: "A live listing is the source for current hiring conditions.", ko: "실제 공고가 현재 채용 조건의 근거입니다." }, source: seekDataAnalyst }],
    employers: [{ label: { en: "Atlassian careers", ko: "Atlassian 채용" }, detail: { en: "Employer careers page; inspect current data-related roles and their exact requirements.", ko: "고용주 채용 페이지입니다. 현재 데이터 관련 직무와 정확한 요건을 확인하세요." }, url: atlassianCareers.url, linkType: "employer", relevance: { en: "Employer listings establish their own current requirements.", ko: "고용주 공고가 자체 최신 요건을 정합니다." }, source: atlassianCareers }],
    map: { label: { en: "Compare data-analytics signals before choosing a city", ko: "도시 선택 전 데이터 분석 신호 비교" }, detail: { en: "Use official shortage information and live role listings together; neither guarantees a job in a city.", ko: "공식 부족직종 정보와 실제 직무 공고를 함께 보세요. 어느 것도 특정 도시 취업을 보장하지 않습니다." }, href: "/maps?route=kr-au-data-analyst", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Use current state and territory filters as a research signal.", ko: "현재 주·준주 필터를 조사 신호로 사용하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Role-specific locations", ko: "직무별 지역" }, detail: { en: "Open current employer roles before choosing a city or course.", ko: "도시나 과정을 정하기 전에 현재 고용주 직무를 여세요." }, readiness: "partial", source: atlassianCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, rmitDataScience, workforceAustralia, seekDataAnalyst, atlassianCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-automotive-technician",
    candidateId: "automotive-technician",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "automotive-technician",
    target: { en: "Automotive Technician", ko: "자동차 정비사" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["automotive technician", "mechanic", "motor mechanic", "automotive", "자동차 정비", "자동차 정비사", "카센터", "메카닉"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring automotive technology", ko: "한국 여권자가 호주 자동차 정비사 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to keep a technical training option separate from the employer’s current vehicle, diagnostic, experience, safety, and work-right requirements.", ko: "이 경로는 기술 교육 선택지와 고용주의 현재 차량·진단·경력·안전·근무 권한 요건을 분리합니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Automotive roles vary by vehicle type, diagnostic tools, trade experience, safety requirements, and work rights. A Certificate III page is not an international-enrolment promise or a job offer.", ko: "자동차 직무는 차량 유형·진단 도구·기술 경력·안전 요건·근무 권한에 따라 다릅니다. Certificate III 페이지는 국제학생 입학 보장이나 채용 제안이 아닙니다." }, source: seekAutomotiveTechnician },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Identify the vehicle and workshop role", ko: "차량·정비소 직무 구체화" }, detail: { en: "Compare light vehicle, diesel, fleet, heavy equipment, and diagnostic roles separately before choosing training.", ko: "교육 선택 전에 light vehicle, diesel, fleet, heavy equipment, diagnostic 직무를 따로 비교하세요." }, source: seekAutomotiveTechnician },
      { title: { en: "Verify course delivery and eligibility", ko: "과정 개설·입학 자격 확인" }, detail: { en: "TAFE NSW lists the Certificate III and its local delivery options. Confirm current international eligibility, apprenticeship arrangement, campus, and recognition options directly with the provider.", ko: "TAFE NSW는 Certificate III와 현지 개설 선택지를 안내합니다. 현재 국제학생 자격·도제 배정·캠퍼스·경력 인정 선택지는 교육기관에 직접 확인하세요." }, source: tafeAutomotive },
      { title: { en: "Use the employer listing for workshop conditions", ko: "정비소 조건은 고용주 공고로 확인" }, detail: { en: "Check the live role for vehicle systems, tools, experience, safety, location, and work-right requirements.", ko: "실제 공고에서 차량 시스템·도구·경력·안전·지역·근무 권한 요건을 확인하세요." }, source: komatsuCareers },
    ],
    courses: [{ label: { en: "TAFE NSW Certificate III in Light Vehicle Mechanical Technology", ko: "TAFE NSW 경승용차 정비 Certificate III" }, detail: { en: "Official technical-course page. Confirm current delivery, eligibility, and apprenticeship conditions directly with TAFE NSW.", ko: "공식 기술 과정 페이지입니다. 현재 개설·입학 자격·도제 조건은 TAFE NSW에 직접 확인하세요." }, url: tafeAutomotive.url, linkType: "course", relevance: { en: "Training research link; it is not an international-enrolment or employment guarantee.", ko: "교육 조사 링크이며, 국제학생 입학이나 취업을 보장하지는 않습니다." }, source: tafeAutomotive }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare automotive technician, motor mechanic, and equipment roles separately.", ko: "정부 구직 서비스입니다. automotive technician, motor mechanic, equipment 직무를 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Current requirements are in live role listings.", ko: "현재 요건은 실제 직무 공고에 있습니다." }, source: workforceAustralia }, { label: { en: "SEEK Automotive Technician jobs", ko: "SEEK 자동차 정비사 채용" }, detail: { en: "Compare vehicle type, diagnostic tools, experience, location, and work-right wording in live listings.", ko: "실시간 공고의 차량 유형·진단 도구·경력·지역·근무 권한 표현을 비교하세요." }, url: seekAutomotiveTechnician.url, linkType: "job", relevance: { en: "The live listing is the current role-requirement source.", ko: "실제 공고가 최신 직무 요건의 근거입니다." }, source: seekAutomotiveTechnician }],
    employers: [{ label: { en: "Komatsu careers", ko: "Komatsu 채용" }, detail: { en: "Employer careers page; inspect current technician and equipment roles for exact requirements.", ko: "고용주 채용 페이지입니다. 현재 기술자·장비 직무의 정확한 요건을 확인하세요." }, url: komatsuCareers.url, linkType: "employer", relevance: { en: "Employer listings set the vehicle and workshop conditions for each role.", ko: "고용주 공고가 각 직무의 차량·정비소 조건을 정합니다." }, source: komatsuCareers }],
    map: { label: { en: "Compare automotive-work signals before choosing a city", ko: "도시 선택 전 자동차 정비 신호 비교" }, detail: { en: "Use official shortage information as a research signal and compare live workshop roles before choosing a location.", ko: "공식 부족직종 정보는 조사 신호로 사용하고, 지역을 정하기 전에 실제 정비소 직무를 비교하세요." }, href: "/maps?route=kr-au-automotive-technician", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Check current official filters before relying on broad demand claims.", ko: "넓은 수요 주장에 의존하기 전에 현재 공식 필터를 확인하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Your target workshop area", ko: "희망 정비소 지역" }, detail: { en: "Open current employer roles to verify local vehicle and workshop conditions.", ko: "현재 고용주 직무를 열어 지역별 차량·정비소 조건을 확인하세요." }, readiness: "partial", source: komatsuCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, tafeAutomotive, workforceAustralia, seekAutomotiveTechnician, komatsuCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-civil-engineer",
    candidateId: "civil-engineer",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "civil-engineer",
    target: { en: "Civil Engineer", ko: "토목 엔지니어" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["civil engineer", "civil engineering", "토목", "토목 엔지니어", "토목공학"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring civil engineering", ko: "한국 여권자가 호주 토목 엔지니어 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to keep a civil-engineering study option separate from a live role’s discipline, project, experience, work-right, and migration requirements.", ko: "이 경로는 토목공학 학업 선택지와 실제 직무의 분야·프로젝트·경력·근무 권한·이민 요건을 분리합니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Civil-engineering roles differ by discipline, project stage, experience, site requirements, and work rights. An engineering degree or a shortage signal does not itself grant a job or a migration outcome.", ko: "토목 엔지니어 직무는 세부 분야·프로젝트 단계·경력·현장 요건·근무 권한에 따라 다릅니다. 공학 학위나 부족직종 신호만으로 취업 또는 이민 결과가 보장되지는 않습니다." }, source: seekCivilEngineer },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Choose the civil discipline before choosing a course", ko: "과정 선택 전 토목 세부 분야 정하기" }, detail: { en: "Compare transport, water, structures, construction, and infrastructure roles separately. Each current listing sets its own tools, site, experience, and work-right requirements.", ko: "교통·수자원·구조·시공·인프라 직무를 따로 비교하세요. 각 실제 공고가 도구·현장·경력·근무 권한 요건을 정합니다." }, source: seekCivilEngineer },
      { title: { en: "Verify the current international course conditions", ko: "현재 국제학생 과정 조건 확인" }, detail: { en: "Confirm RMIT’s current entry, fees, location, CoE, and international-study conditions directly before applying.", ko: "지원 전 RMIT의 현재 입학·학비·지역·CoE·국제학생 학업 조건을 직접 확인하세요." }, source: rmitCivilEngineering },
      { title: { en: "Separate employer hiring from migration assessment", ko: "고용주 채용과 이민 심사 분리" }, detail: { en: "Engineers Australia’s skills assessment is relevant when you are pursuing a migration pathway. It is not a substitute for a job offer or the requirements in a particular employer listing.", ko: "Engineers Australia의 기술심사는 이민 경로를 추진할 때 관련됩니다. 이는 취업 제안이나 특정 고용주 공고의 요건을 대체하지 않습니다." }, source: engineersAustraliaMigrationAssessment },
    ],
    courses: [{ label: { en: "RMIT Bachelor of Engineering (Civil and Infrastructure) (Honours)", ko: "RMIT 토목·인프라 공학 학사" }, detail: { en: "Official university course page for an international study option. Confirm current entry, fees, and course conditions directly with RMIT.", ko: "국제학생 학업 선택지를 위한 공식 대학 과정 페이지입니다. 현재 입학·학비·과정 조건은 RMIT에 직접 확인하세요." }, url: rmitCivilEngineering.url, linkType: "course", relevance: { en: "A study option, not proof that you meet every employer’s role requirements.", ko: "학업 선택지이며, 모든 고용주 직무 요건 충족을 증명하지는 않습니다." }, source: rmitCivilEngineering }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare civil, infrastructure, and project-specific roles separately.", ko: "정부 구직 서비스입니다. civil, infrastructure, 프로젝트별 직무를 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Use live listings for the current role requirements.", ko: "현재 직무 요건은 실시간 공고에서 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Civil Engineer jobs", ko: "SEEK 토목 엔지니어 채용" }, detail: { en: "Compare discipline, project, seniority, site, location, and work-right wording in live listings.", ko: "실시간 공고의 세부 분야·프로젝트·경력 수준·현장·지역·근무 권한 표현을 비교하세요." }, url: seekCivilEngineer.url, linkType: "job", relevance: { en: "The live listing is the source for a role’s current conditions.", ko: "실제 공고가 해당 직무의 최신 조건 근거입니다." }, source: seekCivilEngineer }],
    employers: [{ label: { en: "Aurecon careers", ko: "Aurecon 채용" }, detail: { en: "Employer careers page; inspect current engineering roles and their exact project and eligibility requirements.", ko: "고용주 채용 페이지입니다. 현재 엔지니어링 직무와 정확한 프로젝트·지원 자격 요건을 확인하세요." }, url: aureconCareers.url, linkType: "employer", relevance: { en: "Employer listings set the current requirements for their roles.", ko: "고용주 공고가 자체 직무의 최신 요건을 정합니다." }, source: aureconCareers }],
    map: { label: { en: "Compare civil-engineering signals before choosing a city", ko: "도시 선택 전 토목 엔지니어링 신호 비교" }, detail: { en: "Use the official shortage list as a research signal, then validate a particular city with live project and employer listings.", ko: "공식 부족직종 목록은 조사 신호로 사용하고, 특정 도시는 실제 프로젝트·고용주 공고로 검증하세요." }, href: "/maps?route=kr-au-civil-engineer", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Check current occupation and state filters before relying on a general demand claim.", ko: "일반 수요 주장에 의존하기 전에 현재 직종·주별 필터를 확인하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Project locations", ko: "프로젝트 지역" }, detail: { en: "Open current employer roles to verify project location, site conditions, and eligibility.", ko: "현재 고용주 직무를 열어 프로젝트 지역·현장 조건·지원 자격을 확인하세요." }, readiness: "partial", source: aureconCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, engineersAustraliaMigrationAssessment, rmitCivilEngineering, workforceAustralia, seekCivilEngineer, aureconCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-mechanical-engineer",
    candidateId: "mechanical-engineer",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "mechanical-engineer",
    target: { en: "Mechanical Engineer", ko: "기계 엔지니어" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["mechanical engineer", "mechanical engineering", "기계 엔지니어", "기계공학"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring mechanical engineering", ko: "한국 여권자가 호주 기계 엔지니어 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to compare a mechanical-engineering study option with the systems, sector, site, experience, and work-right requirements in live roles.", ko: "이 경로는 기계공학 학업 선택지와 실제 직무의 시스템·산업·현장·경력·근무 권한 요건을 비교하도록 돕습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Mechanical-engineering roles vary by sector, systems, project stage, licences or site rules, experience, and work rights. A degree does not guarantee a particular role or visa outcome.", ko: "기계 엔지니어 직무는 산업·시스템·프로젝트 단계·면허 또는 현장 규칙·경력·근무 권한에 따라 다릅니다. 학위만으로 특정 직무나 비자 결과가 보장되지는 않습니다." }, source: seekMechanicalEngineer },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Identify the sector and system", ko: "산업과 시스템 구체화" }, detail: { en: "Compare manufacturing, energy, resources, building services, maintenance, and design roles separately before selecting a course.", ko: "과정 선택 전에 제조·에너지·자원·빌딩 서비스·정비·설계 직무를 따로 비교하세요." }, source: seekMechanicalEngineer },
      { title: { en: "Check the live international course facts", ko: "현재 국제학생 과정 정보 확인" }, detail: { en: "Confirm RMIT’s current entry, fees, location, CoE, and international-study conditions directly before applying.", ko: "지원 전 RMIT의 현재 입학·학비·지역·CoE·국제학생 학업 조건을 직접 확인하세요." }, source: rmitMechanicalEngineering },
      { title: { en: "Use the correct path for migration assessment", ko: "이민 심사는 별도 경로로 확인" }, detail: { en: "If you pursue a migration pathway, read Engineers Australia’s current skills-assessment process. It does not replace an employer’s job requirements or create a job offer.", ko: "이민 경로를 추진한다면 Engineers Australia의 현재 기술심사 절차를 확인하세요. 이는 고용주 직무 요건을 대체하거나 취업 제안을 만들지 않습니다." }, source: engineersAustraliaMigrationAssessment },
    ],
    courses: [{ label: { en: "RMIT Bachelor of Engineering (Mechanical Engineering) (Honours)", ko: "RMIT 기계공학 학사" }, detail: { en: "Official university course page for an international study option. Confirm current entry, fees, and course conditions directly with RMIT.", ko: "국제학생 학업 선택지를 위한 공식 대학 과정 페이지입니다. 현재 입학·학비·과정 조건은 RMIT에 직접 확인하세요." }, url: rmitMechanicalEngineering.url, linkType: "course", relevance: { en: "A related study option; live roles still set their own technical and experience requirements.", ko: "관련 학업 선택지이며, 실제 직무는 별도의 기술·경력 요건을 정합니다." }, source: rmitMechanicalEngineering }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare mechanical, maintenance, design, and sector-specific titles separately.", ko: "정부 구직 서비스입니다. mechanical, maintenance, design, 산업별 직함을 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Live listings provide the current role requirements.", ko: "현재 직무 요건은 실시간 공고로 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Mechanical Engineer jobs", ko: "SEEK 기계 엔지니어 채용" }, detail: { en: "Compare systems, sector, seniority, location, site, and work-right wording in live roles.", ko: "실시간 직무의 시스템·산업·경력 수준·지역·현장·근무 권한 표현을 비교하세요." }, url: seekMechanicalEngineer.url, linkType: "job", relevance: { en: "A live listing is the current source for a role’s requirements.", ko: "실제 공고가 해당 직무의 최신 요건 근거입니다." }, source: seekMechanicalEngineer }],
    employers: [{ label: { en: "Worley Australia and New Zealand careers", ko: "Worley 호주·뉴질랜드 채용" }, detail: { en: "Employer careers page; inspect current engineering and project-delivery roles for their exact requirements.", ko: "고용주 채용 페이지입니다. 현재 엔지니어링·프로젝트 수행 직무의 정확한 요건을 확인하세요." }, url: worleyAustraliaCareers.url, linkType: "employer", relevance: { en: "Employer listings set current sector, project, and eligibility conditions.", ko: "고용주 공고가 현재 산업·프로젝트·지원 자격 조건을 정합니다." }, source: worleyAustraliaCareers }],
    map: { label: { en: "Compare mechanical-engineering signals before choosing a city", ko: "도시 선택 전 기계 엔지니어링 신호 비교" }, detail: { en: "Use official shortage information as a research signal, then validate location and project fit with live employer roles.", ko: "공식 부족직종 정보는 조사 신호로 사용하고, 지역·프로젝트 적합성은 실제 고용주 직무로 검증하세요." }, href: "/maps?route=kr-au-mechanical-engineer", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Check current occupation and state filters rather than assuming a national claim applies to every sector.", ko: "전국 수요 주장이 모든 산업에 적용된다고 가정하지 말고 현재 직종·주별 필터를 확인하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Project and employer locations", ko: "프로젝트·고용주 지역" }, detail: { en: "Open live employer roles to verify project location and each role’s conditions.", ko: "현재 고용주 직무를 열어 프로젝트 지역과 각 직무 조건을 확인하세요." }, readiness: "partial", source: worleyAustraliaCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, engineersAustraliaMigrationAssessment, rmitMechanicalEngineering, workforceAustralia, seekMechanicalEngineer, worleyAustraliaCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-accountant",
    candidateId: "accountant",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "accountant",
    target: { en: "Accountant", ko: "회계사·회계 직무" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["accountant", "accounting", "auditor", "회계", "회계사", "회계 직무", "세무"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring accounting", ko: "한국 여권자가 호주 회계 직무 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to compare accounting study with the title, practice area, experience, professional-study, and work-right requirements in live accounting roles.", ko: "이 경로는 회계 학업과 실제 회계 직무의 직함·업무 분야·경력·전문 자격 학습·근무 권한 요건을 비교하도록 돕습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Accounting titles span tax, audit, management accounting, and business services. Employers and professional pathways set different study, experience, and work-right requirements; a degree alone is not a job or practice authorisation.", ko: "회계 직함은 세무·감사·관리회계·비즈니스 서비스를 포괄합니다. 고용주와 전문 경로는 서로 다른 학업·경력·근무 권한 요건을 정하며, 학위만으로 취업이나 업무 권한이 생기지는 않습니다." }, source: seekAccountant },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Name the accounting practice area", ko: "회계 업무 분야부터 정하기" }, detail: { en: "Compare accountant, tax, audit, management-accounting, and business-services listings separately. Their experience and professional-study language differs.", ko: "accountant, tax, audit, management accounting, business services 공고를 따로 비교하세요. 경력·전문 자격 학습 표현이 다릅니다." }, source: seekAccountant },
      { title: { en: "Check current international course conditions", ko: "현재 국제학생 과정 조건 확인" }, detail: { en: "Confirm RMIT’s current entry, fees, location, CoE, and international-study conditions directly before applying.", ko: "지원 전 RMIT의 현재 입학·학비·지역·CoE·국제학생 학업 조건을 직접 확인하세요." }, source: rmitAccounting },
      { title: { en: "Read employer and professional-study wording in the live role", ko: "실제 공고의 고용주·전문 자격 학습 표현 확인" }, detail: { en: "Do not assume every accounting role has the same professional pathway. Check the live listing for the employer’s exact experience, study, and right-to-work requirements.", ko: "모든 회계 직무가 같은 전문 경로를 갖는다고 가정하지 마세요. 실제 공고에서 고용주의 정확한 경력·학습·근무 권한 요건을 확인하세요." }, source: bdoCareers },
    ],
    courses: [{ label: { en: "RMIT Bachelor of Accounting", ko: "RMIT 회계학 학사" }, detail: { en: "Official university course page for an international study option. Confirm current entry, fees, and course conditions directly with RMIT.", ko: "국제학생 학업 선택지를 위한 공식 대학 과정 페이지입니다. 현재 입학·학비·과정 조건은 RMIT에 직접 확인하세요." }, url: rmitAccounting.url, linkType: "course", relevance: { en: "A related study option, not proof of eligibility for every accounting or audit role.", ko: "관련 학업 선택지이며, 모든 회계·감사 직무의 지원 자격을 증명하지는 않습니다." }, source: rmitAccounting }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; test accountant, audit, tax, and finance titles separately.", ko: "정부 구직 서비스입니다. accountant, audit, tax, finance 직함을 따로 검색하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Live listings provide current role requirements.", ko: "현재 직무 요건은 실시간 공고로 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Accountant jobs", ko: "SEEK 회계 직무 채용" }, detail: { en: "Compare practice area, software, experience, location, professional-study, and work-right wording in live listings.", ko: "실시간 공고의 업무 분야·소프트웨어·경력·지역·전문 자격 학습·근무 권한 표현을 비교하세요." }, url: seekAccountant.url, linkType: "job", relevance: { en: "A live listing is the source for current role conditions.", ko: "실제 공고가 현재 직무 조건의 근거입니다." }, source: seekAccountant }],
    employers: [{ label: { en: "BDO Australia careers", ko: "BDO Australia 채용" }, detail: { en: "Employer careers page; inspect current audit, tax, and business-services roles for exact requirements.", ko: "고용주 채용 페이지입니다. 현재 감사·세무·비즈니스 서비스 직무의 정확한 요건을 확인하세요." }, url: bdoCareers.url, linkType: "employer", relevance: { en: "Employer listings set their own current study, experience, and eligibility conditions.", ko: "고용주 공고가 자체 최신 학업·경력·지원 자격 조건을 정합니다." }, source: bdoCareers }],
    map: { label: { en: "Compare accounting signals before choosing a city", ko: "도시 선택 전 회계 직무 신호 비교" }, detail: { en: "Use official shortage information as a research signal, then compare live employer roles by practice area and city.", ko: "공식 부족직종 정보는 조사 신호로 사용하고, 업무 분야와 도시별 실제 고용주 직무를 비교하세요." }, href: "/maps?route=kr-au-accountant", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Check the current official filters before making any broad demand assumption.", ko: "넓은 수요를 가정하기 전에 현재 공식 필터를 확인하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Practice-area locations", ko: "업무 분야별 지역" }, detail: { en: "Use live employer roles to verify the city, practice area, and eligibility requirements.", ko: "실제 고용주 직무로 도시·업무 분야·지원 자격 요건을 검증하세요." }, readiness: "partial", source: bdoCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, rmitAccounting, workforceAustralia, seekAccountant, bdoCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-business-analyst",
    candidateId: "business-analyst",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "business-analyst",
    target: { en: "Business Analyst", ko: "비즈니스 분석가" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["business analyst", "business analytics", "business systems analyst", "비즈니스 분석", "비즈니스 분석가", "사업 분석"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring business analysis", ko: "한국 여권자가 호주 비즈니스 분석가 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to compare a business-analytics study option with the domain, systems, stakeholder, delivery, seniority, and work-right requirements in live business-analyst roles.", ko: "이 경로는 비즈니스 분석 학업 선택지와 실제 비즈니스 분석가 직무의 도메인·시스템·이해관계자·프로젝트 수행·경력 수준·근무 권한 요건을 비교하도록 돕습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Business-analyst titles cover different industries, systems, delivery methods, and seniority levels. A business course does not guarantee that you meet a specific employer’s technical, domain, or work-right requirements.", ko: "비즈니스 분석가 직함은 산업·시스템·프로젝트 수행 방식·경력 수준이 서로 다릅니다. 비즈니스 과정만으로 특정 고용주의 기술·도메인·근무 권한 요건 충족이 보장되지는 않습니다." }, source: seekBusinessAnalyst },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Choose the analyst role family", ko: "분석가 직무군 구체화" }, detail: { en: "Compare business analyst, systems analyst, product analyst, and process analyst listings separately. The domain, tools, and delivery evidence varies.", ko: "business analyst, systems analyst, product analyst, process analyst 공고를 따로 비교하세요. 도메인·도구·프로젝트 수행 증빙이 다릅니다." }, source: seekBusinessAnalyst },
      { title: { en: "Check the current international course facts", ko: "현재 국제학생 과정 정보 확인" }, detail: { en: "Confirm RMIT’s current entry, fees, location, CoE, and international-study conditions directly before applying.", ko: "지원 전 RMIT의 현재 입학·학비·지역·CoE·국제학생 학업 조건을 직접 확인하세요." }, source: rmitBusinessAnalytics },
      { title: { en: "Use live employer roles for the real hiring bar", ko: "실제 채용 기준은 고용주 공고로 확인" }, detail: { en: "Read every live role for its domain, systems, stakeholder, seniority, security, and work-right requirements; do not treat every BA title as interchangeable.", ko: "모든 BA 직함이 같다고 보지 말고 실제 공고에서 도메인·시스템·이해관계자·경력 수준·보안·근무 권한 요건을 읽으세요." }, source: atlassianCareers },
    ],
    courses: [{ label: { en: "RMIT Bachelor of Commerce — Enterprise AI and Business Analytics major", ko: "RMIT 커머스 학사 — Enterprise AI·비즈니스 분석 전공" }, detail: { en: "Official university course-major page for an international study option. Confirm the full course, entry, and international-study conditions directly with RMIT.", ko: "국제학생 학업 선택지를 위한 공식 대학 전공 페이지입니다. 전체 과정·입학·국제학생 학업 조건은 RMIT에 직접 확인하세요." }, url: rmitBusinessAnalytics.url, linkType: "course", relevance: { en: "A related study option, not a guarantee of a business-analyst role.", ko: "관련 학업 선택지이며, 비즈니스 분석가 취업을 보장하지는 않습니다." }, source: rmitBusinessAnalytics }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare business, systems, product, and process-analysis titles separately.", ko: "정부 구직 서비스입니다. business, systems, product, process analysis 직함을 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Live listings provide the current role requirements.", ko: "현재 직무 요건은 실시간 공고로 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Business Analyst jobs", ko: "SEEK 비즈니스 분석가 채용" }, detail: { en: "Compare domain, systems, delivery method, seniority, location, and work-right wording in live roles.", ko: "실시간 직무의 도메인·시스템·프로젝트 수행 방식·경력 수준·지역·근무 권한 표현을 비교하세요." }, url: seekBusinessAnalyst.url, linkType: "job", relevance: { en: "A live listing is the source for current hiring conditions.", ko: "실제 공고가 현재 채용 조건의 근거입니다." }, source: seekBusinessAnalyst }],
    employers: [{ label: { en: "Atlassian careers", ko: "Atlassian 채용" }, detail: { en: "Employer careers page; inspect current business, product, and technology roles for exact requirements.", ko: "고용주 채용 페이지입니다. 현재 비즈니스·프로덕트·기술 직무의 정확한 요건을 확인하세요." }, url: atlassianCareers.url, linkType: "employer", relevance: { en: "Employer listings establish their own current requirements.", ko: "고용주 공고가 자체 최신 요건을 정합니다." }, source: atlassianCareers }],
    map: { label: { en: "Compare business-analysis signals before choosing a city", ko: "도시 선택 전 비즈니스 분석 신호 비교" }, detail: { en: "Use official shortage information and live role listings together; neither guarantees a role in a particular city.", ko: "공식 부족직종 정보와 실제 직무 공고를 함께 보세요. 어느 것도 특정 도시의 취업을 보장하지 않습니다." }, href: "/maps?route=kr-au-business-analyst", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Use current state and territory filters as a research signal.", ko: "현재 주·준주 필터를 조사 신호로 사용하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Role-specific locations", ko: "직무별 지역" }, detail: { en: "Open current employer roles before choosing a city or course.", ko: "도시나 과정을 정하기 전에 현재 고용주 직무를 여세요." }, readiness: "partial", source: atlassianCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, rmitBusinessAnalytics, workforceAustralia, seekBusinessAnalyst, atlassianCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-social-worker",
    candidateId: "social-worker",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "social-worker",
    target: { en: "Social Worker", ko: "사회복지사" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["social worker", "social work", "community worker", "사회복지사", "사회복지", "소셜 워커"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring social work", ko: "한국 여권자가 호주 사회복지사 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to distinguish an accredited social-work study path from the client group, placement, screening, experience, and work-right requirements in a live role.", ko: "이 경로는 인증된 사회복지 학업 경로와 실제 직무의 대상자·실습·신원조회·경력·근무 권한 요건을 구분합니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "Social-work roles differ by setting, client group, placement history, screening, experience, and work rights. An accredited course does not replace the requirements of a particular employer or role.", ko: "사회복지 직무는 근무 환경·대상자·실습 이력·신원조회·경력·근무 권한에 따라 다릅니다. 인증된 과정도 특정 고용주나 직무의 요건을 대체하지 않습니다." }, source: seekSocialWorker },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Start with an accredited qualifying course", ko: "인증된 진입 과정부터 확인" }, detail: { en: "AASW accredits social-work programs. Check the current accreditation and the exact course status before enrolling; do not infer it from a similar community-services course.", ko: "AASW는 사회복지 과정을 인증합니다. 등록 전 현재 인증과 정확한 과정 상태를 확인하고, 유사한 커뮤니티 서비스 과정에서 추정하지 마세요." }, source: aaswAccreditation },
      { title: { en: "Check course entry and placement conditions", ko: "과정 입학·실습 조건 확인" }, detail: { en: "Confirm current entry, fees, placement, location, CoE, and international-study conditions directly with the provider before applying.", ko: "지원 전 교육기관에 현재 입학·학비·실습·지역·CoE·국제학생 학업 조건을 직접 확인하세요." }, source: melbourneSocialWork },
      { title: { en: "Read the client and screening requirements in live roles", ko: "실제 공고의 대상자·신원조회 요건 확인" }, detail: { en: "Employers can set role-specific screening, experience, safeguarding, and work-right requirements. Check these before choosing a city or paying for study.", ko: "고용주는 직무별 신원조회·경력·보호 의무·근무 권한 요건을 정할 수 있습니다. 도시나 학업을 정하기 전에 확인하세요." }, source: nswHealthCareers },
    ],
    courses: [{ label: { en: "University of Melbourne Master of Social Work", ko: "멜버른대학교 사회복지 석사" }, detail: { en: "Official course page for a social-work study route. Confirm current international eligibility, entry requirements, fees, and placement details directly with the university.", ko: "사회복지 학업 경로를 위한 공식 과정 페이지입니다. 현재 국제학생 자격·입학 요건·학비·실습 내용은 대학에 직접 확인하세요." }, url: melbourneSocialWork.url, linkType: "course", relevance: { en: "Use it alongside AASW’s accreditation information, not as a blanket employment guarantee.", ko: "광범위한 취업 보장이 아니라 AASW 인증 정보와 함께 확인하세요." }, source: melbourneSocialWork }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare social-work, case-management, and community-role titles separately.", ko: "정부 구직 서비스입니다. social work, case management, community 직함을 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Live listings provide current role requirements.", ko: "현재 직무 요건은 실시간 공고로 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK Social Worker jobs", ko: "SEEK 사회복지사 채용" }, detail: { en: "Compare client group, registration or accreditation wording, screening, experience, location, and work-right requirements in live listings.", ko: "실시간 공고의 대상자·등록 또는 인증 표현·신원조회·경력·지역·근무 권한 요건을 비교하세요." }, url: seekSocialWorker.url, linkType: "job", relevance: { en: "A live listing is the source for a role’s current requirements.", ko: "실제 공고가 해당 직무의 최신 요건 근거입니다." }, source: seekSocialWorker }],
    employers: [{ label: { en: "NSW Health careers", ko: "NSW Health 채용" }, detail: { en: "Employer careers page; inspect current health and social-work-related roles for their exact requirements.", ko: "고용주 채용 페이지입니다. 현재 보건·사회복지 관련 직무의 정확한 요건을 확인하세요." }, url: nswHealthCareers.url, linkType: "employer", relevance: { en: "Employer listings establish their own current eligibility conditions.", ko: "고용주 공고가 자체 최신 지원 자격 조건을 정합니다." }, source: nswHealthCareers }],
    map: { label: { en: "Compare social-work signals before choosing a city", ko: "도시 선택 전 사회복지 직무 신호 비교" }, detail: { en: "Use official shortage information as a research signal, then validate the setting and role conditions with live employer listings.", ko: "공식 부족직종 정보는 조사 신호로 사용하고, 근무 환경·직무 조건은 실제 고용주 공고로 검증하세요." }, href: "/maps?route=kr-au-social-worker", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Check current occupation and state filters before relying on a broad demand claim.", ko: "일반 수요 주장에 의존하기 전에 현재 직종·주별 필터를 확인하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Service and employer locations", ko: "서비스·고용주 지역" }, detail: { en: "Open current employer roles to verify client setting, location, and screening conditions.", ko: "현재 고용주 직무를 열어 대상자 환경·지역·신원조회 조건을 확인하세요." }, readiness: "partial", source: nswHealthCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, aaswAccreditation, melbourneSocialWork, workforceAustralia, seekSocialWorker, nswHealthCareers, jobsSkillsShortage],
  },
  {
    id: "kr-au-ui-ux-designer",
    candidateId: "ui-ux-designer",
    origin: { code: "KR", slug: "south-korea", name: { en: "South Korea", ko: "대한민국" } },
    destination: { code: "AU", slug: "australia", name: { en: "Australia", ko: "호주" } },
    slug: "ui-ux-designer",
    target: { en: "UI / UX Designer", ko: "UI·UX 디자이너" },
    goals: ["work", "study", "study-to-work"],
    searchTerms: ["ui designer", "ux designer", "product designer", "user experience", "ui", "ux", "uiux", "ux 디자이너", "프로덕트 디자이너"],
    title: { en: "A source-backed Australia route for a Korean passport holder exploring UI and UX design", ko: "한국 여권자가 호주 UI·UX 디자이너 경로를 준비하는 검증 가이드" },
    summary: { en: "Use this route to compare a digital-media study option with the portfolio, research, product, technical, seniority, and work-right requirements in live design roles.", ko: "이 경로는 디지털 미디어 학업 선택지와 실제 디자인 직무의 포트폴리오·리서치·프로덕트·기술·경력 수준·근무 권한 요건을 비교하도록 돕습니다." },
    lastVerified: "2026-07-29",
    publication: { status: "published", gates: { visa: true, preparation: true, jobs: true, courses: true, map: true } },
    availability: { status: "conditional", label: { en: "Conditionally possible", ko: "조건부 가능" }, summary: { en: "UI, UX, product, and digital-design titles have different portfolio, research, product, tool, seniority, and work-right requirements. A design degree does not guarantee a particular job.", ko: "UI, UX, product, digital design 직함은 포트폴리오·리서치·프로덕트·도구·경력 수준·근무 권한 요건이 다릅니다. 디자인 학위만으로 특정 직무가 보장되지는 않습니다." }, source: seekUiDesigner },
    visa: koreaAustraliaStudyOrWorkVisa,
    preparation: [
      { title: { en: "Name the design role before choosing study", ko: "과정 선택 전 디자인 직무 구체화" }, detail: { en: "Compare UI, UX, product, interaction, and digital-designer listings separately. Each asks for different portfolio and delivery evidence.", ko: "UI, UX, product, interaction, digital designer 공고를 따로 비교하세요. 각 직무가 다른 포트폴리오·프로젝트 수행 증빙을 요구합니다." }, source: seekUiDesigner },
      { title: { en: "Check the current international course facts", ko: "현재 국제학생 과정 정보 확인" }, detail: { en: "Confirm RMIT’s current entry, selection task, fees, location, CoE, and international-study conditions directly before applying.", ko: "지원 전 RMIT의 현재 입학·선발 과제·학비·지역·CoE·국제학생 학업 조건을 직접 확인하세요." }, source: rmitDigitalMedia },
      { title: { en: "Use employer roles for the actual portfolio bar", ko: "실제 포트폴리오 기준은 고용주 공고로 확인" }, detail: { en: "Read live roles for their product domain, portfolio, research, systems, seniority, security, and work-right conditions rather than treating every UX title as the same.", ko: "모든 UX 직함이 같다고 보지 말고 실제 공고에서 프로덕트 도메인·포트폴리오·리서치·시스템·경력 수준·보안·근무 권한 조건을 읽으세요." }, source: atlassianCareers },
    ],
    courses: [{ label: { en: "RMIT Bachelor of Design (Digital Media)", ko: "RMIT 디지털 미디어 디자인 학사" }, detail: { en: "Official university course page for a related international study option. Confirm current entry, selection task, fees, and course conditions directly with RMIT.", ko: "관련 국제학생 학업 선택지를 위한 공식 대학 과정 페이지입니다. 현재 입학·선발 과제·학비·과정 조건은 RMIT에 직접 확인하세요." }, url: rmitDigitalMedia.url, linkType: "course", relevance: { en: "A related study option, not proof that you meet every UI or UX role’s portfolio requirements.", ko: "관련 학업 선택지이며, 모든 UI·UX 직무의 포트폴리오 요건 충족을 증명하지는 않습니다." }, source: rmitDigitalMedia }],
    jobs: [{ label: { en: "Workforce Australia", ko: "Workforce Australia" }, detail: { en: "Government job search; compare UI, UX, product, and interaction-design titles separately.", ko: "정부 구직 서비스입니다. UI, UX, product, interaction design 직함을 따로 비교하세요." }, url: workforceAustralia.url, linkType: "job", relevance: { en: "Live listings provide current role requirements.", ko: "현재 직무 요건은 실시간 공고로 확인하세요." }, source: workforceAustralia }, { label: { en: "SEEK UI Designer jobs", ko: "SEEK UI 디자이너 채용" }, detail: { en: "Compare portfolio, research, tools, product domain, seniority, location, and work-right wording in live listings.", ko: "실시간 공고의 포트폴리오·리서치·도구·프로덕트 도메인·경력 수준·지역·근무 권한 표현을 비교하세요." }, url: seekUiDesigner.url, linkType: "job", relevance: { en: "A live listing is the source for current hiring conditions.", ko: "실제 공고가 현재 채용 조건의 근거입니다." }, source: seekUiDesigner }],
    employers: [{ label: { en: "Atlassian careers", ko: "Atlassian 채용" }, detail: { en: "Employer careers page; inspect current design and product roles for their exact requirements.", ko: "고용주 채용 페이지입니다. 현재 디자인·프로덕트 직무의 정확한 요건을 확인하세요." }, url: atlassianCareers.url, linkType: "employer", relevance: { en: "Employer listings establish their own current requirements.", ko: "고용주 공고가 자체 최신 요건을 정합니다." }, source: atlassianCareers }],
    map: { label: { en: "Compare design-role signals before choosing a city", ko: "도시 선택 전 디자인 직무 신호 비교" }, detail: { en: "Use official shortage information and live role listings together; neither guarantees a role in a particular city.", ko: "공식 부족직종 정보와 실제 직무 공고를 함께 보세요. 어느 것도 특정 도시의 취업을 보장하지 않습니다." }, href: "/maps?route=kr-au-ui-ux-designer", source: jobsSkillsShortage, signals: [{ region: { en: "Australia-wide", ko: "호주 전역" }, detail: { en: "Use current state and territory filters as a research signal.", ko: "현재 주·준주 필터를 조사 신호로 사용하세요." }, readiness: "ready", source: jobsSkillsShortage }, { region: { en: "Role-specific locations", ko: "직무별 지역" }, detail: { en: "Open current employer roles before choosing a city or course.", ko: "도시나 과정을 정하기 전에 현재 고용주 직무를 여세요." }, readiness: "partial", source: atlassianCareers }] },
    sources: [homeAffairsKoreaUpdate, homeAffairsStudent500, homeAffairsGraduate485, homeAffairsConditions, rmitDigitalMedia, workforceAustralia, seekUiDesigner, atlassianCareers, jobsSkillsShortage],
  },
] as const

/**
 * A route is a destination-and-role result, not a nationality landing page.
 * Passport-specific conditions remain inside the evidence, while the public
 * address stays durable as we add more origin-country research.
 */
export function routeGuideHref(guide: Pick<RouteGuide, "destination" | "slug">) {
  return `/routes/${guide.destination.slug}/${guide.slug}`
}

export function legacyRouteGuideHref(guide: Pick<RouteGuide, "origin" | "destination" | "slug">) {
  return `/routes/${guide.origin.slug}/${guide.destination.slug}/${guide.slug}`
}

export function getRouteGuide(origin: string, destination: string, slug: string) {
  return ROUTE_GUIDES.find(
    (guide) =>
      guide.origin.slug === origin.toLowerCase() &&
      guide.destination.slug === destination.toLowerCase() &&
      guide.slug === slug.toLowerCase(),
  ) ?? null
}

export function getRouteGuideForDestination(destination: string, slug: string) {
  return ROUTE_GUIDES.find(
    (guide) =>
      guide.destination.slug === destination.toLowerCase() &&
      guide.slug === slug.toLowerCase(),
  ) ?? null
}

export function getRouteGuideById(id: string) {
  return ROUTE_GUIDES.find((guide) => guide.id === id) ?? null
}
