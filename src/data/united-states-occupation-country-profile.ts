import type {
  CountryMajorInstitution,
  CountryProfileSource,
  CountryStrongMajor,
} from "@/data/australia-occupation-country-profile"

export const UNITED_STATES_OCCUPATION_COUNTRY_PROFILE = {
  countryCode: "US",
  countryName: "United States",
  introduction:
    "The United States combines a large and varied higher-education system with state-specific labour markets, flexible academic calendars and several study-to-work pathways.",
  academicYear: {
    headline: "August to May at most universities",
    summary:
      "The academic year usually runs from August through May. Most universities use two semesters, while some institutions use quarter or trimester calendars and offer optional summer study.",
    intakes: ["August–September", "January (selected programmes)", "May–June (summer or limited programmes)"],
    source: {
      label: "EducationUSA — U.S. educational system FAQ",
      url: "https://educationusa.state.gov/experience-studying-usa/us-educational-system/frequently-asked-questions-faqs",
    },
  },
  strongMajors: [
    {
      id: "nursing-health",
      label: "Nursing & Health Sciences",
      reason: "Healthcare occupations combine strong projected growth with large numbers of new jobs.",
    },
    {
      id: "computer-data-ai",
      label: "Computer Science, Data & AI",
      reason: "Software and data occupations are projected to grow faster than the overall economy.",
    },
    {
      id: "cybersecurity-information-systems",
      label: "Cybersecurity & Information Systems",
      reason: "Information-security demand is rising with cyber risk and digital infrastructure needs.",
    },
    {
      id: "renewable-energy",
      label: "Renewable Energy & Environmental Technology",
      reason: "Wind and solar occupations are among the fastest-growing occupations nationally.",
    },
    {
      id: "engineering-manufacturing",
      label: "Engineering & Advanced Manufacturing",
      reason: "Engineering, infrastructure and technical-service demand supports multiple career routes.",
    },
    {
      id: "business-health-administration",
      label: "Business Analytics & Health Administration",
      reason: "Management, logistics and health-services roles show strong projected demand.",
    },
  ] satisfies CountryStrongMajor[],
  majorInstitutions: [
    { name: "Harvard University", type: "university", location: "Massachusetts" },
    { name: "Massachusetts Institute of Technology", type: "university", location: "Massachusetts" },
    { name: "Stanford University", type: "university", location: "California" },
    { name: "University of California, Berkeley", type: "university", location: "California" },
    { name: "University of California, Los Angeles", type: "university", location: "California" },
    { name: "University of Michigan", type: "university", location: "Michigan" },
    { name: "University of Texas at Austin", type: "university", location: "Texas" },
    { name: "Georgia Institute of Technology", type: "university", location: "Georgia" },
    { name: "Purdue University", type: "university", location: "Indiana" },
    { name: "Santa Monica College", type: "college_polytechnic", location: "California" },
  ] satisfies CountryMajorInstitution[],
  sources: [
    {
      label: "U.S. Bureau of Labor Statistics — Employment Projections",
      url: "https://www.bls.gov/emp/",
    },
    {
      label: "U.S. Department of Education — College Scorecard",
      url: "https://collegescorecard.ed.gov/",
    },
    {
      label: "EducationUSA — U.S. educational system",
      url: "https://educationusa.state.gov/experience-studying-usa/us-educational-system",
    },
  ] satisfies CountryProfileSource[],
} as const
