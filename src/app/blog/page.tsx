import { getPublishedBlogPosts } from "@/lib/blog"
import { BlogGrid } from "./BlogGrid"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "Career Guides, Salaries & Study-to-Work Paths",
  description: "Evidence-backed guides on careers, salaries, study-to-work paths, costs and work rights, built to help you choose what career to pursue and how to reach it.",
  path: "/blog",
})

export default function BlogPage() {
  const posts = getPublishedBlogPosts()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold text-slate-900 tracking-tight mb-3">
          Career guides
        </h1>
        <p className="text-lg text-slate-500 max-w-3xl">
          Evidence-backed answers on careers, pay, study paths, costs and work rights. Start with the career outcome, then assess the path to reach it.
        </p>
      </div>

      <BlogGrid posts={posts} labels={{ readTime: "min read", readMore: "Read more" }} />
    </div>
  )
}
