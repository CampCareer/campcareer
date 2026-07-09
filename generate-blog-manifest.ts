/**
 * Generate blog-manifest.json from MDX frontmatter.
 * Run via: npx tsx scripts/generate-blog-manifest.ts
 */
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const BLOG_DIR = path.join(process.cwd(), "content/blog")
const OUT = path.join(process.cwd(), "src/data/blog-manifest.json")

interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  tag: string
  tagColor: string
  featured?: boolean
  heroImage?: string
  heroImageAlt?: string
  author?: string
  authorTitle?: string
  authorRole?: string
  authorInitials?: string
  reviewedBy?: string
  lastReviewed?: string
  ctaCountry?: string
  ctaMajor?: string
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".mdx"))

const posts: PostMeta[] = files
  .map(filename => {
    const slug = filename.replace(/\.mdx$/, "")
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8")
    const { data } = matter(raw)
    return { slug, ...data } as PostMeta
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

fs.writeFileSync(OUT, JSON.stringify(posts, null, 2))
console.log(`[generate-blog-manifest] wrote ${posts.length} posts to ${OUT}`)
