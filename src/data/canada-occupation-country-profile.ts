import type {
  CountryMajorInstitution,
  CountryProfileSource,
  CountryStrongMajor,
} from "@/data/australia-occupation-country-profile"

export const CANADA_OCCUPATION_COUNTRY_PROFILE = {
  countryCode: "CA",
  countryName: "Canada",
  introduction:
    "Canada combines a large university and public-college sector with multiple study intakes, province-specific labour markets and distinct federal and provincial immigration pathways.",
  academicYear: {
    headline: "Two main academic terms",
    summary:
      "Most post-secondary programmes run from September to December and January to April. Some institutions offer a shorter spring or summer term from May to August.",
    intakes: ["September", "January (selected programmes)", "May (limited programmes)"],
    source: {
      label: "Government of Canada — Post-secondary education",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/education/school-types/post-secondary.html",
    },
  },
  strongMajors: [
    {
      id: "nursing-health",
      label: "Nursing & Health Sciences",
      reason: "Health occupations show sustained shortages and replacement demand.",
    },
    {
      id: "early-childhood-teaching",
      label: "Early Childhood Education & Teaching",
      reason: "Education and care roles show recurring provincial demand.",
    },
    {
      id: "social-community-services",
      label: "Social & Community Services",
      reason: "Community and support occupations retain strong service demand.",
    },
    {
      id: "construction-trades",
      label: "Construction & Skilled Trades",
      reason: "Construction, maintenance and trade occupations face regional shortages.",
    },
    {
      id: "engineering-technologies",
      label: "Engineering & Industrial Technologies",
      reason: "Technical programmes connect to manufacturing, infrastructure and energy work.",
    },
    {
      id: "agriculture-food",
      label: "Agriculture & Food Production",
      reason: "Regional employers report demand across production and processing roles.",
    },
  ] satisfies CountryStrongMajor[],
  majorInstitutions: [
    { name: "University of Toronto", type: "university", location: "Ontario" },
    { name: "University of British Columbia", type: "university", location: "British Columbia" },
    { name: "McGill University", type: "university", location: "Quebec" },
    { name: "University of Alberta", type: "university", location: "Alberta" },
    { name: "University of Waterloo", type: "university", location: "Ontario" },
    { name: "McMaster University", type: "university", location: "Ontario" },
    { name: "Simon Fraser University", type: "university", location: "British Columbia" },
    { name: "Seneca Polytechnic", type: "college_polytechnic", location: "Ontario" },
    { name: "British Columbia Institute of Technology", type: "college_polytechnic", location: "British Columbia" },
    { name: "Southern Alberta Institute of Technology", type: "college_polytechnic", location: "Alberta" },
  ] satisfies CountryMajorInstitution[],
  sources: [
    {
      label: "Government of Canada — Canadian Occupational Projection System",
      url: "https://occupations.esdc.gc.ca/sppc-cops/",
    },
    {
      label: "Universities Canada — member universities",
      url: "https://univcan.ca/about-universities-canada/our-members/",
    },
    {
      label: "Colleges and Institutes Canada — member directory",
      url: "https://www.collegesinstitutes.ca/colleges-and-institutes-in-your-community/our-members/",
    },
  ] satisfies CountryProfileSource[],
} as const
