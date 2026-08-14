import fs from "fs"
import path from "path"
import matter from "gray-matter"
import blogManifest from "@/data/blog-manifest.json"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

// These URLs remain directly readable while URL-level GSC/backlink evidence is
// collected, but they are not promoted in the relaunch listing or sitemap.
// See docs/BLOG_SEO_GEO_AUDIT_2026-08-14.md before changing this inventory.
const BLOG_SEO_HOLDOUT_SLUGS = new Set([
  "best-country-to-study-indian-students-2026",
  "ielts-score-requirements-2026",
  "ireland-language-school-guide-2026",
  "study-abroad-checklist-korean-students-2026",
])

export type PostMeta = {
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
  // Conversion + GEO (optional). CTA defaults bake a supported Compare deep
  // link into bare <ToolCTA/> and legacy <CTA/> tags; faqs emit FAQPage data.
  ctaCountry?: string
  ctaMajor?: string
  ctaCareer?: string
  ctaOrigin?: string
  faqs?: { q: string; a: string }[]
}

export function getAllPosts(): PostMeta[] {
  return blogManifest as PostMeta[]
}

export function isBlogSeoHoldout(slug: string) {
  return BLOG_SEO_HOLDOUT_SLUGS.has(slug)
}

export function getPublishedBlogPosts(): PostMeta[] {
  return getAllPosts().filter((post) => !isBlogSeoHoldout(post.slug))
}

// Strip markdown emphasis/links so FAQ answers are clean plain text for schema.
function toPlainText(md: string): string {
  return md
    .replace(/<\/?[a-zA-Z][^>]*>/g, "") // strip inline HTML tags (e.g. <a href>)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** -> bold
    .replace(/\*([^*]+)\*/g, "$1") // *italic* -> italic
    .replace(/`([^`]+)`/g, "$1") // `code` -> code
    .replace(/\s+/g, " ")
    .trim()
}

// Extract the post's "Frequently asked questions" / "FAQ" section into Q&A
// pairs (questions are **bold** lines, answers the following paragraph). Used
// to emit FAQPage structured data without touching post bodies.
export function extractFaqs(content: string): { q: string; a: string }[] {
  const heading = content.match(/^##\s+(?:FAQ|Frequently asked questions)\s*$/im)
  if (!heading) return []
  const after = content.slice(content.indexOf(heading[0]) + heading[0].length)
  const endRel = after.search(/\n##\s+/) // stop at next h2
  let section = endRel >= 0 ? after.slice(0, endRel) : after
  // Trailing CTAs / JSX blocks usually sit after a `---` rule below the Q&A —
  // cut the section there so they don't leak into the last answer.
  const hr = section.search(/\n-{3,}\s*(?:\n|$)/)
  const jsx = section.search(/\n<[A-Za-z]/)
  const cut = [hr, jsx].filter((i) => i >= 0).sort((a, b) => a - b)[0]
  if (cut !== undefined) section = section.slice(0, cut)

  const faqs: { q: string; a: string }[] = []
  const re = /^\*\*(.+?)\*\*\s*$/gm
  let m: RegExpExecArray | null
  const marks: { q: string; markStart: number; contentStart: number }[] = []
  while ((m = re.exec(section)) !== null) {
    marks.push({ q: m[1].trim(), markStart: m.index, contentStart: m.index + m[0].length })
  }
  for (let i = 0; i < marks.length; i++) {
    // Answer runs from this question's end to the start of the next marker.
    const ansRaw = section.slice(marks[i].contentStart, marks[i + 1]?.markStart ?? section.length)
    const ans = toPlainText(ansRaw.replace(/^-{3,}$/gm, ""))
    if (ans) faqs.push({ q: toPlainText(marks[i].q), a: ans })
  }
  return faqs
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  const meta = { slug, ...data } as PostMeta
  // Frontmatter faqs win; otherwise derive from the post's FAQ section.
  if (!meta.faqs?.length) {
    const derived = extractFaqs(content)
    if (derived.length) meta.faqs = derived
  }

  return { meta, content }
}
