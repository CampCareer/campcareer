import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import sharp from "sharp"

const previews = [
  {
    modulePath: "src/lib/fifo/report-preview-jobs.ts",
    publicPath: "/fifo/report-previews/jobs.jpg",
    assetPath: "public/fifo/report-previews/jobs.jpg",
  },
  {
    modulePath: "src/lib/fifo/report-preview-pathways.ts",
    publicPath: "/fifo/report-previews/pathways.jpg",
    assetPath: "public/fifo/report-previews/pathways.jpg",
  },
] as const

test("FIFO report repaired previews use decodable static JPEG assets", async () => {
  for (const preview of previews) {
    const moduleSource = readFileSync(preview.modulePath, "utf8")
    assert.ok(moduleSource.includes(`src: \"${preview.publicPath}\"`))

    const asset = readFileSync(preview.assetPath)
    const metadata = await sharp(asset).metadata()
    assert.equal(metadata.format, "jpeg")
    assert.equal(metadata.width, 420)
    assert.equal(metadata.height, 487)
  }
})
