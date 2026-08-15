import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import {
  buildCareerFirstHref,
  buildCompareHref,
  normalizeCompareCountries,
  resolveBlogCtaHref,
} from "../src/lib/blog/compare-link"

const APP_ORIGIN = "https://www.campcareer.com"

function paramsFor(href: string) {
  return new URL(href, APP_ORIGIN).searchParams
}

test("blog Compare links turn a supported major and country into the public comparison contract", () => {
  const href = buildCompareHref({
    country: "Australia",
    major: "Computer Science",
    origin: "kr",
    currency: "aud",
  })
  const params = paramsFor(href)

  assert.equal(new URL(href, APP_ORIGIN).pathname, "/compare")
  assert.equal(params.get("career"), "software-developer")
  assert.equal(params.get("countries"), "AU")
  assert.equal(params.get("origin"), "KR")
  assert.equal(params.get("currency"), "AUD")
})

test("career intent wins over major and country selection is valid, deduplicated, and capped at four", () => {
  const href = buildCompareHref({
    career: "Registered Nurse",
    major: "computer-science",
    countries: ["ca", "Canada", "US", "unknown", "UK", "IE"],
  })
  const params = paramsFor(href)

  assert.equal(params.get("career"), "registered-nurse")
  assert.equal(params.get("countries"), "CA,US,UK,IE")
  assert.deepEqual(
    normalizeCompareCountries(["au", "AU", "france", "invalid", "ca", "us", "uk"]),
    ["AU", "FR", "CA", "US"],
  )
})

test("Career-first links use the canonical Career Page for one destination and Compare for multi-country intent", () => {
  assert.equal(
    buildCareerFirstHref({ country: "Australia", career: "Registered Nurse" }),
    "/career/australia/registered-nurse",
  )

  const multi = buildCareerFirstHref({ countries: ["AU", "UK"], career: "Registered Nurse" })
  assert.equal(new URL(multi, APP_ORIGIN).pathname, "/compare")
  assert.equal(paramsFor(multi).get("countries"), "AU,UK")
  assert.equal(paramsFor(multi).get("career"), "registered-nurse")
})

test("legacy blog product links resolve into the current Career-first journey while ordinary editorial links stay unchanged", () => {
  assert.equal(
    resolveBlogCtaHref("/degree-risk", { country: "ie", career: "accountant" }),
    "/career/ireland/accountant",
  )
  assert.equal(
    resolveBlogCtaHref("/au/jobs", { country: "AU", career: "electrician" }),
    "/career/australia/electrician",
  )
  assert.equal(
    resolveBlogCtaHref("/blog/study-in-ireland-2026", { country: "ie" }),
    "/blog/study-in-ireland-2026",
  )
})

test("a CTA pointing at Compare becomes a Career Page when explicit blog intent identifies one Career and country", () => {
  const href = resolveBlogCtaHref("/compare?countries=UK,IE&currency=EUR", {
    country: "Australia",
    career: "Registered Nurse",
  })

  assert.equal(href, "/career/australia/registered-nurse")
})

test("published blog CTAs contain no retired funnel destinations or missing blog posts", () => {
  const contentDirectory = path.join(process.cwd(), "content/blog")
  const filenames = fs.readdirSync(contentDirectory).filter((file) => file.endsWith(".mdx"))
  const knownSlugs = new Set(filenames.map((file) => file.replace(/\.mdx$/, "")))

  for (const filename of filenames) {
    const content = fs.readFileSync(path.join(contentDirectory, filename), "utf8")
    const hrefs = [
      ...content.matchAll(/(?:href|secondaryHref)="([^"]+)"/g),
      ...content.matchAll(/\]\((\/[^)\s]+)\)/g),
    ].map((match) => match[1])
    const currentSlug = filename.replace(/\.mdx$/, "")

    for (const href of hrefs) {
      const pathname = href.split(/[?#]/, 1)[0]
      assert.ok(
        !["/checklist", "/timeline", "/degree-risk"].includes(pathname),
        `${filename} still links a CTA to retired journey ${href}`,
      )
      if (pathname.startsWith("/blog/")) {
        const linkedSlug = pathname.slice("/blog/".length)
        assert.ok(knownSlugs.has(linkedSlug), `${filename} links missing post ${href}`)
        assert.notEqual(linkedSlug, currentSlug, `${filename} links to itself`)
      }
      if (pathname === "/compare") {
        const countries = paramsFor(href).get("countries")?.split(",").filter(Boolean) ?? []
        assert.ok(countries.length <= 4, `${filename} asks Compare for more than four countries`)
      }
    }
  }
})

test("the relaunch advertises an audited Blog sitemap without restoring destructive legacy redirects", () => {
  const blogLibrary = fs.readFileSync(path.join(process.cwd(), "src/lib/blog.ts"), "utf8")
  const blogSitemap = fs.readFileSync(path.join(process.cwd(), "src/app/blog/sitemap.ts"), "utf8")
  const robots = fs.readFileSync(path.join(process.cwd(), "src/app/robots.ts"), "utf8")
  const nextConfig = fs.readFileSync(path.join(process.cwd(), "next.config.mjs"), "utf8")

  for (const holdout of [
    "best-country-to-study-indian-students-2026",
    "ielts-score-requirements-2026",
    "ireland-language-school-guide-2026",
    "study-abroad-checklist-korean-students-2026",
  ]) {
    assert.match(blogLibrary, new RegExp(holdout))
  }
  assert.match(blogSitemap, /getPublishedBlogPosts/)
  assert.match(robots, /blog\/sitemap\.xml/)
  assert.doesNotMatch(nextConfig, /source:\s*["']\/blog\/:path\*["']/)
})

test("the main sitemap publishes source-backed routes instead of retired decision funnels", () => {
  const sitemap = fs.readFileSync(path.join(process.cwd(), "src/app/sitemap.ts"), "utf8")
  assert.match(sitemap, /ROUTE_GUIDES/)
  assert.doesNotMatch(sitemap, /\$\{BASE\}\/compare/)
  assert.doesNotMatch(sitemap, /\$\{BASE\}\/degree-risk/)
})
