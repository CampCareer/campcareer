import type {
  CountryMajorInstitution,
  CountryProfileSource,
  CountryStrongMajor,
} from "@/data/australia-occupation-country-profile"

export const UNITED_KINGDOM_OCCUPATION_COUNTRY_PROFILE = {
  countryCode: "UK",
  countryName: "United Kingdom",
  introduction:
    "The United Kingdom combines a compact university system, one-year postgraduate options, distinct labour markets across four nations and established study-to-work pathways.",
  academicYear: {
    headline: "September or October to June or July",
    summary:
      "The standard academic year starts in September or October and usually runs until June or July. Most courses have an autumn start, while selected programmes also offer January or other flexible intakes.",
    intakes: ["September–October", "January (selected programmes)", "Other dates (limited programmes)"],
    source: {
      label: "Study UK — How modules and courses work",
      url: "https://study-uk.britishcouncil.org/plan-studies/choosing-course/modules-courses",
    },
  },
  strongMajors: [
    {
      id: "medicine-allied-health",
      label: "Medicine & Allied Health",
      reason: "Medical practitioners, radiographers and therapy roles show critical or elevated demand.",
    },
    {
      id: "nursing-social-care",
      label: "Nursing, Care & Social Work",
      reason: "Health and social care has the largest workforce in high-demand occupations.",
    },
    {
      id: "computer-software",
      label: "Computer Science & Software",
      reason: "Programmers and software professionals remain a large elevated-demand occupation group.",
    },
    {
      id: "data-business-systems",
      label: "Data, Business Analysis & Information Systems",
      reason: "IT business analysts, architects and systems designers show strong recruitment demand.",
    },
    {
      id: "construction-built-environment",
      label: "Construction & Built Environment",
      reason: "Construction is projected to require substantial workforce growth through 2035.",
    },
    {
      id: "engineering-clean-energy",
      label: "Engineering & Clean Energy",
      reason: "Engineering, advanced manufacturing and clean-energy roles are priority skills areas.",
    },
  ] satisfies CountryStrongMajor[],
  majorInstitutions: [
    { name: "University of Oxford", type: "university", location: "England" },
    { name: "University of Cambridge", type: "university", location: "England" },
    { name: "Imperial College London", type: "university", location: "England" },
    { name: "University College London", type: "university", location: "England" },
    { name: "University of Edinburgh", type: "university", location: "Scotland" },
    { name: "University of Manchester", type: "university", location: "England" },
    { name: "Cardiff University", type: "university", location: "Wales" },
    { name: "Queen's University Belfast", type: "university", location: "Northern Ireland" },
    { name: "City of Glasgow College", type: "college_polytechnic", location: "Scotland" },
    { name: "Leeds City College", type: "college_polytechnic", location: "England" },
  ] satisfies CountryMajorInstitution[],
  sources: [
    {
      label: "Skills England — Occupations in demand 2025",
      url: "https://www.gov.uk/government/publications/occupations-in-demand-2025",
    },
    {
      label: "Universities UK — member institutions",
      url: "https://www.universitiesuk.ac.uk/about-us/our-members",
    },
    {
      label: "Association of Colleges — college directory",
      url: "https://www.aoc.co.uk/about/college-directory",
    },
  ] satisfies CountryProfileSource[],
} as const
