import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/route-guides.ts");
const content = fs.readFileSync(filePath, "utf-8");

// 1. Add new RouteSource constants after monashNursing (around line 240)
const newSources = `
const qutNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "Queensland University of Technology",
  sourceType: "education-provider",
  url: "https://www.qut.edu.au/courses/bachelor-of-nursing",
  checkedAt: "2026-07-30",
};

const uniscNursing: RouteSource = {
  name: "Bachelor of Nursing Science",
  operator: "University of the Sunshine Coast",
  sourceType: "education-provider",
  url: "https://www.unisc.edu.au/study/courses-and-programs/bachelor-degrees-undergraduate-programs/bachelor-of-nursing-science",
  checkedAt: "2026-07-30",
};

const uniscNursingGrad: RouteSource = {
  name: "Bachelor of Nursing Science (Graduate Entry)",
  operator: "University of the Sunshine Coast",
  sourceType: "education-provider",
  url: "https://www.unisc.edu.au/study/courses-and-programs/bachelor-degrees-undergraduate-programs/bachelor-of-nursing-science-graduate-entry",
  checkedAt: "2026-07-30",
};

const deakinNursing: RouteSource = {
  name: "Bachelor of Nursing (International)",
  operator: "Deakin University",
  sourceType: "education-provider",
  url: "https://www.deakin.edu.au/course/bachelor-nursing-international",
  checkedAt: "2026-07-30",
};

const rmitNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "RMIT University",
  sourceType: "education-provider",
  url: "https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-nursing-bp032",
  checkedAt: "2026-07-30",
};

const westernSydneyNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "Western Sydney University",
  sourceType: "education-provider",
  url: "https://www.westernsydney.edu.au/future/study/courses/undergraduate/bachelor-of-nursing",
  checkedAt: "2026-07-30",
};

const flindersNursing: RouteSource = {
  name: "Bachelor of Nursing (Preregistration)",
  operator: "Flinders University",
  sourceType: "education-provider",
  url: "https://www.flinders.edu.au/study/courses/bachelor-nursing-preregistration",
  checkedAt: "2026-07-30",
};

const flindersNursingGrad: RouteSource = {
  name: "Bachelor of Nursing (Graduate Entry)",
  operator: "Flinders University",
  sourceType: "education-provider",
  url: "https://www.flinders.edu.au/study/courses/bachelor-nursing-graduate-entry",
  checkedAt: "2026-07-30",
};

const ecuNursing: RouteSource = {
  name: "Bachelor of Science (Nursing)",
  operator: "Edith Cowan University",
  sourceType: "education-provider",
  url: "https://www.ecu.edu.au/degrees/courses/bachelor-of-science-nursing",
  checkedAt: "2026-07-30",
};

const ecuNursingGrad: RouteSource = {
  name: "Master of Nursing (Graduate Entry)",
  operator: "Edith Cowan University",
  sourceType: "education-provider",
  url: "https://www.ecu.edu.au/degrees/courses/master-of-nursing-graduate-entry",
  checkedAt: "2026-07-30",
};

const utasNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "University of Tasmania",
  sourceType: "education-provider",
  url: "https://www.utas.edu.au/courses/health/courses/h3o-bachelor-of-nursing",
  checkedAt: "2026-07-30",
};

const cduNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "Charles Darwin University",
  sourceType: "education-provider",
  url: "https://www.cdu.edu.au/study/course/bachelor-nursing-wnur02?year=2026",
  checkedAt: "2026-07-30",
};

const cduNursingGrad: RouteSource = {
  name: "Master of Nursing Practice (Pre-Registration)",
  operator: "Charles Darwin University",
  sourceType: "education-provider",
  url: "https://www.cdu.edu.au/study/course/master-nursing-practice-pre-registration-snppr2?year=2026",
  checkedAt: "2026-07-30",
};

const uowNursing: RouteSource = {
  name: "Bachelor of Nursing",
  operator: "University of Wollongong",
  sourceType: "education-provider",
  url: "https://www.uow.edu.au/study/courses/bachelor-of-nursing/",
  checkedAt: "2026-07-30",
};

const uqNursingGrad: RouteSource = {
  name: "Master of Nursing (Graduate Entry)",
  operator: "The University of Queensland",
  sourceType: "education-provider",
  url: "https://study.uq.edu.au/study-options/programs/master-nursing-graduate-entry-5776",
  checkedAt: "2026-07-30",
};
`;

// Insert after monashNursing
const monashNursingEnd = content.indexOf("const monashNursing: RouteSource = {");
if (monashNursingEnd === -1) {
  console.error("monashNursing not found");
  process.exit(1);
}

// Find the end of monashNursing block
let braceCount = 0;
let insertPos = -1;
for (let i = monashNursingEnd; i < content.length; i++) {
  if (content[i] === "{") braceCount++;
  else if (content[i] === "}") {
    braceCount--;
    if (braceCount === 0) {
      insertPos = i + 1;
      break;
    }
  }
}

if (insertPos === -1) {
  console.error("Could not find end of monashNursing");
  process.exit(1);
}

const newContent = content.slice(0, insertPos) + newSources + content.slice(insertPos);
fs.writeFileSync(filePath, newContent);
console.log("Added 14 new RouteSource constants");