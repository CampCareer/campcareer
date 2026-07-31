import fs from "fs";
import path from "path";
import XLSX from "xlsx";

const workbook = XLSX.readFile(path.join(process.cwd(), "souces/Australia/australia_rn_entry_programs_2026-07-30.xlsx"));

function parseAllVerified() {
  const mainSheet = workbook.Sheets["01_Main_Programs"];
  const mainData = XLSX.utils.sheet_to_json(mainSheet) as any[];
  const verifiedSheet = workbook.Sheets["05_Verified_Candidates"];
  const verifiedData = XLSX.utils.sheet_to_json(verifiedSheet) as any[];
  
  const merged = new Map<string, any>();
  
  // First pass: main programs
  for (let i = 1; i < mainData.length; i++) {
    const row = mainData[i];
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

    const institutionId = provider
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const course = {
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
    };
    
    merged.set(`${institutionId}|${cricos}`, course);
  }
  
  // Second pass: verified candidates (override)
  for (let i = 1; i < verifiedData.length; i++) {
    const row = verifiedData[i];
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
      .replace(/^-|-$/g, "");

    const course = {
      provider,
      institutionId,
      courseTitle,
      cricos,
      campus: campuses,
      state: "",
      studyMode,
      duration,
      intakes,
      fee,
      feeYear,
      feeBasis: "annual",
      english: "",
      entryReq: "",
      prereq: "",
      approval,
      confidence: "verified",
      notes: "",
      url,
      ahpraUrl,
      checkedAt: checkedAt || "2026-07-30"
    };
    
    merged.set(`${institutionId}|${cricos}`, course);
  }
  
  return Array.from(merged.values());
}

const verified = parseAllVerified();
console.log("Verified courses:", verified.length);
verified.forEach(c => console.log(`  ${c.institutionId} | ${c.cricos} | ${c.courseTitle} | ${c.url}`));

// Load existing courses
const coursesPath = path.join(process.cwd(), "data/curated/au/official-course-urls.json");
const existingCourses = JSON.parse(fs.readFileSync(coursesPath, "utf-8")) as {institutionId: string, courseCode: string, url: string}[];

// Remove existing nursing courses
const nonNursing = existingCourses.filter(c => !c.url.toLowerCase().includes("nursing") && !c.url.toLowerCase().includes("nurse"));
console.log(`Non-nursing courses: ${nonNursing.length}`);

// Add verified nursing courses
const existingKeys = new Set(nonNursing.map(c => `${c.institutionId}|${c.courseCode}`));
let added = 0;
for (const course of verified) {
  const key = `${course.institutionId}|${course.cricos}`;
  if (!existingKeys.has(key)) {
    nonNursing.push({
      institutionId: course.institutionId,
      courseCode: course.cricos,
      url: course.url
    });
    existingKeys.add(key);
    added++;
  }
}

fs.writeFileSync(coursesPath, JSON.stringify(nonNursing, null, 2));
console.log(`\nAdded ${added} verified nursing courses`);
console.log(`Total courses: ${nonNursing.length}`);