import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const landing = readFileSync("src/app/(workspace)/home/home-hub.tsx", "utf8")
const search = readFileSync("src/app/(workspace)/home/home-search-form.tsx", "utf8")
const topNav = readFileSync("src/components/layout/top-nav.tsx", "utf8")
const workspaceTopbar = readFileSync("src/components/workspace/workspace-topbar.tsx", "utf8")
const shell = readFileSync("src/components/layout/layout-shell.tsx", "utf8")
const canonicalCareer = readFileSync("src/app/(workspace)/career/[country]/[career]/page.tsx", "utf8")
const legacyCareer = readFileSync("src/app/(workspace)/career/career-result-page.tsx", "utf8")

test("FIFO landing keeps the conversion-first hero and evidence-first research panel", () => {
  assert.match(landing, /Find your fastest path into high-paying work/)
  assert.match(landing, /Compare FIFO jobs, required tickets, entry difficulty and real pay/)
  assert.match(landing, /Explore FIFO Jobs/)
  assert.match(landing, /Top FIFO Paths/)
  assert.match(landing, /Best Jobs for Beginners/)
  assert.match(landing, /Tickets That Matter/)
  assert.match(landing, /Real FIFO Pay/)
  assert.match(landing, /FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE/)
  assert.match(landing, /EDITION 1\.0 · COMPLETE/)
  assert.doesNotMatch(landing, /COMING SOON|Australia FIFO Entry Report 2026/)
  assert.match(landing, /We publish scores only after pay, demand, training burden and first-job evidence are verified/)
})

test("legacy landing dropdowns still close when the user clicks outside the active selector", () => {
  assert.match(search, /useRef<HTMLDivElement>/)
  assert.match(search, /document\.addEventListener\("pointerdown", closeOnOutsidePointer\)/)
  assert.match(search, /!rootRef\.current\?\.contains\(target\)/)
  assert.match(search, /document\.removeEventListener\("pointerdown", closeOnOutsidePointer\)/)
})

test("homepage may use a sticky translucent FIFO nav while existing Career surfaces keep opaque white canvases", () => {
  assert.match(topNav, /normalizedPath === "\/"/)
  assert.match(topNav, /bg-white\/95 backdrop-blur/)
  assert.match(topNav, /h-16 border-b border-\[hsl\(var\(--cc-border\)\)\] bg-white/)
  assert.match(workspaceTopbar, /h-16 border-b border-\[hsl\(var\(--cc-border\)\)\] bg-white/)
  assert.match(workspaceTopbar, /mx-auto flex h-16 w-full max-w-\[1240px\]/)
  assert.doesNotMatch(workspaceTopbar, /bg-white\/95|backdrop-blur/)
  assert.match(shell, /flex min-h-screen flex-col bg-white/)
  assert.match(shell, /<main className="flex-1 bg-white">/)
  assert.match(canonicalCareer, /cc-result-motion min-h-\[calc\(100vh-4rem\)\] bg-white/)
  assert.match(legacyCareer, /cc-result-motion min-h-\[calc\(100vh-4rem\)\] bg-white/)
})