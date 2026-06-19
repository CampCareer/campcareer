import { HomeLanding, type HomeFeaturedPost } from "@/components/home/home-landing"
import { getAllPosts } from "@/lib/blog"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "CampCareer — Will Your Degree Get You a Visa & PR Abroad?",
  description:
    "Find out if your major leads to a post-study work visa and PR — scored across 5 study-abroad countries (US, Canada, UK, Australia, Ireland) on visa pathway (OPT, H-1B, PGWP, Graduate Route, 485), PR routes, employment, AI exposure, and ROI. Built on government data, updated as visa rules change. Then see where to study it.",
  path: "/",
})

export default function LandingPage() {
  // Featured guides — only posts with a local hero image (guaranteed to render),
  // featured-flagged first, newest otherwise. getAllPosts() is a build-time read.
  const local = getAllPosts().filter((p) => p.heroImage?.startsWith("/blog/images/"))
  const ordered = [...local.filter((p) => p.featured), ...local.filter((p) => !p.featured)]
  const posts: HomeFeaturedPost[] = ordered.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tag: p.tag,
    tagColor: p.tagColor,
    readTime: p.readTime,
    heroImage: p.heroImage as string,
  }))

  return <HomeLanding posts={posts} />
}
