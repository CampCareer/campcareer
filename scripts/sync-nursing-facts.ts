import fs from "fs";
import path from "path";
import XLSX from "xlsx";

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

function parseAllVerified() {
  // Parse both sheets and merge, with verified candidates taking priority
  const mainSheet = workbook.Sheets["01_Main_Programs"];
  const mainData = XLSX.utils.sheet_to_json(mainSheet);
  const verifiedSheet = workbook.Sheets["05_Verified_Candidates"];
  const verifiedData = XLSX.utils.sheet_to_json(verifiedSheet);
  
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

// Load existing facts
const factsPath = path.join(process.cwd(), "data/curated/au/program-page-facts.json");
const existingFacts = JSON.parse(fs.readFileSync(factsPath, "utf-8")) as FactEntry[];

// Filter out facts for institutionIds NOT in verified list
const verifiedIds = new Set(verified.map(v => v.institutionId));
const filteredFacts = existingFacts.filter(f => {
  // Keep non-nursing facts
  const isNursingFact = f.sourceUrl.toLowerCase().includes("nursing") || f.sourceUrl.toLowerCase().includes("nurse");
  if (!isNursingFact) return true;
  // For nursing facts, only keep verified institutions
  return verifiedIds.has(f.institutionId);
});

console.log(`Facts: ${existingFacts.length} -> ${filteredFacts.length} (removed ${existingFacts.length - filteredFacts.length})`);

// Now add comprehensive facts from verified Excel data
const existingFactKeys = new Set(filteredFacts.map(f => `${f.institutionId}|${f.courseCode}|${f.fieldKey}`));
let addedFacts = 0;

for (const course of verified) {
  const factsToAdd = [
    { fieldKey: "duration", value: course.duration },
    { fieldKey: "campus", value: course.campus },
    { fieldKey: "state", value: course.state },
    { fieldKey: "study_mode", value: course.studyMode },
    { fieldKey: "intakes", value: course.intakes },
    { fieldKey: "annual_tuition_aud", value: course.fee ? { amountAud: course.fee, year: course.feeYear || 2026, basis: course.feeBasis || "annual" } : undefined },
    { fieldKey: "english_requirement", value: course.english },
    { fieldKey: "entry_requirements", value: course.entryReq },
    { fieldKey: "prerequisite_subjects", value: course.prereq },
    { fieldKey: "approval_status", value: course.approval },
    { fieldKey: "data_confidence", value: course.confidence },
    { fieldKey: "notes", value: course.notes },
    { fieldKey: "ahpra_portal_url", value: course.ahpraUrl },
    { fieldKey: "course_title", value: course.courseTitle },
    { fieldKey: "provider_name", value: course.provider }
  ];

  for (const fact of factsToAdd) {
    if (!fact.value) continue;
    const factKey = `${course.institutionId}|${course.cricos}|${fact.fieldKey}`;
    if (!existingFactKeys.has(factKey)) {
      filteredFacts.push({
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

fs.writeFileSync(factsPath, JSON.stringify(filteredFacts, null, 2));
console.log(`\nAdded ${addedFacts} new facts from Excel`);
console.log(`Total facts: ${filteredFacts.length}`);