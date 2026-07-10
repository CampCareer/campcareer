import profiles from "../src/data/jp-jobtag-occupation-profiles.json"

const rows = profiles as Array<{
  localName: string
  translationStatus: string
  skills: unknown[]
  qualificationsJa: unknown[]
}>

if (rows.length < 500) {
  throw new Error("Japan occupation cards require the official Job Tag import.")
}
if (rows.some((row) => !row.localName || row.translationStatus !== "pending")) {
  throw new Error("Japan occupation cards must remain non-indexable until reviewed translations are imported.")
}
if (rows.filter((row) => row.skills.length > 0).length < 400) {
  throw new Error("Japan occupation cards have insufficient official skill coverage.")
}

console.log(`[jp-occupation-cards] ${rows.length} Job Tag-backed cards are ready for translation review; none is indexable before reviewed translations and course evidence.`)
