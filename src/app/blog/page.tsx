import { getTranslations } from "@/lib/i18n/server"
import { getAllPosts } from "@/lib/blog"
import { BlogGrid } from "./BlogGrid"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Blog — Study Abroad Insights & Salary Data",
  description: "Data-driven articles on graduate salaries, ROI, and study abroad decisions across USA, Ireland, UK, Canada and Australia.",
  path: "/blog",
})

export default function BlogPage() {
  const t = getTranslations()
  const tb = t.blog
  const posts = getAllPosts()

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold text-slate-900 tracking-tight mb-3">
          {tb.pageTitle}
        </h1>
        <p className="text-lg text-slate-500">
          {tb.pageSubtitle}
        </p>
      </div>

      <BlogGrid posts={posts} labels={{ readTime: tb.readTime, readMore: tb.readMore }} />
    </div>
  )
}
