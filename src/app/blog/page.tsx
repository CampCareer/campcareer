import type { Metadata } from "next"
import { getTranslations } from "@/lib/i18n/server"
import { BlogGrid } from "./BlogGrid"

export const metadata: Metadata = {
  title: "Blog — Study Abroad Insights & Salary Data",
  description: "Data-driven articles on graduate salaries, ROI, and study abroad decisions across USA, Ireland, UK, Canada and Australia.",
  alternates: { canonical: "/blog" },
}

export default function BlogPage() {
  const t = getTranslations()
  const tb = t.blog

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
          {tb.pageTitle}
        </h1>
        <p className="text-lg text-slate-500">
          {tb.pageSubtitle}
        </p>
      </div>

      <BlogGrid labels={{ readTime: tb.readTime, readMore: tb.readMore }} />
    </div>
  )
}
