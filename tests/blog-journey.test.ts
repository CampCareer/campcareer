import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import posts from "../src/data/blog-manifest.json"
import {
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

test("legacy blog CTA targets resolve to Compare while ordinary editorial links stay unchanged", () => {
  const legacy = resolveBlogCtaHref("/degree-risk", { country: "ie", career: "accountant" })
  assert.equal(new URL(legacy, APP_ORIGIN).pathname, "/compare")
  assert.equal(paramsFor(legacy).get("countries"), "IE")
  assert.equal(paramsFor(legacy).get("career"), "accountant")
  assert.equal(
    resolveBlogCtaHref("/blog/study-in-ireland-2026", { country: "ie" }),
    "/blog/study-in-ireland-2026",
  )
})

test("a CTA pointing at Compare carries explicit blog intent and preserves safe existing query values", () => {
  const href = resolveBlogCtaHref("/compare?countries=UK,IE&currency=EUR", {
    country: "Australia",
    career: "Registered Nurse",
  })
  const params = paramsFor(href)

  assert.equal(params.get("countries"), "AU")
  assert.equal(params.get("career"), "registered-nurse")
  assert.equal(params.get("currency"), "EUR")
})

test("published blog CTAs contain no legacy funnel destinations or missing blog posts", () => {
  const knownSlugs = new Set(posts.map((post) => post.slug))
  const contentDirectory = path.join(process.cwd(), "content/blog")

  for (const filename of fs.readdirSync(contentDirectory).filter((file) => file.endsWith(".mdx"))) {
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

test("the sitemap publishes Compare instead of the retired degree-risk funnel", () => {
  const sitemap = fs.readFileSync(path.join(process.cwd(), "src/app/sitemap.ts"), "utf8")
  assert.match(sitemap, /\$\{BASE\}\/compare/)
  assert.doesNotMatch(sitemap, /\$\{BASE\}\/degree-risk/)
})
