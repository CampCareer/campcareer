import assert from "node:assert/strict"
import test from "node:test"
import sitemap from "../src/app/sitemap"
import { ROUTE_GUIDES, routeGuideHref } from "../src/data/route-guides"

test("the sitemap publishes canonical Home, maps, legal pages, and verified routes", () => {
  const entries = sitemap()
  const urls = entries.map((entry) => entry.url)

  assert.ok(urls.includes("https://www.campcareer.com/home"))
  assert.equal(urls.includes("https://www.campcareer.com/ko"), false)
  assert.ok(urls.includes("https://www.campcareer.com/maps"))
  for (const guide of ROUTE_GUIDES) {
    assert.ok(urls.includes(`https://www.campcareer.com${routeGuideHref(guide)}`))
    assert.ok(urls.includes(`https://www.campcareer.com/ko${routeGuideHref(guide)}`))
  }
  assert.equal(urls.some((url) => url.includes("/au/majors/")), false)
  assert.equal(urls.some((url) => url.includes("/roi-explorer")), false)
  assert.equal(urls.some((url) => url.includes("/countries/")), false)
})
