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
  ctaCareer?: string
  ctaOrigin?: string
}

const curatedThumbnails: Record<string, Pick<PostMeta, "heroImage" | "heroImageAlt">> = {
  "best-high-demand-high-paying-careers-australia-2026": {
    heroImage: "/blog/images/high-demand-careers-australia-2026.webp",
    heroImageAlt:
      "Australian high-demand career professionals including an electrician, nurse, carpenter and care worker",
  },
  "how-to-become-an-electrician-in-australia-2026": {
    heroImage: "/blog/images/how-to-become-electrician-australia-2026.webp",
    heroImageAlt:
      "Electrical apprentice in high-visibility workwear training on an electrical switchboard",
  },
  "electrician-salary-australia-2026": {
    heroImage: "/blog/images/electrician-salary-australia-2026.webp",
    heroImageAlt:
      "Experienced electrician reviewing electrical plans beside an industrial control panel",
  },
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".mdx"))

const posts: PostMeta[] = files
  .map(filename => {
    const slug = filename.replace(/\.mdx$/, "")
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8")
    const { data } = matter(raw)
    const curatedThumbnail = curatedThumbnails[slug]
    return {
      slug,
      ...data,
      heroImage: data.heroImage ?? curatedThumbnail?.heroImage,
      heroImageAlt: data.heroImageAlt ?? curatedThumbnail?.heroImageAlt,
    } as PostMeta
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

fs.writeFileSync(OUT, JSON.stringify(posts, null, 2))
console.log(`[generate-blog-manifest] wrote ${posts.length} posts to ${OUT}`)