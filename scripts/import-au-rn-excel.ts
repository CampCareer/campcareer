import fs from "fs";
import path from "path";
import XLSX from "xlsx";

interface CourseEntry {
  institutionId: string;
  courseCode: string;
  url: string;
}

interface FactEntry {
  institutionId: string;
  courseCode: string;
  fieldKey: string;
  value: string | object;
  sourceUrl: string;
  reviewerNote?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

const workbook = XLSX.readFile(path.join(process.cwd(), "souces/Australia/australia_rn_entry_programs_2026-07-30.xlsx"));

function parseMainPrograms() {
  const sheet = workbook.Sheets["01_Main_Programs"];
  const data = XLSX.utils.sheet_to_json(sheet);
  const results = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const provider = row["International-Comparable Registered Nurse Entry Programs"];
    const courseTitle = row["__EMPTY_2"];
    const cricos = row["__EMPTY_4"];
    const campus = row["__EMPTY_6"];
    const state = row["__EMPTY_7"];
    const studyMode = row["__EMPTY_8"];
    const duration = row["__EMPTY_9"];
    const intakes = row["__EMPTY_10"];
    const fee = row["__EMPTY_11"];
    const feeYear = row["__EMPTY_12"];
    const feeBasis = row["__EMPTY_13"];
    const english = row["__EMPTY_14"];
    const entryReq = row["__EMPTY_15"];
    const prereq = row["__EMPTY_16"];
    const approval = row["__EMPTY_18"];
    const confidence = row["__EMPTY_20"];
    const notes = row["__EMPTY_22"];
    const url = row["__EMPTY_23"];
    const ahpraUrl = row["__EMPTY_26"];
    const checkedAt = row["__EMPTY_28"];

    if (!provider || !courseTitle || !cricos || !url) continue;

    // Convert provider name to institutionId
    const institutionId = provider
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .replace("university-of-", "")
      .replace("university-", "")
      .replace("university", "")
      .replace("--", "-")
      .replace(/^-|-$/g, "");

    results.push({
      provider,
      institutionId,
      courseTitle,
      cricos,
      campus,
      state,
      studyMode,
      duration,
      intakes,
      fee,
      feeYear,
      feeBasis,
      english,
      entryReq,
      prereq,
      approval,
      confidence,
      notes,
      url,
      ahpraUrl,
      checkedAt: checkedAt || "2026-07-30"
    });
  }
  return results;
}

function parseVerifiedCandidates() {
  const sheet = workbook.Sheets["05_Verified_Candidates"];
  const data = XLSX.utils.sheet_to_json(sheet);
  const results = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const provider = row["Verified Website Comparison Card Candidates"];
    const courseTitle = row["__EMPTY"];
    const cricos = row["__EMPTY_1"];
    const campuses = row["__EMPTY_2"];
    const duration = row["__EMPTY_3"];
    const intakes = row["__EMPTY_4"];
    const fee = row["__EMPTY_5"];
    const feeYear = row["__EMPTY_6"];
    const studyMode = row["__EMPTY_7"];
    const approval = row["__EMPTY_8"];
    const url = row["__EMPTY_9"];
    const ahpraUrl = row["__EMPTY_10"];
    const checkedAt = row["__EMPTY_11"];

    if (!provider || !courseTitle || !cricos || !url) continue;

    const institutionId = provider
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .replace("university-of-", "")
      .replace("university-", "")
      .replace("university", "")
      .replace("--", "-")
      .replace(/^-|-$/g, "");

    results.push({
      provider,
      institutionId,
      courseTitle,
      cricos,
      campuses,
      duration,
      intakes,
      fee,
      feeYear,
      studyMode,
      approval,
      url,
      ahpraUrl,
      checkedAt: checkedAt || "2026-07-30"
    });
  }
  return results;
}

const mainPrograms = parseMainPrograms();
const verifiedCandidates = parseVerifiedCandidates();

// Merge: verified candidates override main programs for same course
const merged = new Map<string, any>();
for (const p of mainPrograms) {
  merged.set(`${p.institutionId}|${p.cricos}`, p);
}
for (const v of verifiedCandidates) {
  merged.set(`${v.institutionId}|${v.cricos}`, v);
}

console.log("Total unique courses:", merged.size);

// Load existing files
const coursesPath = path.join(process.cwd(), "data/curated/au/official-course-urls.json");
const factsPath = path.join(process.cwd(), "data/curated/au/program-page-facts.json");

const existingCourses = JSON.parse(fs.readFileSync(coursesPath, "utf-8")) as CourseEntry[];
const existingFacts = JSON.parse(fs.readFileSync(factsPath, "utf-8")) as FactEntry[];

const existingCourseKeys = new Set(existingCourses.map(c => `${c.institutionId}|${c.courseCode}`));
const existingFactKeys = new Set(existingFacts.map(f => `${f.institutionId}|${f.courseCode}|${f.fieldKey}`));

let addedCourses = 0;
let addedFacts = 0;

for (const [key, course] of merged) {
  // Add to official-course-urls.json
  if (!existingCourseKeys.has(key)) {
    existingCourses.push({
      institutionId: course.institutionId,
      courseCode: course.cricos,
      url: course.url
    });
    existingCourseKeys.add(key);
    addedCourses++;
  }

  // Add facts to program-page-facts.json
  const factsToAdd = [
    { fieldKey: "duration", value: course.duration || course.duration_full_time },
    { fieldKey: "campus", value: course.campus || course.campuses },
    { fieldKey: "intakes", value: course.intakes },
    { fieldKey: "annual_tuition_aud", value: course.fee ? { amountAud: course.fee, year: course.feeYear || 2026, basis: course.feeBasis || "annual" } : undefined },
    { fieldKey: "english_requirement", value: course.english },
    { fieldKey: "entry_requirements", value: course.entryReq },
    { fieldKey: "prerequisite_subjects", value: course.prereq },
    { fieldKey: "study_mode", value: course.studyMode },
    { fieldKey: "approval_status", value: course.approval },
    { fieldKey: "data_confidence", value: course.confidence },
    { fieldKey: "notes", value: course.notes }
  ];

  for (const fact of factsToAdd) {
    if (!fact.value) continue;
    const factKey = `${course.institutionId}|${course.cricos}|${fact.fieldKey}`;
    if (!existingFactKeys.has(factKey)) {
      existingFacts.push({
        institutionId: course.institutionId,
        courseCode: course.cricos,
        fieldKey: fact.fieldKey,
        value: fact.value,
        sourceUrl: course.url,
        reviewerNote: course.notes,
        effectiveFrom: "2026-01-01",
        effectiveTo: "2026-12-31"
      });
      existingFactKeys.add(factKey);
      addedFacts++;
    }
  }
}

fs.writeFileSync(coursesPath, JSON.stringify(existingCourses, null, 2));
fs.writeFileSync(factsPath, JSON.stringify(existingFacts, null, 2));

console.log(`\nAdded ${addedCourses} courses to official-course-urls.json`);
console.log(`Added ${addedFacts} facts to program-page-facts.json`);
console.log(`Total courses: ${existingCourses.length}`);
console.log(`Total facts: ${existingFacts.length}`);