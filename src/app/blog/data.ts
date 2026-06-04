export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tag: string
  tagColor: string
  featured?: boolean
}

export type CategoryFilter = {
  label: string
  value: string
  emoji: string
}

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { label: "All",        value: "all",           emoji: ""   },
  { label: "Ireland",    value: "Ireland",        emoji: "🇮🇪" },
  { label: "Australia",  value: "Australia",      emoji: "🇦🇺" },
  { label: "UK",         value: "United Kingdom", emoji: "🇬🇧" },
  { label: "Canada",     value: "Canada",         emoji: "🇨🇦" },
  { label: "USA",        value: "USA",            emoji: "🇺🇸" },
  { label: "Comparison", value: "Comparison",     emoji: "⚖️"  },
]

export const POSTS: Post[] = [
  {
    slug: "cost-of-studying-in-ireland-2026",
    title: "How Much Does It Cost to Study in Ireland in 2026? A Complete Breakdown",
    excerpt: "I moved to Dublin via Germany and nearly picked Limerick instead. Here's what studying in Ireland actually costs in 2026 — the accommodation timing trick nobody tells you, the €1,000 studio vs €1,300 shared room reality, and whether it's worth it.",
    date: "2026-06-01",
    readTime: "8 min",
    tag: "Ireland",
    tagColor: "bg-emerald-100 text-emerald-700",
    featured: true,
  },
  {
    slug: "ireland-cs-graduate-salary-2025",
    title: "Ireland Computer Science Graduate Salary 2025: The Complete Guide",
    excerpt: "Irish CS graduates earn €45,000 on average. We break down salaries by university, city, and career stage using HEA government data.",
    date: "2026-05-31",
    readTime: "5 min",
    tag: "Ireland",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    slug: "australia-vs-canada-study-abroad-roi",
    title: "Australia vs Canada: Which Has Better ROI for International Students?",
    excerpt: "We compare tuition costs, graduate salaries, visa pathways, and cost of living to find the winner for international students in 2025.",
    date: "2026-05-31",
    readTime: "7 min",
    tag: "Comparison",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    slug: "uk-graduate-route-visa-salary-2025",
    title: "UK Graduate Route Visa 2025: Salaries You Can Expect",
    excerpt: "The UK Graduate Route gives you 2 years to work after graduation. Here's what you can realistically earn by field and city.",
    date: "2026-05-31",
    readTime: "6 min",
    tag: "United Kingdom",
    tagColor: "bg-violet-100 text-violet-700",
  },
]
