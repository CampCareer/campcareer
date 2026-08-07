import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import nextConfig from "../next.config.mjs"
import robots from "../src/app/robots"
import sitemap from "../src/app/sitemap"
import {
  CANONICAL_COUNTRY_SLUGS,
  HOME_CANONICAL_PATH,
  LEGACY_SEO_REDIRECTS,
  SITE_URL,
  countryCanonicalPath,
  isLegacyGonePath,
  programsCanonicalPath,
} from "../src/lib/seo-routes.mjs"

function sitemapUrls() {
  return sitemap().map((entry) => entry.url)
}

test("the canonical home is root and /home is never emitted by the sitemap", () => {
  const urls = sitemapUrls()
  const homeSource = readFileSync("src/app/(workspace)/page.tsx", "utf8")
  const legacyHomeSource = readFileSync("src/app/(workspace)/home/page.tsx", "utf8")

  assert.equal(HOME_CANONICAL_PATH, "/")
  assert.ok(homeSource.includes("alternates: { canonical: HOME_CANONICAL_PATH }"))
  assert.ok(legacyHomeSource.includes("permanentRedirect(HOME_CANONICAL_PATH)"))
  assert.ok(urls.includes(`${SITE_URL}/`))
  assert.ok(!urls.includes(`${SITE_URL}/home`))
})

test("country sitemap entries use only /countries/{code}", () => {
  const urls = sitemapUrls()

  for (const slug of CANONICAL_COUNTRY_SLUGS) {
    assert.ok(urls.includes(`${SITE_URL}${countryCanonicalPath(slug)}`))
    assert.ok(!urls.includes(`${SITE_URL}/${slug}`))
  }
})

test("each country page declares the same canonical URL format", () => {
  for (const slug of CANONICAL_COUNTRY_SLUGS) {
    const source = readFileSync(`src/app/(workspace)/countries/${slug}/page.tsx`, "utf8")
    assert.ok(
      source.includes(`alternates: { canonical: "/countries/${slug}" }`),
      `${slug} must self-canonicalize to ${countryCanonicalPath(slug)}`,
    )
  }
})

test("legacy redirect sources never appear in the sitemap and targets do", () => {
  const urls = new Set(sitemapUrls())

  for (const redirect of LEGACY_SEO_REDIRECTS) {
    assert.ok(!urls.has(`${SITE_URL}${redirect.source}`))
    assert.ok(urls.has(redirect.destination === "/" ? `${SITE_URL}/` : `${SITE_URL}${redirect.destination}`))
    assert.equal(redirect.permanent, true)
  }
})

test("Next redirects wire the centralized permanent SEO registry before broad legacy rules", async () => {
  const redirects = await nextConfig.redirects()

  assert.deepEqual(redirects.slice(0, LEGACY_SEO_REDIRECTS.length), [...LEGACY_SEO_REDIRECTS])
  assert.ok(!redirects.some((redirect) => redirect.source === "/" && redirect.destination === "/home"))
  assert.deepEqual(
    redirects.find((redirect) => redirect.source === "/home"),
    { source: "/home", destination: "/", permanent: true },
  )
})

test("legacy country roots redirect permanently to their canonical country pages", () => {
  for (const slug of CANONICAL_COUNTRY_SLUGS) {
    assert.deepEqual(
      LEGACY_SEO_REDIRECTS.find((redirect) => redirect.source === `/${slug}`),
      { source: `/${slug}`, destination: countryCanonicalPath(slug), permanent: true },
    )
  }
})

test("sitemap URLs are unique and the Programs base canonical matches the sitemap", () => {
  const urls = sitemapUrls()
  const programsSource = readFileSync("src/app/(workspace)/programs/page.tsx", "utf8")

  assert.equal(new Set(urls).size, urls.length)
  assert.equal(programsCanonicalPath("AU"), "/programs")
  assert.ok(programsSource.includes("programsCanonicalPath(filters.country)"))
  assert.ok(urls.includes(`${SITE_URL}${programsCanonicalPath("AU")}`))
})

test("robots points at the same production sitemap without blocking canonical country pages", () => {
  const value = robots()

  assert.equal(value.sitemap, `${SITE_URL}/sitemap.xml`)
  assert.ok(!JSON.stringify(value.rules).includes("/countries"))
})

test("only verified retired URL families are treated as gone", () => {
  assert.equal(isLegacyGonePath("/2021/05/old-post"), true)
  assert.equal(isLegacyGonePath("/category/old"), true)
  assert.equal(isLegacyGonePath("/jobs/old-card"), true)
  assert.equal(isLegacyGonePath("/countries/au"), false)
  assert.equal(isLegacyGonePath("/programs"), false)
})
