import profiles from "../src/data/jp-jobtag-occupation-profiles.json"
import wageLinks from "../src/data/jp-jobtag-wage-links.json"
import snapshots from "../src/data/jp-jobtag-source-snapshots.json"

const rows = profiles as Array<{ recordNumber: number; localName: string; skills: unknown[]; qualificationsJa: string[]; sourceVersion: string; reviewStatus: string }>
const issues: string[] = []
if (rows.length < 500) issues.push(`Expected at least 500 Job Tag profiles, found ${rows.length}.`)
if (rows.some((row) => !Number.isInteger(row.recordNumber) || !row.localName || row.reviewStatus !== "review-required")) issues.push("Job Tag profile rows are incomplete or incorrectly approved.")
if (rows.filter((row) => row.skills.length > 0).length / rows.length < 0.8) issues.push("Job Tag skill coverage is unexpectedly low.")
if (Object.keys(wageLinks as Record<string, number[]>).length < 100) issues.push("Job Tag wage crosswalk is unexpectedly incomplete.")
if ((snapshots as Array<{ hash: string; attribution: string }>).length !== 3 || (snapshots as Array<{ hash: string | null }>).some((snapshot) => !snapshot.hash)) issues.push("Job Tag source snapshots are incomplete.")
if (issues.length > 0) {
  console.error("[jp-jobtag] failed")
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}
console.log(`[jp-jobtag] ${rows.length} official profiles and ${Object.keys(wageLinks as Record<string, number[]>).length} wage-code mappings passed validation; translations remain review-required.`)
