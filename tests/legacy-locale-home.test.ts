import assert from "node:assert/strict"
import test from "node:test"
import { getLegacyLocaleHomeRedirect, getLocaleNavigationPath } from "../src/lib/i18n/legacy-locale-home"

test("retired locale Home roots and workspace aliases resolve to bare canonical paths", () => {
  assert.equal(getLegacyLocaleHomeRedirect("/", null), null)
  assert.equal(getLegacyLocaleHomeRedirect("/results", null), "/")
  assert.equal(getLegacyLocaleHomeRedirect("/home", null), "/")
  assert.equal(getLegacyLocaleHomeRedirect("/en", null), "/")
  assert.equal(getLegacyLocaleHomeRedirect("/ko", "ko"), "/")
  assert.equal(getLegacyLocaleHomeRedirect("/zh-hans", "zh-Hans"), "/")
  assert.equal(getLegacyLocaleHomeRedirect("/ko/home", "ko"), "/")
  assert.equal(getLegacyLocaleHomeRedirect("/ko/maps", "ko"), "/maps")
  assert.equal(getLegacyLocaleHomeRedirect("/en/compare", null), "/compare")
  assert.equal(getLegacyLocaleHomeRedirect("/es-419/visas", "es"), "/visas")
})

test("reviewed locale content is not swept into the Home redirect", () => {
  assert.equal(getLegacyLocaleHomeRedirect("/ko/fr", "ko"), null)
  assert.equal(getLegacyLocaleHomeRedirect("/ko/maps/au/registered-nurses", "ko"), null)
})

test("language controls keep canonical Workspace paths bare", () => {
  assert.equal(getLocaleNavigationPath("/", "ko"), "/")
  assert.equal(getLocaleNavigationPath("/ko/home", "en"), "/")
  assert.equal(getLocaleNavigationPath("/maps", "ko"), "/maps")
  assert.equal(getLocaleNavigationPath("/ko/fr", "en"), "/fr")
})
