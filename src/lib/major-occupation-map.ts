// Manual mapping of 20 majors (from MAJOR_OPTIONS) to BLS SOC occupation codes.
// Used to determine which occupations are relevant per major for the State Info
// panel on the US Map. SOC codes are matched against us-occupation-state.json.

export interface MajorOccupations {
  slug: string
  label: string
  socCodes: string[]
}

export const MAJOR_OCCUPATIONS: MajorOccupations[] = [
  {
    slug: "computer-science",
    label: "Computer Science",
    socCodes: ["15-1252", "15-1211", "15-1212", "15-1299"],
  },
  {
    slug: "data-analytics",
    label: "Data Analytics",
    socCodes: ["15-2051", "15-2031", "15-2041"],
  },
  {
    slug: "software-engineering",
    label: "Software Engineering",
    socCodes: ["15-1252", "11-3021", "15-1254", "17-2061"],
  },
  {
    slug: "nursing",
    label: "Nursing",
    socCodes: ["29-1141", "29-1171", "29-1151"],
  },
  {
    slug: "civil-engineering",
    label: "Civil Engineering",
    socCodes: ["17-2051", "11-9021", "17-2081"],
  },
  {
    slug: "business-management",
    label: "Business",
    socCodes: ["13-1111", "11-1021", "13-1082", "11-9199"],
  },
  {
    slug: "accounting",
    label: "Accounting",
    socCodes: ["13-2011", "11-3031", "13-2081"],
  },
  {
    slug: "ux-design",
    label: "UX Design",
    socCodes: ["15-1254", "15-1252", "27-1024"],
  },
  {
    slug: "psychology",
    label: "Psychology",
    socCodes: ["19-3033", "21-1011", "13-1161", "19-3039"],
  },
  {
    slug: "music",
    label: "Music",
    socCodes: ["27-2042", "27-2041", "27-2099"],
  },
  {
    slug: "mechanical-engineering",
    label: "Mechanical Engineering",
    socCodes: ["17-2141", "17-2112", "17-2199"],
  },
  {
    slug: "electrical-engineering",
    label: "Electrical Engineering",
    socCodes: ["17-2071", "17-2072", "17-2061"],
  },
  {
    slug: "biology",
    label: "Biology",
    socCodes: ["19-1029", "19-1042", "19-1020", "19-1022"],
  },
  {
    slug: "finance",
    label: "Finance",
    socCodes: ["13-2051", "11-3031", "13-2052", "13-2099"],
  },
  {
    slug: "marketing",
    label: "Marketing",
    socCodes: ["11-2021", "13-1161", "41-3011"],
  },
  {
    slug: "economics",
    label: "Economics",
    socCodes: ["19-3011", "13-2051", "13-1161"],
  },
  {
    slug: "mathematics",
    label: "Mathematics",
    socCodes: ["15-2021", "15-2031", "15-2011", "15-2041"],
  },
  {
    slug: "chemical-engineering",
    label: "Chemical Engineering",
    socCodes: ["17-2041", "17-2131", "17-2081"],
  },
  {
    slug: "communications",
    label: "Communications",
    socCodes: ["27-3031", "27-3043", "27-3041", "27-3011"],
  },
  {
    slug: "political-science",
    label: "Political Science",
    socCodes: ["19-3094", "19-3051", "23-2011"],
  },
]

export function getMajorsForOccupation(socCode: string): MajorOccupations[] {
  return MAJOR_OCCUPATIONS.filter((m) => m.socCodes.includes(socCode))
}

export function getOccupationsForMajor(slug: string): MajorOccupations | undefined {
  return MAJOR_OCCUPATIONS.find((m) => m.slug === slug)
}
