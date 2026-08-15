import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

function readSource(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8")
}

test("canonical Career detail pages bypass nested workspace chrome", () => {
  const source = readSource("src/components/workspace/workspace-shell.tsx")

  assert.match(
    source,
    /pathname === "\/career" \|\| pathname\.startsWith\("\/career\/"\)/,
  )
})

test("Programs career context links back through the canonical Career resolver", () => {
  const source = readSource("src/app/(workspace)/programs/programs-header.tsx")

  assert.match(source, /getCareerRoute\(filters\.country, career\.id\)/)
  assert.doesNotMatch(source, /`\/career\?country=/)
})

test("Pay evidence copy does not overstate estimated evidence as verified", () => {
  const source = readSource("src/app/(workspace)/career/career-core-sections.tsx")

  assert.doesNotMatch(source, /Verified annual pay signal/)
  assert.doesNotMatch(source, /확인된 연간 보수 지표/)
})

test("public Career payload strips legacy foundation totals and gates the public score", () => {
  const source = readSource("src/lib/workspace/public-career-market-read.ts")

  assert.match(source, /foundationScoreIsPublic/)
  assert.match(source, /opportunityScore: null/)
  assert.match(
    source,
    /campCareerScore: foundationScoreIsPublic \? insight\.foundation\.campCareerScore : null/,
  )
})

test("unit-test command passes the glob to Node instead of the shell", () => {
  const packageJson = JSON.parse(readSource("package.json")) as {
    scripts?: Record<string, string>
  }

  assert.equal(packageJson.scripts?.["test:unit"], 'tsx --test "tests/**/*.test.ts"')
})
