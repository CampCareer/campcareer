import { getAllPosts } from "@/lib/blog"
import { BlogGrid } from "./BlogGrid"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "Blog — Study Abroad, Career & Cost Guides",
  description: "Data-backed guides for choosing a study destination, comparing career paths, costs, and post-study pathways across 20 destinations.",
  path: "/blog",
})

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold text-slate-900 tracking-tight mb-3">
          Blog
        </h1>
        <p className="text-lg text-slate-500">
          Guides and insights for international students
        </p>
      </div>

      <BlogGrid posts={posts} labels={{ readTime: "min read", readMore: "Read more" }} />
    </div>
  )
}
