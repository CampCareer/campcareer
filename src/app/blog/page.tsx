import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog — Study Abroad Insights & Salary Data",
  description: "Data-driven articles on graduate salaries, ROI, and study abroad decisions across USA, Ireland, UK, Canada and Australia.",
  alternates: { canonical: "/blog" },
}

const POSTS = [
  {
    slug: "cost-of-studying-in-ireland-2026",
    title: "How Much Does It Cost to Study in Ireland in 2026? A Complete Breakdown",
    excerpt: "I moved to Dublin via Germany and nearly picked Limerick instead. Here's what studying in Ireland actually costs in 2026 — the accommodation timing trick nobody tells you, the €1,000 studio vs €1,300 shared room reality, and whether it's worth it.",
    date: "2026-06-01",
    readTime: "8 min",
    tag: "Ireland",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    slug: "ireland-cs-graduate-salary-2025",
    title: "Ireland Computer Science Graduate Salary 2025: The Complete Guide",
    excerpt: "Irish CS graduates earn €45,000 on average. We break down salaries by university, city, and career stage using HEA government data.",
    date: "2025-05-31",
    readTime: "5 min",
    tag: "Ireland",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    slug: "australia-vs-canada-study-abroad-roi",
    title: "Australia vs Canada: Which Has Better ROI for International Students?",
    excerpt: "We compare tuition costs, graduate salaries, visa pathways, and cost of living to find the winner for international students in 2025.",
    date: "2025-05-31",
    readTime: "7 min",
    tag: "Comparison",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    slug: "uk-graduate-route-visa-salary-2025",
    title: "UK Graduate Route Visa 2025: Salaries You Can Expect",
    excerpt: "The UK Graduate Route gives you 2 years to work after graduation. Here's what you can realistically earn by field and city.",
    date: "2025-05-31",
    readTime: "6 min",
    tag: "United Kingdom",
    tagColor: "bg-violet-100 text-violet-700",
  },
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
          Study Abroad Insights
        </h1>
        <p className="text-lg text-slate-500">
          Data-driven guides to help you make smarter study abroad decisions.
        </p>
      </div>

      <div className="space-y-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.tagColor}`}>
                {post.tag}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {post.readTime} read
              </div>
              <span className="text-xs text-slate-400">{post.date}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              {post.excerpt}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
              Read more <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
