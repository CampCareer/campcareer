import fs from "fs";
import path from "path";

interface CourseEntry {
  institutionId: string;
  courseCode: string;
  url: string;
}

const coursesPath = path.join(process.cwd(), "data/curated/au/official-course-urls.json");
const courses = JSON.parse(fs.readFileSync(coursesPath, "utf-8")) as CourseEntry[];

// Only keep nursing courses from the EXCEL verified data (15 courses)
// These are the institutionIds that match the Excel import
const VERIFIED_INSTITUTION_IDS = new Set([
  "queensland-university-of-technology",
  "university-of-the-sunshine-coast",
  "deakin-university",
  "rmit-university",
  "western-sydney-university",
  "flinders-university",
  "edith-cowan-university",
  "university-of-tasmania",
  "charles-darwin-university",
  "university-of-wollongong",
  "the-university-of-queensland",
  // Also keep the original monash
  "monash-university"
]);

// Filter: keep only verified nursing courses + the original monash
const filtered = courses.filter(c => {
  const isNursing = c.url.toLowerCase().includes("nursing") || c.url.toLowerCase().includes("nurse");
  if (!isNursing) return true; // Keep non-nursing courses
  
  // For nursing, only keep verified ones
  return VERIFIED_INSTITUTION_IDS.has(c.institutionId);
});

console.log(`Total courses: ${courses.length} -> ${filtered.length} (removed ${courses.length - filtered.length} nursing)`);

// Also deduplicate by institutionId+courseCode
const seen = new Set<string>();
const deduped = filtered.filter(c => {
  const key = `${c.institutionId}|${c.courseCode}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log(`After dedup: ${deduped.length}`);

fs.writeFileSync(coursesPath, JSON.stringify(deduped, null, 2));
console.log("Done");