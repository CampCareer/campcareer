import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import sitemap from "../src/app/sitemap"
import { SITE_URL } from "../src/lib/seo-routes.mjs"

const CANADA_CITY_SLUGS = [
  "toronto",
  "vancouver",
  "montreal",
  "ottawa",
  "calgary",
  "waterloo",
  "edmonton",
] as const

test("published Canada city pages declare unique indexable canonical metadata", () => {
  const titles = new Set<string>()
  const descriptions = new Set<string>()

  for (const slug of CANADA_CITY_SLUGS) {
    const page = readFileSync(`src/app/(workspace)/cities/ca/${slug}/page.tsx`, "utf8")
    const title = page.match(/title: "([^"]+)"/)?.[1]
    const description = page.match(/description:\n\s+"([^"]+)"/)?.[1]

    assert.ok(title, `${slug} should declare a title`)
    assert.ok(description, `${slug} should declare a description`)
    assert.ok(page.includes(`canonical: "/cities/ca/${slug}"`))
    assert.ok(page.includes("robots: { index: true, follow: true }"))
    assert.ok(page.includes('export const dynamic = "force-dynamic"'))

    titles.add(title)
    descriptions.add(description)
  }

  assert.equal(titles.size, CANADA_CITY_SLUGS.length)
  assert.equal(descriptions.size, CANADA_CITY_SLUGS.length)
})

test("Canada city sitemap publication is bounded to the approved seven cities", () => {
  const urls = sitemap().map((entry) => entry.url)
  const canadaCityUrls = urls
    .filter((url) => url.startsWith(`${SITE_URL}/cities/ca/`))
    .sort()
  const expected = CANADA_CITY_SLUGS.map((slug) => `${SITE_URL}/cities/ca/${slug}`).sort()

  assert.deepEqual(canadaCityUrls, expected)
  assert.equal(new Set(canadaCityUrls).size, CANADA_CITY_SLUGS.length)
  assert.ok(urls.every((url) => !url.includes("/compare")))
})

test("Compare remains non-indexable while linking to Canada city profiles", () => {
  const compare = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(compare.includes("robots: { index: false, follow: false }"))
  assert.ok(compare.includes('if (countryCode === "CA")'))
  assert.ok(matrix.includes('href={`/cities/ca/${left.slug}`}'))
  assert.ok(matrix.includes('href={`/cities/ca/${right.slug}`}'))
})
