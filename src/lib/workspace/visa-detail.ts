/**
 * Visa detail data for the Visas explorer detail panel.
 *
 * Populated for a first set of visas so the detail UI has real content to
 * render (sample figures from official German sources). Priority-country
 * breakdowns (AU, CA, US) are added next; every other visa falls back to the
 * catalog entry with a "being researched" state.
 */

export type VisaProcessStep = {
  step: string
  duration: string
  note?: string
}

export type VisaCostItem = {
  item: string
  amount: number
  optional?: boolean
}

export type VisaDetail = {
  status?: string
  processingTime: string
  duration?: string
  minSalary?: string
  successRate?: string
  requirements: string[]
  process: VisaProcessStep[]
  totalEstimatedTime: string
  costBreakdown: {
    currency: string
    items: VisaCostItem[]
  }
  costNote: string
  topCities: string[]
}

export const visaDetailKey = (countryCode: string, name: string) => `${countryCode}:${name}`

export const VISA_DETAILS: Record<string, VisaDetail> = {
  "DE:EU Blue Card": {
    status: "Long-term",
    processingTime: "6 – 12 weeks",
    minSalary: "€45,300 / year",
    successRate: "85%",
    requirements: [
      "Bachelor's degree or higher in a recognised field",
      "Valid job offer in Germany with a salary of at least €45,300 per year (2026 threshold)",
      "Recognised or comparable professional qualification",
      "Valid passport and health insurance covering Germany",
      "Proof of qualifications and work experience where required",
    ],
    process: [
      { step: "Application submission", duration: "1 – 2 weeks", note: "Gather documents and book an appointment at the embassy or consulate." },
      { step: "Application processing", duration: "6 – 12 weeks", note: "The embassy reviews your documents and verifies the job offer." },
      { step: "Visa issuance", duration: "1 – 2 weeks", note: "Collect your visa and arrange your move. Register your address on arrival." },
    ],
    totalEstimatedTime: "2 – 4 months",
    costBreakdown: {
      currency: "EUR",
      items: [
        { item: "Visa application fee", amount: 75 },
        { item: "Residence permit fee", amount: 100 },
        { item: "Processing service (optional)", amount: 150, optional: true },
        { item: "Document translation", amount: 80 },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Berlin", "Munich", "Hamburg"],
  },

  "DE:Job Seeker Visa": {
    status: "Job Search",
    processingTime: "2 – 6 weeks",
    duration: "Up to 6 months",
    successRate: "70%",
    requirements: [
      "University degree recognised in Germany or currently in the recognition process",
      "Proof of sufficient funds to support yourself during the stay",
      "Health insurance valid in Germany",
      "Valid passport",
      "CV and proof of qualifications",
    ],
    process: [
      { step: "Application submission", duration: "1 week", note: "Book an appointment and submit your documents." },
      { step: "Application processing", duration: "2 – 6 weeks", note: "The embassy verifies your qualifications and funds." },
      { step: "Visa issuance", duration: "1 week", note: "Travel to Germany and register your job search." },
    ],
    totalEstimatedTime: "1 – 2 months",
    costBreakdown: {
      currency: "EUR",
      items: [
        { item: "Visa application fee", amount: 75 },
        { item: "Document translation", amount: 80 },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Berlin", "Munich", "Frankfurt"],
  },

  "DE:Family Reunion Visa": {
    status: "Long-term",
    processingTime: "8 – 12 weeks",
    duration: "1 – 3 years",
    successRate: "90%",
    requirements: [
      "Valid residence status of the family member already in Germany",
      "Proof of family relationship (marriage or birth certificate)",
      "Basic German language skills (A1) in most cases",
      "Sufficient living space for the family",
      "Health insurance and proof of financial means",
    ],
    process: [
      { step: "Application submission", duration: "1 – 2 weeks", note: "Submit the application at the embassy with translated documents." },
      { step: "Application processing", duration: "8 – 12 weeks", note: "German authorities verify the family member's status and your language level." },
      { step: "Visa issuance", duration: "1 – 2 weeks", note: "Collect the visa and make travel arrangements." },
    ],
    totalEstimatedTime: "2 – 3 months",
    costBreakdown: {
      currency: "EUR",
      items: [
        { item: "Visa application fee", amount: 75 },
        { item: "Document translation", amount: 80 },
        { item: "Processing service (optional)", amount: 150, optional: true },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Berlin", "Hamburg", "Munich"],
  },

  "DE:Student visa": {
    status: "Temporary",
    processingTime: "4 – 8 weeks",
    duration: "Course duration",
    successRate: "80%",
    requirements: [
      "Admission letter from a German university or preparatory course",
      "Proof of financial resources (blocked account, approx. €11,904 per year)",
      "Valid health insurance",
      "Valid passport",
      "Proof of academic qualifications (school leaving certificate, transcripts)",
    ],
    process: [
      { step: "Application submission", duration: "1 week", note: "Book an appointment at the embassy or consulate." },
      { step: "Application processing", duration: "4 – 8 weeks", note: "The embassy verifies your admission and funding." },
      { step: "Visa issuance", duration: "1 week", note: "Travel to Germany and enrol at your university." },
    ],
    totalEstimatedTime: "1 – 2 months",
    costBreakdown: {
      currency: "EUR",
      items: [
        { item: "Visa application fee", amount: 75 },
        { item: "Document translation", amount: 80 },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Berlin", "Munich", "Cologne"],
  },

  "DE:Working Holiday": {
    status: "Temporary",
    processingTime: "2 – 4 weeks",
    duration: "Up to 12 months",
    successRate: "75%",
    requirements: [
      "Age within the limit set by your country's bilateral agreement",
      "Valid passport",
      "Proof of sufficient funds for your first months in Germany",
      "Valid health insurance",
      "Return ticket or funds to purchase one",
    ],
    process: [
      { step: "Application submission", duration: "1 week", note: "Apply at the embassy with proof of funds and insurance." },
      { step: "Application processing", duration: "2 – 4 weeks", note: "The embassy verifies your eligibility for the agreement." },
      { step: "Visa issuance", duration: "1 week", note: "Collect the visa and travel to Germany." },
    ],
    totalEstimatedTime: "3 – 6 weeks",
    costBreakdown: {
      currency: "EUR",
      items: [{ item: "Working holiday visa fee", amount: 75 }],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Berlin", "Munich", "Hamburg"],
  },

  // ── Australia ──

  "AU:Student visa": {
    status: "Temporary",
    processingTime: "4 – 8 weeks",
    duration: "Maximum length of course + 2 months",
    minSalary: "Source pending",
    successRate: "Pending — see notes",
    requirements: [
      "Confirmation of Enrolment (CoE) from an Australian education provider",
      "Evidence of sufficient funds to cover tuition, travel and living costs (AUD 21,041/year living cost as per the DHS cost of living standard)",
      "English language proficiency (minimum IELTS 5.5 or equivalent)",
      "Overseas Student Health Cover (OSHC) for the duration of stay",
      "Genuine Temporary Entrant (GTE) statement — no intention to stay permanently",
      "Valid passport and health and character requirements",
    ],
    process: [
      { step: "Receive Confirmation of Enrolment (CoE)", duration: "1 – 4 weeks", note: "After acceptance by an Australian CRICOS-registered provider." },
      { step: "Prepare documents & submit application", duration: "1 – 2 weeks", note: "Compile CoE, financial evidence, OSHC, passport, English results." },
      { step: "Visa application processing", duration: "4 – 8 weeks", note: "DHS assesses GTE compliance, financial capacity and character." },
      { step: "Visa grant and travel", duration: "1 – 2 weeks", note: "Travel to Australia; check-in with your provider on arrival." },
    ],
    totalEstimatedTime: "2 – 3 months",
    costBreakdown: {
      currency: "AUD",
      items: [
        { item: "Visa application fee (Subclass 500)", amount: 620 },
        { item: "Overseas Student Health Cover (OSHC), per year", amount: 600, optional: true },
        { item: "Overseas Student Health Cover (OSHC), per year (concession/low-cost)", amount: 300, optional: true },
      ],
    },
    costNote: "Tuition fees vary by provider and course; living costs not included. OSHC is mandatory — check providers for annual rates. Costs may vary. Check official sources.",
    topCities: ["Sydney", "Melbourne", "Brisbane"],
  },

  "AU:Working Holiday": {
    status: "Working holiday",
    processingTime: "2 – 4 weeks",
    duration: "Up to 12 months (extendable to 3 years for second/third visa)",
    minSalary: "Source pending",
    successRate: "Pending — see notes",
    requirements: [
      "Age 18–30 (or 35 for some eligible countries — check latest subclass rules)",
      "Nominal qualifying funds (AUD 5,000 recommended minimum)",
      "Health insurance (not mandatory for WH but strongly recommended)",
      "Valid passport from an eligible country with a bilateral WH agreement with Australia",
      "No dependents (single status required for primary applicants)",
    ],
    process: [
      { step: "Prepare documents & submit application", duration: "1 week", note: "Online via ImmiAccount; gather passport, funds evidence, health insurance." },
      { step: "Visa application processing", duration: "2 – 4 weeks", note: "DHS checks eligibility against bilateral WH agreement criteria." },
      { step: "Visa grant and travel", duration: "1 – 2 weeks", note: "Travel to Australia; check visa conditions (work for same employer max 6 months)." },
    ],
    totalEstimatedTime: "3 – 6 weeks",
    costBreakdown: {
      currency: "AUD",
      items: [
        { item: "Working Holiday visa application fee (Subclass 417)", amount: 635 },
        { item: "Health insurance (recommended per year)", amount: 300, optional: true },
      ],
    },
    costNote: "Tuition not included (this is a work-travel visa). Costs may vary. Check official sources.",
    topCities: ["Sydney", "Melbourne", "Brisbane"],
  },

  "AU:Temporary Graduate": {
    status: "Temporary",
    processingTime: "4 – 6 months (varies by stream)",
    duration: "2 – 6 years depending on qualification level",
    minSalary: "Source pending",
    successRate: "Pending — see notes",
    requirements: [
      "Completed an eligible Australian course at CRICOS-registered provider ( Bachelor or higher / Diploma/Advanced Diploma for specific streams)",
      "Meets Genuine Temporary Entrant requirements",
      "English language proficiency (typically IELTS 6.0+ or equivalent)",
      "Health and character requirements",
      "Meets the requirements of the specific stream (Post-Study Work stream vs. Training Professional stream)",
    ],
    process: [
      { step: "Complete qualifying course & receive graduation evidence", duration: "Varies by course" },
      { step: "Submit application (online via ImmiAccount)", duration: "1 – 2 weeks" },
      { step: "Visa processing (DHS assessment)", duration: "4 – 6 months", note: "Processing times vary by stream and individual circumstances." },
      { step: "Visa grant — begin work in Australia legally", duration: "1 – 2 weeks" },
    ],
    totalEstimatedTime: "6 – 12 months (from course completion to visa grant)",
    costBreakdown: {
      currency: "AUD",
      items: [
        { item: "Visa application fee (Subclass 485 primary applicant)", amount: 1885 },
        { item: "Skill assessment fee (where applicable)", amount: 400, optional: true },
        { item: "Processing service (optional)", amount: 500, optional: true },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Sydney", "Melbourne", "Brisbane"],
  },

  "AU:Skilled Independent": {
    status: "Skilled",
    processingTime: "6 – 12 months (varies by invitation order)",
    duration: "Permanent",
    minSalary: "Source pending",
    successRate: "Pending — see notes",
    requirements: [
      "Age under 45 at time of invitation",
      "English language proficiency (IELTS 6.0+ in each band or equivalent)",
      "Skills assessment for nominated occupation from designated assessing authority",
      "Meet the points test threshold (65 points minimum; actual invite scores vary annually)",
      "Meets health and character requirements",
      "No sponsor or nominator required for Skilled Independent (Subclass 189)",
    ],
    process: [
      { step: "Skills assessment & English test", duration: "2 – 6 months", note: "Occupation-specific assessing authority evaluation is often the longest step." },
      { step: "Expression of Interest (EOI) via SkillSelect", duration: "1 – 2 weeks" },
      { step: "Receive invitation to apply (ITAs)", duration: "Ongoing — depends on points, occupation demand and processing rounds" },
      { step: "Visa application & adjudication", duration: "3 – 6 months", note: "DHS processes ITAs in points order; peak periods may extend timelines." },
    ],
    totalEstimatedTime: "6 – 18 months (skills assessment to visa grant)",
    costBreakdown: {
      currency: "AUD",
      items: [
        { item: "Visa application fee (Subclass 189, primary applicant)", amount: 4890 },
        { item: "Skills assessment fee", amount: 500, optional: true },
        { item: "English language test (e.g. IELTS, PTE)", amount: 350, optional: true },
        { item: "Processing service (optional)", amount: 1500, optional: true },
      ],
    },
    costNote: "Total cost depends on occupation-specific assessment fees and test fees. Costs may vary. Check official sources.",
    topCities: ["Sydney", "Melbourne", "Brisbane"],
  },

  "AU:Skilled Nominated": {
    status: "Skilled",
    processingTime: "6 – 12 months",
    duration: "Permanent",
    minSalary: "Source pending",
    successRate: "Pending — see notes",
    requirements: [
      "Same base requirements as Skilled Independent (age < 45, English 6.0+, skills assessment, 65 points minimum)",
      "Nomination by an Australian state or territory (State/Territory Sponsored pathway, Subclass 190)",
      "Must comply with state/nominee specific criteria and occupation lists",
    ],
    process: [
      { step: "Skills assessment & English test", duration: "2 – 6 months" },
      { step: "Submit state/nominee nomination application", duration: "4 – 12 weeks", note: "Each state has its own selection criteria and processing timelines. Not all occupations are nominated by every state." },
      { step: "Expression of Interest (EOI) in SkillSelect", duration: "1 – 2 weeks" },
      { step: "Invitation to apply & visa adjudication", duration: "3 – 6 months" },
    ],
    totalEstimatedTime: "8 – 18 months (skills assessment to visa grant)",
    costBreakdown: {
      currency: "AUD",
      items: [
        { item: "Visa application fee (Subclass 190, primary applicant)", amount: 4890 },
        { item: "Skills assessment fee", amount: 500, optional: true },
        { item: "English language test", amount: 350, optional: true },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  },

  // ── Canada ──

  "CA:Study Permit": {
    status: "Temporary",
    processingTime: "4 – 8 weeks (varies by applicant country of residence)",
    duration: "Duration of study program + 90 days",
    minSalary: "N/A",
    successRate: "Pending — see notes",
    requirements: [
      "Letter of Acceptance from a Designated Learning Institution (DLI) in Canada",
      "Proof of financial support (GIC option or bank statements — typically CAD 10,000+ above first year tuition + living costs)",
      "Immigration Regulatory Medical Examination (IRME) — biometrics and medical",
      "Police certificates (if applicable)",
      "Valid passport and identity documents",
      "Explanation letter describing purpose of study",
    ],
    process: [
      { step: "Receive Letter of Acceptance from a DLI", duration: "4 – 12 weeks", note: "After university acceptance application cycle." },
      { step: "Apply online or via paper application to IRCC", duration: "1 – 2 weeks" },
      { step: "Pay application fee (CAD 150) and give biometrics (CAD 85)", duration: "1 – 2 weeks (biometrics appointment)" },
      { step: "IRCC application processing", duration: "4 – 8 weeks (varies by country of residence)" },
      { step: "Receive Port of Entry (POE) Letter of Introduction + TRV (if applicable)", duration: "1 – 2 weeks"},
    ],
    totalEstimatedTime: "2 – 4 months (acceptance to study permit approval)",
    costBreakdown: {
      currency: "CAD",
      items: [
        { item: "Study Permit application fee", amount: 150 },
        { item: "Biometrics fee", amount: 85 },
        { item: "Super Invoice / Police certificate fees (where applicable)", amount: 0, optional: true },
        { item: "Optional: Immigration consultant / processing service", amount: 1500, optional: true },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Toronto", "Vancouver", "Montreal", "Waterloo", "Ottawa"],
  },

  "CA:Post-Graduation Work Permit": {
    status: "Work",
    processingTime: "4 – 8 weeks",
    duration: "Duration of study program (up to 3 years for 2+ year programs)",
    minSalary: "N/A",
    successRate: "Pending — see notes",
    requirements: [
      "Graduated from a Designated Learning Institution (DLI) in Canada in an eligible program (8+ months for PGWP eligibility)",
      "Applied within 180 days of receiving final marks / program completion evidence",
      "Still holds valid study permit or has since been authorized to remain in Canada",
      "English or French language proficiency (CLB/NCLC 5+ for most long-duration programs where applicable)",
    ],
    process: [
      { step: "Graduate from eligible DLI program & document completion", duration: "Day of graduation" },
      { step: "Submit PGWP application online within 180 days of completion evidence", duration: "1 – 2 weeks" },
      { step: "IRCC processes open work permit application", duration: "4 – 8 weeks" },
      { step: "Receive PGWP — begin open work in Canada", duration: "1 – 2 weeks" },
    ],
    totalEstimatedTime: "1 – 2 months (completion to work permit approval)",
    costBreakdown: {
      currency: "CAD",
      items: [
        { item: "Open Work Permit application fee", amount: 1005 },
        { item: "Biometrics (if required)", amount: 85, optional: true },
        { item: "Processing service (optional)", amount: 1500, optional: true },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
  },

  "CA:Express Entry": {
    status: "Skilled",
    processingTime: "6 months (IRCC target from complete application)",
    duration: "Permanent",
    minSalary: "N/A (points-based; salary evidence supports CRS score)",
    successRate: "Pending — see notes",
    requirements: [
      "Meets one of three federal categories: Federal Skilled Worker (FSW), Canadian Experience Class (CEC), or Federal Skilled Trades (FST)",
      "Language test results (IELTS/CELPIP for English, TEF/TCF for French) — valid 2 years",
      "Educational Credential Assessment (ECA) — if educational credentials are from outside Canada",
      "Sufficient CRS score to receive an Invitation to Apply (ITA) in the regular draws",
      "Meets health and character requirements",
      "Proof of settlement funds (unless already authorized to work in Canada or have a valid job offer)",
    ],
    process: [
      { step: "Take language test & get ECA (if required)", duration: "2 – 3 months" },
      { step: "Create Express Entry profile (express profile) & enter pool", duration: "1 week" },
      { step: "Receive Invitation to Apply (ITA)", duration: "Ongoing — depends on CRS score, occupation and draw frequency (generally most frequent for trades, nursing, engineering)" },
      { step: "Submit application & supporting documents within 60 days", duration: "1 – 2 weeks" },
      { step: "IRCC permanent residence processing", duration: "6 months (official target)" },
    ],
    totalEstimatedTime: "6 – 12 months (profile creation to PR grant)",
    costBreakdown: {
      currency: "CAD",
      items: [
        { item: "Express Entry application fee (principal applicant)", amount: 1325 },
        { item: "Right of Permanent Residence Fee (RPRF, principal applicant)", amount: 515 },
        { item: "Language test (IELTS General Training)", amount: 320, optional: true },
        { item: "ECA (Educational Credential Assessment) — WES", amount: 250, optional: true },
        { item: "Biometrics", amount: 85, optional: true },
      ],
    },
    costNote: "Costs may vary. Check official sources.",
    topCities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton"],
  },

  // ── United States ──

  "US:F-1 Student": {
    status: "Temporary",
    processingTime: "4 – 8 weeks (varies by consular appointment availability)",
    duration: "Duration of course + Optional Practical Training (OPT)",
    minSalary: "N/A",
    successRate: "N/A",
    requirements: [
      "Acceptance by SEVP-certified school and receiving Form I-20",
      "SEVIS I-901 fee paid by applicant",
      "DS-160 nonimmigrant visa application completed and submitted",
      "Visa appointment (MRV fee applicable) and interview at US embassy/consulate",
      "Proof of intent to depart the US after program completion (ties to home country)",
      "Proof of sufficient financial resources to cover tuition and living costs for the full program",
      "English language proficiency sufficient for the coursework",
    ],
    process: [
      { step: "Receive Form I-20 from SEVP-certifying school after admission", duration: "1 – 6 weeks" },
      { step: "Pay SEVIS I-901 fee and complete DS-160; schedule visa appointment", duration: "1 – 3 weeks" },
      { step: "Attend visa interview at US embassy/consulate", duration: "1 day (plus possible administrative processing)" },
      { step: "Visa issuance and travel to US", duration: "1 – 4 weeks" },
    ],
    totalEstimatedTime: "1 – 3 months (from I-20 receipt to visa issuance)",
    costBreakdown: {
      currency: "USD",
      items: [
        { item: "SEVIS I-901 fee", amount: 350 },
        { item: "DS-160 visa application fee (MRV fee)", amount: 185 },
        { item: "SEVP school certification fee (included in tuition)", amount: 0 },
      ],
    },
    costNote: "SEVIS and MRV fees are mandatory. Consular fees may vary by nationality. Tuition, housing and living costs not included. Costs may vary. Check official sources.",
    topCities: ["New York", "San Francisco", "Boston", "Los Angeles", "Chicago"],
  },

  "US:H-1B Specialty Occupation": {
    status: "Temporary",
    processingTime: "Source pending — see notes",
    duration: "Up to 6 years (3-year initial period + 3-year extension)",
    minSalary: "Source pending — see notes (must meet prevailing wage for role/location)",
    successRate: "N/A (lottery-based selection)",
    requirements: [
      "Valid job offer from a USCIS-certified US employer (petitioning employer)",
      "Position qualifies as a 'specialty occupation' requiring theoretical and practical application of a body of specialized knowledge and at least a bachelor's degree or equivalent",
      "Employer files Form I-129 (Petition for a Nonimmigrant Worker) with USCIS",
      "H-1B cap registration via USCIS during registration period (March for fiscal year starting October 1)",
      "Selected in H-1B lottery if cap-subject",
      "Applicant must hold a US bachelor's or higher degree (or equivalent foreign credential) in a directly related field; some roles accept equivalency via experience",
    ],
    process: [
      { step: "Employer receives a valid job offer and confirms specialty occupation requirements", duration: "As needed per employer cycle" },
      { step: "H-1B cap registration period with USCIS (typically March for FY starting Oct 1)", duration: "1 – 2 weeks window" },
      { step: "USCIS conducts lottery selection and employer files Form I-129", duration: "1 – 4 weeks after selection" },
      { step: "USCIS adjudicates petition (or requests RFE)", duration: "1 – 3 months (standard processing)", note: "Premium processing (15 business days) available for additional $2,805 fee." },
      { step: "Consular processing or change of status (if already in US)", duration: "1 – 4 weeks" },
    ],
    totalEstimatedTime: "3 – 8 months (employer registration to visa/change-of-status)",
    costBreakdown: {
      currency: "USD",
      items: [
        { item: "USCIS Form I-129 filing fee (standard)", amount: 460 },
        { item: "ACWIA (Anti-Fraud) fee (employer pays; may be passed to employee in some cases)", amount: 750, optional: true },
        { item: "Premium Processing Service (15 business days) — employer optional", amount: 2805, optional: true },
      ],
    },
    costNote: "Fees listed are USCIS filing fees only. Premium processing (optional) and attorney fees are extra. Prevailing wage determination (PWD) from DOL does not have a direct application fee. Costs may vary. Check official sources.",
    topCities: ["San Jose", "Seattle", "San Francisco", "New York", "Boston"],
  },

  "US:J-1 Exchange Visitor": {
    status: "Temporary",
    processingTime: "Source pending",
    duration: "Program duration (varies by category — typically weeks to years)",
    minSalary: "N/A (stipend provided by program per category)",
    successRate: "N/A",
    requirements: [
      "Accepted into a US State Department-designated J-1 exchange program (Summer Work Travel, Intern, Trainee, Professor/Researcher, Student, etc.)",
      "Sponsor organization provides Form DS-2019 (Certificate of Eligibility for Exchange Visitor Status)",
      "Comply with home-country residency requirement (212(e)) — where applicable; most categories require return to home country for at least 2 years after program completion",
      "Demonstrate sufficient funds or program-sponsored support",
    ],
    process: [
      { step: "Apply to and be accepted by a J-1 program sponsor", duration: "2 – 12 weeks" },
      { step: "Receive DS-2019 from sponsor; pay SEVIS fee (I-901)", duration: "1 – 2 weeks" },
      { step: "Complete DS-160 and schedule visa interview", duration: "1 – 3 weeks" },
      { step: "Visa interview at US embassy/consulate (J-1 waiver interview for Q-1 or when 212(e) applies)", duration: "1 day" },
      { step: "Visa issuance and travel to US", duration: "1 – 4 weeks" },
    ],
    totalEstimatedTime: "1 – 4 months (acceptance to visa issuance)",
    costBreakdown: {
      currency: "USD",
      items: [
        { item: "SEVIS I-901 fee", amount: 220 },
        { item: "DS-160 visa application fee (MRV fee)", amount: 185 },
        { item: "Program sponsor fee (varies widely by category and institution)", amount: 0, optional: true },
      ],
    },
    costNote: "SEVIS and MRV fees are mandatory. Sponsorship fees vary by program and host organization. Many J-1 programs provide a stipend or scholarship. Costs may vary. Check official sources.",
    topCities: ["New York", "Washington DC", "San Francisco", "Boston", "Los Angeles"],
  },

  "US:L-1 Intracompany Transferee": {
    status: "Work",
    processingTime: "Source pending",
    duration: "Up to 7 years (L-1A, managerial/executive) or 5 years (L-1B, specialized knowledge)",
    minSalary: "Source pending",
    successRate: "N/A",
    requirements: [
      "Employed outside the US for at least 1 continuous year within the preceding 3 years by a qualifying organization (parent, branch, subsidiary, affiliate) of the petitioning US employer",
      "Seeking entry to US in a managerial or executive capacity (L-1A) or possessing specialized knowledge (L-1B)",
      "Petitioning employer files Form I-129 with USCIS on behalf of qualifying individual",
      "Employer has a qualifying US business operation (not a new office requiring the L-1A Blanket or initial petition under specific new-office rules)",
      "DOL does not certify L-1 petitions; no prevailing wage determination required (unlike H-1B)",
    ],
    process: [
      { step: "Employer prepares and files Form I-129 petition with USCIS", duration: "1 – 2 weeks preparation" },
      { step: "USCIS adjudicates petition (or requests RFE)", duration: "1 – 3 months (standard processing); Premium Processing (15 business days) available for $2,805" },
      { step: "Consular processing or change of status (if in US)", duration: "1 – 4 weeks" },
    ],
    totalEstimatedTime: "1 – 4 months (petition filing to visa or change-of-status)",
    costBreakdown: {
      currency: "USD",
      items: [
        { item: "USCIS Form I-129 filing fee", amount: 460 },
        { item: "Premium Processing Service (optional — 15 business days)", amount: 2805, optional: true },
      ],
    },
    costNote: "Premium processing fee is optional but recommended to reduce adjudication timeline. Attorney fees are separate. Costs may vary. Check official sources.",
    topCities: ["New York", "San Francisco", "Chicago", "Houston", "Los Angeles"],
  },

  "US:OPT / STEM OPT": {
    status: "Temporary",
    processingTime: "90 days (USCIS target from receipt); EAD card typically arrives within 2–3 months",
    duration: "12 months (standard OPT) + 24 months (STEM OPT extension for qualifying STEM degrees at approved institutions) = up to 3 years total",
    minSalary: "N/A (must maintain legal F-1 status; Optional Practical Training does not have a prevailing-wage floor per se, though the employer should be aware of legal working conditions)",
    successRate: "N/A",
    requirements: [
      "Must have valid F-1 status and have been enrolled full-time for at least one full academic year prior to the start of OPT",
      "Must file Form I-765 (Application for Employment Authorization) with USCIS prior to the 90-day window before programcompletion",
      "Must receive an Employment Authorization Document (EAD) card before starting OPT employment",
      "Employment must be directly related to the student's major area of study (Standard OPT) — STEM OPT extensions require employers enrolled in E-Verify and an approved STEM OPT extension Form I-20 from the DSO",
      "90-day unemployment limit for Standard OPT (no more than 90 days unemployed during the entire OPT period) — STEM extension also has a 150-day total unemployment cap for the combined period",
    ],
    process: [
      { step: "Request OPT recommendation from Designated School Official (DSO) and receive updated I-20", duration: "1 – 4 weeks" },
      { step: "File Form I-765 with USCIS during the 90-day pre-completion / 60-day post-completion window", duration: "1 – 2 weeks" },
      { step: "USCIS processes OPT application and issues EAD card", duration: "90 days (USCIS target); actual delivery 2 – 3 months is common" },
      { step: "Begin OPT employment upon receipt of valid EAD card", duration: "1 day (employment may not start before the EAD start date)" },
      { step: "(STEM OPT) DSO issues STEM Extension I-20; student files Form I-765 for 24-month extension before first EAD expires", duration: "As needed" },
    ],
    totalEstimatedTime: "1 – 4 months (pre-completion OPT request to EAD receipt); 3 – 5 months if filing for STEM extension as well",
    costBreakdown: {
      currency: "USD",
      items: [
        { item: "USCIS Form I-765 filing fee (OPT application)", amount: 410 },
        { item: "Form I-765 filing fee (STEM OPT extension application)", amount: 410, optional: true },
        { item: "Processing service (optional for expedited review or attorney assistance)", amount: 1500, optional: true },
      ],
    },
    costNote: "Fees listed are USCIS filing fees only. Attorney and processing services are optional. STEM OPT extension requires E-Verify employer participation. Costs may vary. Check official sources.",
    topCities: ["San Jose", "New York", "Seattle", "San Francisco", "Boston"],
  },
}

export function getVisaDetail(countryCode: string, name: string): VisaDetail | null {
  return VISA_DETAILS[visaDetailKey(countryCode, name)] ?? null
}
