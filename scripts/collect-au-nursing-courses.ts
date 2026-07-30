import fs from "fs";
import path from "path";

interface CourseEntry {
  institutionId: string;
  courseCode: string;
  url: string;
}

const NURSING_COURSES: CourseEntry[] = [
  // Group of Eight
  { institutionId: "australian-national-university", courseCode: "095941M", url: "https://www.anu.edu.au/study/program/bachelor-of-nursing-3894" },
  { institutionId: "the-university-of-melbourne", courseCode: "095941M", url: "https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-nursing/" },
  { institutionId: "the-university-of-sydney", courseCode: "000701G", url: "https://www.sydney.edu.au/courses/courses-uc/bachelor-of-nursing-advanced-studies.html" },
  { institutionId: "university-of-new-south-wales", courseCode: "088936C", url: "https://www.unsw.edu.au/study/undergraduate/bachelor-of-nursing" },
  { institutionId: "university-of-queensland", courseCode: "088936C", url: "https://study.uq.edu.au/study-options/bachelor-nursing" },
  { institutionId: "monash-university", courseCode: "075119J", url: "https://www.monash.edu/study/courses/find-a-course/nursing-m2006" },
  { institutionId: "university-of-western-australia", courseCode: "088936C", url: "https://www.uwa.edu.au/study/courses/bachelor-of-nursing" },
  { institutionId: "university-of-adelaide", courseCode: "088936C", url: "https://www.adelaide.edu.au/degree-finder/2025/bnur.html" },

  // Other major universities
  { institutionId: "queensland-university-of-technology", courseCode: "088936C", url: "https://www.qut.edu.au/study/courses/bachelor-of-nursing" },
  { institutionId: "griffith-university", courseCode: "088936C", url: "https://www.griffith.edu.au/study/course/bachelor-of-nursing-1028" },
  { institutionId: "james-cook-university", courseCode: "088936C", url: "https://www.jcu.edu.au/courses/bachelor-of-nursing-science" },
  { institutionId: "university-of-southern-queensland", courseCode: "088936C", url: "https://www.unisq.edu.au/study/degrees/bachelor-of-nursing" },
  { institutionId: "central-queensland-university", courseCode: "088936C", url: "https://www.cqu.edu.au/courses/bachelor-of-nursing" },
  { institutionId: "university-of-the-sunshine-coast", courseCode: "088936C", url: "https://www.usc.edu.au/study/courses/bachelor-of-nursing" },
  { institutionId: "southern-cross-university", courseCode: "088936C", url: "https://www.scu.edu.au/study-at-scu/courses/bachelor-of-nursing" },

  { institutionId: "university-of-technology-sydney", courseCode: "088936C", url: "https://www.uts.edu.au/study/health/bachelor-of-nursing" },
  { institutionId: "western-sydney-university", courseCode: "088936C", url: "https://www.westernsydney.edu.au/future/study/courses/bachelor-of-nursing.html" },
  { institutionId: "macquarie-university", courseCode: "088936C", url: "https://www.mq.edu.au/study/find-a-course/courses/bachelor-of-nursing" },
  { institutionId: "charles-sturt-university", courseCode: "088936C", url: "https://study.csu.edu.au/courses/bachelor-of-nursing" },
  { institutionId: "university-of-new-england", courseCode: "088936C", url: "https://www.une.edu.au/study/online/bachelor-of-nursing" },
  { institutionId: "university-of-wollongong", courseCode: "088936C", url: "https://www.uow.edu.au/study/bachelor-of-nursing" },
  { institutionId: "university-of-newcastle", courseCode: "088936C", url: "https://www.newcastle.edu.au/degrees/bachelor-of-nursing" },

  { institutionId: "deakin-university", courseCode: "088936C", url: "https://www.deakin.edu.au/course/bachelor-of-nursing" },
  { institutionId: "rmit-university", courseCode: "088936C", url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-nursing-bp312" },
  { institutionId: "la-trobe-university", courseCode: "088936C", url: "https://www.latrobe.edu.au/courses/bachelor-of-nursing" },
  { institutionId: "swinburne-university-of-technology", courseCode: "088936C", url: "https://www.swinburne.edu.au/study/courses/bachelor-of-nursing/" },
  { institutionId: "federation-university", courseCode: "088936C", url: "https://federation.edu.au/study/courses/bachelor-of-nursing" },
  { institutionId: "victoria-university", courseCode: "088936C", url: "https://www.vu.edu.au/courses/bachelor-of-nursing" },

  { institutionId: "curtin-university", courseCode: "088936C", url: "https://www.curtin.edu.au/study/course/bachelor-of-nursing" },
  { institutionId: "edith-cowan-university", courseCode: "088936C", url: "https://www.ecu.edu.au/degrees/bachelor-of-nursing" },
  { institutionId: "murdoch-university", courseCode: "088936C", url: "https://www.murdoch.edu.au/study/courses/bachelor-of-nursing" },
  { institutionId: "university-of-notre-dame-australia", courseCode: "088936C", url: "https://www.notredame.edu.au/study/nursing/bachelor-of-nursing" },

  { institutionId: "flinders-university", courseCode: "088936C", url: "https://www.flinders.edu.au/study/courses/bachelor-of-nursing" },
  { institutionId: "university-of-south-australia", courseCode: "088936C", url: "https://www.unisa.edu.au/study/bachelor-of-nursing" },
  { institutionId: "torrens-university-australia", courseCode: "088936C", url: "https://www.torrens.edu.au/courses/bachelor-of-nursing" },

  { institutionId: "university-of-tasmania", courseCode: "088936C", url: "https://www.utas.edu.au/study/bachelor-of-nursing" },
  { institutionId: "charles-darwin-university", courseCode: "088936C", url: "https://www.cdu.edu.au/study/bachelor-of-nursing" },
  { institutionId: "canberra-university", courseCode: "088936C", url: "https://www.canberra.edu.au/course/bachelor-of-nursing" },

  // Graduate Entry / Master of Nursing (2-year)
  { institutionId: "the-university-of-melbourne", courseCode: "095941M", url: "https://study.unimelb.edu.au/find/courses/graduate/master-of-nursing-science/" },
  { institutionId: "university-of-sydney", courseCode: "088936C", url: "https://www.sydney.edu.au/courses/courses-pg/master-of-nursing.html" },
  { institutionId: "monash-university", courseCode: "088936C", url: "https://www.monash.edu/study/courses/find-a-course/master-of-nursing-practice-m6009" },
  { institutionId: "university-of-queensland", courseCode: "088936C", url: "https://study.uq.edu.au/study-options/master-of-nursing-studies" },
  { institutionId: "queensland-university-of-technology", courseCode: "088936C", url: "https://www.qut.edu.au/study/courses/master-of-nursing" },
  { institutionId: "deakin-university", courseCode: "088936C", url: "https://www.deakin.edu.au/course/master-of-nursing" },
  { institutionId: "university-of-technology-sydney", courseCode: "088936C", url: "https://www.uts.edu.au/study/health/master-of-nursing" },
  { institutionId: "flinders-university", courseCode: "088936C", url: "https://www.flinders.edu.au/study/courses/master-of-nursing" },
  { institutionId: "university-of-south-australia", courseCode: "088936C", url: "https://www.unisa.edu.au/study/master-of-nursing" },
  { institutionId: "curtin-university", courseCode: "088936C", url: "https://www.curtin.edu.au/study/course/master-of-nursing" },
  { institutionId: "edith-cowan-university", courseCode: "088936C", url: "https://www.ecu.edu.au/degrees/master-of-nursing" },
  { institutionId: "university-of-tasmania", courseCode: "088936C", url: "https://www.utas.edu.au/study/master-of-nursing" },

  // Enrolled Nurse (Diploma) - TAFE / VET providers
  { institutionId: "tafe-nsw", courseCode: "088936C", url: "https://www.tafensw.edu.au/courses/nursing/diploma-of-nursing" },
  { institutionId: "tafe-victoria", courseCode: "088936C", url: "https://www.tafe.vic.gov.au/courses/diploma-of-nursing" },
  { institutionId: "tafe-queensland", courseCode: "088936C", url: "https://tafeqld.edu.au/courses/nursing/diploma-of-nursing" },
  { institutionId: "tafe-south-australia", courseCode: "088936C", url: "https://www.tafesa.edu.au/courses/nursing/diploma-of-nursing" },
  { institutionId: "north-metropolitan-tafe", courseCode: "088936C", url: "https://www.northmetrotafe.wa.edu.au/courses/diploma-of-nursing" },
  { institutionId: "south-metropolitan-tafe", courseCode: "088936C", url: "https://www.southmetrotafe.wa.edu.au/courses/diploma-of-nursing" },
];

async function main() {
  const filePath = path.join(process.cwd(), "data/curated/au/official-course-urls.json");
  const existing = JSON.parse(fs.readFileSync(filePath, "utf-8")) as CourseEntry[];

  const existingKeys = new Set(existing.map(c => `${c.institutionId}|${c.courseCode}`));
  let added = 0;

  for (const course of NURSING_COURSES) {
    const key = `${course.institutionId}|${course.courseCode}`;
    if (!existingKeys.has(key)) {
      existing.push(course);
      existingKeys.add(key);
      added++;
      console.log(`Added: ${course.institutionId} - ${course.url}`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log(`\nDone. Added ${added} nursing courses. Total: ${existing.length}`);
}

main().catch(console.error);