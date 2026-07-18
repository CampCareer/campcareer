export const AU_CAREER_CATEGORIES = [
  { id: 1, slug: "construction-skilled-trades", name: "Construction & Skilled Trades", icon: "hammer" },
  { id: 2, slug: "health-care", name: "Health & Care", icon: "heart-pulse" },
  { id: 3, slug: "it-data-science", name: "IT, Data & Science", icon: "code" },
  { id: 4, slug: "engineering-manufacturing-resources", name: "Engineering, Manufacturing & Resources", icon: "cog" },
  { id: 5, slug: "business-finance-public-administration", name: "Business, Finance, Legal & Public Administration", icon: "chart" },
  { id: 6, slug: "education-social-community-services", name: "Education, Social & Community Services", icon: "graduation-cap" },
  { id: 7, slug: "environment-agriculture", name: "Environment & Agriculture", icon: "leaf" },
  { id: 8, slug: "design-media-culture", name: "Design, Media & Culture", icon: "palette" },
  { id: 9, slug: "hospitality-retail-services", name: "Hospitality, Retail & Services", icon: "concierge-bell" },
  { id: 10, slug: "transport-aviation-maritime-logistics", name: "Transport, Aviation, Maritime & Logistics", icon: "plane" },
] as const

export type AuCareerCategoryId = typeof AU_CAREER_CATEGORIES[number]["id"]

export const AU_CAREER_CATEGORY_BY_ID = new Map(AU_CAREER_CATEGORIES.map((category) => [category.id, category]))
