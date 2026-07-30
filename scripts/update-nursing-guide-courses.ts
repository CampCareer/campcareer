import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/route-guides.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Find the nursing guide's courses array (after id: "kr-au-registered-nurse")
const guideStart = content.indexOf('id: "kr-au-registered-nurse"');
if (guideStart === -1) {
  console.error("Guide not found");
  process.exit(1);
}

// Find the courses array within this guide
const coursesStart = content.indexOf("courses: [", guideStart);
if (coursesStart === -1) {
  console.error("courses array not found");
  process.exit(1);
}

// Find the end of courses array
let braceCount = 0;
let coursesEnd = -1;
for (let i = coursesStart; i < content.length; i++) {
  if (content[i] === "[") braceCount++;
  else if (content[i] === "]") {
    braceCount--;
    if (braceCount === 0) {
      coursesEnd = i + 1;
      break;
    }
  }
}

if (coursesEnd === -1) {
  console.error("courses array end not found");
  process.exit(1);
}

const newCourses = `courses: [
      { label: { en: "Monash Bachelor of Nursing", ko: "Monash Bachelor of Nursing" }, detail: { en: "An international course page to research alongside the Nursing and Midwifery Board approved-program search. Confirm current intake, fee, CoE and approval status before applying.", ko: "Nursing and Midwifery Board 승인 과정 검색과 함께 검토할 국제학생 과정 페이지입니다. 지원 전 현재 입학, 학비, CoE, 승인 상태를 확인하세요." }, url: monashNursing.url, linkType: "course", relevance: { en: "A course page is not proof of registration eligibility by itself.", ko: "과정 페이지 자체가 등록 자격의 증거는 아닙니다." }, source: monashNursing },
      { label: { en: "QUT Bachelor of Nursing", ko: "QUT 간호학사" }, detail: { en: "QUT Bachelor of Nursing (CRICOS 003501K). Annual tuition A$43,500 (2026). IELTS 7.0 overall (L/R/S 7.0, W 6.5). Kelvin Grove campus. ANMAC/NMBA accredited with reaccreditation underway.", ko: "QUT 간호학사 (CRICOS 003501K). 연학비 A$43,500 (2026). IELTS 7.0 overall (L/R/S 7.0, W 6.5). Kelvin Grove 캠퍼스. ANMAC/NMBA 인증, 재인증 진행 중." }, url: qutNursing.url, linkType: "course", relevance: { en: "Verify current intake availability and NMBA approval status before applying.", ko: "지원 전 현재 입학 가능 여부와 NMBA 승인 상태를 확인하세요." }, source: qutNursing },
      { label: { en: "UniSC Bachelor of Nursing Science", ko: "UniSC 간호과학 학사" }, detail: { en: "UniSC Bachelor of Nursing Science (CRICOS 078086M). Annual tuition A$32,500 (2026). IELTS 7.0 all bands. Multiple QLD campuses (Sunshine Coast, Gympie, Fraser Coast, Caboolture, Moreton Bay). Blended delivery. ANMAC accredited.", ko: "UniSC 간호과학 학사 (CRICOS 078086M). 연학비 A$32,500 (2026). IELTS 7.0 전 과목. QLD 다수 캠퍼스. 혼합 수업. ANMAC 인증." }, url: uniscNursing.url, linkType: "course", relevance: { en: "Blended delivery; confirm campus attendance requirements for student visa.", ko: "혼합 수업 방식이므로 학생비자 캠퍼스 출석 요건을 확인하세요." }, source: uniscNursing },
      { label: { en: "UniSC Bachelor of Nursing Science (Graduate Entry)", ko: "UniSC 간호과학 학사 (졸업자 입학)" }, detail: { en: "Graduate entry pathway (CRICOS 072637M). 2.3 years. Annual tuition A$32,500 (2026). IELTS 7.0 all bands. Requires prior bachelor degree. ANMAC accredited.", ko: "졸업자 입학 과정 (CRICOS 072637M). 2.3년. 연학비 A$32,500 (2026). IELTS 7.0 전 과목. 학사 학위 소지 필요. ANMAC 인증." }, url: uniscNursingGrad.url, linkType: "course", relevance: { en: "For applicants with a prior degree; check 10-year recency rule.", ko: "기존 학위 소지자 대상; 10년 이내 학위 요건 확인 필요." }, source: uniscNursingGrad },
      { label: { en: "Deakin Bachelor of Nursing (International)", ko: "Deakin 간호학사 (국제학생)" }, detail: { en: "Deakin Bachelor of Nursing (CRICOS 018327G). Annual tuition A$45,800 (2026). IELTS 7.0 overall (S 7.0, R 7.0, L 7.0, W 6.5). Burwood, Waterfront, Warrnambool campuses. ANMAC accredited, NMBA approved. Verified status.", ko: "Deakin 간호학사 (CRICOS 018327G). 연학비 A$45,800 (2026). IELTS 7.0 overall (S 7.0, R 7.0, L 7.0, W 6.5). Burwood, Waterfront, Warrnambool 캠퍼스. ANMAC 인증, NMBA 승인. 검증됨." }, url: deakinNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; check trimester 1 (March) intake only.", ko: "NMBA 승인 검증됨; Trimester 1 (3월) 입학만 가능 확인." }, source: deakinNursing },
      { label: { en: "RMIT Bachelor of Nursing", ko: "RMIT 간호학사" }, detail: { en: "RMIT Bachelor of Nursing (CRICOS 114027H). Annual tuition A$45,120 (2026). IELTS 7.0 overall (no band below 6.5). Bundoora campus. ANMAC accredited.", ko: "RMIT 간호학사 (CRICOS 114027H). 연학비 A$45,120 (2026). IELTS 7.0 overall (전 과목 6.5 이상). Bundoora 캠퍼스. ANMAC 인증." }, url: rmitNursing.url, linkType: "course", relevance: { en: "Confirm separate Enrolled Nurse pathway (BP032P24D2) is not selected.", ko: "등록간호사 경로(BP032P24D2)와 혼동하지 않도록 주의." }, source: rmitNursing },
      { label: { en: "Western Sydney Bachelor of Nursing", ko: "Western Sydney 간호학사" }, detail: { en: "Western Sydney Bachelor of Nursing (CRICOS 041099M). Annual tuition A$38,833 (2026). IELTS 7.0 overall. Campbelltown, Hawkesbury, Parramatta campuses. ANMAC accredited, NMBA approved. Verified status.", ko: "Western Sydney 간호학사 (CRICOS 041099M). 연학비 A$38,833 (2026). IELTS 7.0 overall. Campbelltown, Hawkesbury, Parramatta 캠퍼스. ANMAC 인증, NMBA 승인. 검증됨." }, url: westernSydneyNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; check separate Enrolled Nurse pathway.", ko: "NMBA 승인 검증됨; 등록간호보조사 경로와 구분 필요." }, source: westernSydneyNursing },
      { label: { en: "Flinders Bachelor of Nursing (Preregistration)", ko: "Flinders 간호학사 (사전등록)" }, detail: { en: "Flinders Bachelor of Nursing (Preregistration) (CRICOS 005195K). Annual tuition A$44,300 (2026). IELTS 7.0 overall. Bedford Park, City campuses. March; July intakes. ANMAC accredited until 2030, NMBA approved. Verified status.", ko: "Flinders 간호학사 (사전등록) (CRICOS 005195K). 연학비 A$44,300 (2026). IELTS 7.0 overall. Bedford Park, City 캠퍼스. 3월, 7월 입학. ANMAC 2030년까지 인증, NMBA 승인. 검증됨." }, url: flindersNursing.url, linkType: "course", relevance: { en: "Verified NMBA approval; graduate entry also available (2 years).", ko: "NMBA 승인 검증됨; 졸업자 입학 과정(2년)도 별도 존재." }, source: flindersNursing },
      { label: { en: "Flinders Bachelor of Nursing (Graduate Entry)", ko: "Flinders 간호학사 (졸업자 입학)" }, detail: { en: "Graduate entry (CRICOS 002701K). 2 years full-time. Annual tuition A$44,300 (2026). IELTS 7.0 overall. Bedford Park campus. January intake for international. ANMAC accredited, NMBA approved. Verified status.", ko: "졸업자 입학 (CRICOS 002701K). 2년 풀타임. 연학비 A$44,300 (2026). IELTS 7.0 overall. Bedford Park 캠퍼스. 국제학생 1월 입학. ANMAC 인증, NMBA 승인. 검증됨." }, url: flindersNursingGrad.url, linkType: "course", relevance: { en: "For prior degree holders; January intake specific to international students.", ko: "기존 학위 소지자 대상; 국제학생 1월 입학 별도 확인." }, source: flindersNursingGrad },
      { label: { en: "ECU Bachelor of Science (Nursing)", ko: "ECU 간호학 이학사" }, detail: { en: "ECU Bachelor of Science (Nursing) (CRICOS 077132G). Annual tuition A$44,000 (2026). IELTS 7.0 overall. Joondalup campus. ANMAC accredited.", ko: "ECU 간호학 이학사 (CRICOS 077132G). 연학비 A$44,000 (2026). IELTS 7.0 overall. Joondalup 캠퍼스. ANMAC 인증." }, url: ecuNursing.url, linkType: "course", relevance: { en: "Also offers Master of Nursing (Graduate Entry) for prior degree holders.", ko: "기존 학위 소지자용 Master of Nursing (Graduate Entry)도 별도 제공." }, source: ecuNursing },
      { label: { en: "ECU Master of Nursing (Graduate Entry)", ko: "ECU 간호학 석사 (졸업자 입학)" }, detail: { en: "Graduate entry master (CRICOS 091870M). Annual tuition A$45,400 (2026). IELTS 7.0 overall. For applicants with prior bachelor degree. ANMAC accredited.", ko: "졸업자 입학 석사 (CRICOS 091870M). 연학비 A$45,400 (2026). IELTS 7.0 overall. 학사 학위 소지자 대상. ANMAC 인증." }, url: ecuNursingGrad.url, linkType: "course", relevance: { en: "Graduate entry master pathway; confirm 10-year degree recency.", ko: "졸업자 입학 석사 경로; 10년 이내 학위 요건 확인." }, source: ecuNursingGrad },
      { label: { en: "UTAS Bachelor of Nursing", ko: "UTAS 간호학사" }, detail: { en: "UTAS Bachelor of Nursing (CRICOS 102253H). Annual tuition A$42,998 (2026). IELTS 7.0 overall. Hobart, Launceston, Sydney campuses. ANMAC accredited.", ko: "UTAS 간호학사 (CRICOS 102253H). 연학비 A$42,998 (2026). IELTS 7.0 overall. Hobart, Launceston, Sydney 캠퍼스. ANMAC 인증." }, url: utasNursing.url, linkType: "course", relevance: { en: "Multi-state campuses; confirm campus availability for international students.", ko: "다주 캠퍼스; 국제학생 캠퍼스별 개설 여부 확인." }, source: utasNursing },
      { label: { en: "CDU Bachelor of Nursing", ko: "CDU 간호학사" }, detail: { en: "CDU Bachelor of Nursing (CRICOS 118197B). Annual tuition A$38,720 (2026). IELTS 7.0 overall. Casuarina campus. ANMAC accredited.", ko: "CDU 간호학사 (CRICOS 118197B). 연학비 A$38,720 (2026). IELTS 7.0 overall. Casuarina 캠퍼스. ANMAC 인증." }, url: cduNursing.url, linkType: "course", relevance: { en: "Also offers Master of Nursing Practice (Pre-Registration).", ko: "Master of Nursing Practice (Pre-Registration)도 별도 제공." }, source: cduNursing },
      { label: { en: "CDU Master of Nursing Practice (Pre-Registration)", ko: "CDU 간호실무 석사 (사전등록)" }, detail: { en: "Pre-registration master (CRICOS 118951F). Annual tuition A$40,416 (2026). IELTS 7.0 overall. For non-nursing graduates. ANMAC accredited.", ko: "사전등록 석사 (CRICOS 118951F). 연학비 A$40,416 (2026). IELTS 7.0 overall. 비간호학 졸업자 대상. ANMAC 인증." }, url: cduNursingGrad.url, linkType: "course", relevance: { en: "Pre-registration master for career changers; verify eligibility.", ko: "전직자용 사전등록 석사; 자격 요건 확인 필요." }, source: cduNursingGrad },
      { label: { en: "UOW Bachelor of Nursing", ko: "UOW 간호학사" }, detail: { en: "UOW Bachelor of Nursing (CRICOS 113585H). Annual tuition A$39,936 (2026). IELTS 7.0 overall. Wollongong campus. ANMAC accredited.", ko: "UOW 간호학사 (CRICOS 113585H). 연학비 A$39,936 (2026). IELTS 7.0 overall. Wollongong 캠퍼스. ANMAC 인증." }, url: uowNursing.url, linkType: "course", relevance: { en: "Regional NSW campus; check graduate outcomes for regional migration.", ko: "지방 NSW 캠퍼스; 지방 이민용 졸업 결과 확인." }, source: uowNursing },
      { label: { en: "UQ Master of Nursing (Graduate Entry)", ko: "UQ 간호학 석사 (졸업자 입학)" }, detail: { en: "UQ Master of Nursing (Graduate Entry) (CRICOS 069418D). Annual tuition A$52,528 (2026). IELTS 7.0 overall. For prior degree holders. ANMAC accredited.", ko: "UQ 간호학 석사 (졸업자 입학) (CRICOS 069418D). 연학비 A$52,528 (2026). IELTS 7.0 overall. 기존 학위 소지자 대상. ANMAC 인증." }, url: uqNursingGrad.url, linkType: "course", relevance: { en: "Graduate entry master at Go8 university; higher tuition but strong reputation.", ko: "Go8 대학 졸업자 입학 석사; 학비 높지만 평판 강함." }, source: uqNursingGrad },
      { label: { en: "Approved nursing programs search", ko: "승인 간호 과정 검색" }, detail: { en: "Use the Board's live search to verify whether the exact program is approved and leads toward registration.", ko: "지원하려는 정확한 과정이 승인되어 등록으로 이어지는지 Board의 실시간 검색에서 확인하세요." }, url: nmbaApprovedPrograms.url, linkType: "course", relevance: { en: "Check the exact program, not a similarly named degree.", ko: "비슷한 이름의 학위가 아니라 정확한 과정을 확인하세요." }, source: nmbaApprovedPrograms },
    ]`;

const newContent = content.slice(0, coursesStart) + newCourses + content.slice(coursesEnd);

fs.writeFileSync(filePath, newContent);
console.log("Updated courses array in nursing guide");