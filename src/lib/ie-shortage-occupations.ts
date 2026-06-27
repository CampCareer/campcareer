export type ShortageOccupation = {
  socCode: string
  socLevel: string
  category: string
  employments: string[]
  relatedBroadField: string | null
}

const SHORTAGE_DATA: ShortageOccupation[] = [
  { socCode: "1122", socLevel: "SOC-4", category: "Site Manager", employments: ["Site Manager"], relatedBroadField: "07" },
  { socCode: "1136", socLevel: "SOC-4", category: "Information technology and telecommunications directors", employments: ["Information technology and telecommunications directors"], relatedBroadField: "06" },
  { socCode: "1181", socLevel: "SOC-4", category: "Senior health services and public health managers", employments: ["Senior health services and public health managers and directors"], relatedBroadField: "09" },
  { socCode: "1213", socLevel: "SOC-4", category: "Professional Forester", employments: ["Professional Forester", "Resource modelling, earth observation and data analyst"], relatedBroadField: "08" },
  { socCode: "2111", socLevel: "SOC-4", category: "Chemical scientists", employments: ["Chemical scientists in manufacturing (food, beverages, medical devices)"], relatedBroadField: "05" },
  { socCode: "2112", socLevel: "SOC-3", category: "Medical laboratory scientists / Biological scientists", employments: ["Medical laboratory scientists", "Biological scientists and biochemists in manufacturing"], relatedBroadField: "05" },
  { socCode: "2113", socLevel: "SOC-3", category: "Physical scientists", employments: ["Physical scientists in manufacturing", "Meteorologist", "Operational Forecaster"], relatedBroadField: "05" },
  { socCode: "2121", socLevel: "SOC-4", category: "Civil Engineers", employments: ["Civil Engineers", "Structural Engineers", "Site Engineers"], relatedBroadField: "07" },
  { socCode: "2122", socLevel: "SOC-3", category: "Mechanical engineers", employments: ["Mechanical engineers"], relatedBroadField: "07" },
  { socCode: "2123", socLevel: "SOC-3", category: "Electrical engineers", employments: ["Electrical engineers"], relatedBroadField: "07" },
  { socCode: "2124", socLevel: "SOC-3", category: "Electronics engineers", employments: ["Chip design", "Test engineering", "Process automation engineering", "Power engineering"], relatedBroadField: "06" },
  { socCode: "2126", socLevel: "SOC-3", category: "Design and development engineers", employments: ["Quality control engineering", "Validation and regulation engineering", "Chip design"], relatedBroadField: "07" },
  { socCode: "2127", socLevel: "SOC-3", category: "Production and process engineers", employments: ["Quality control engineering", "Chemical process engineering", "Process automation engineering"], relatedBroadField: "07" },
  { socCode: "2129", socLevel: "SOC-3", category: "Other engineering professionals", employments: ["Material scientists", "Setting Out Engineer", "Façade Designer", "Project Engineer"], relatedBroadField: "07" },
  { socCode: "2133", socLevel: "SOC-4", category: "IT specialist managers", employments: ["IT specialist managers", "BIM Manager"], relatedBroadField: "06" },
  { socCode: "2134", socLevel: "SOC-3", category: "IT project and programme managers", employments: ["IT project and programme managers"], relatedBroadField: "06" },
  { socCode: "2135", socLevel: "SOC-3", category: "IT business analysts, architects and systems designers", employments: ["IT business analysts", "Architects", "Systems designers"], relatedBroadField: "06" },
  { socCode: "2136", socLevel: "SOC-3", category: "Programmers and software development professionals", employments: ["Programmers", "Software development professionals"], relatedBroadField: "06" },
  { socCode: "2137", socLevel: "SOC-3", category: "Web design and development professionals", employments: ["Web design and development professionals"], relatedBroadField: "06" },
  { socCode: "2139", socLevel: "SOC-3", category: "All other ICT professionals", employments: ["ICT professionals not elsewhere classified"], relatedBroadField: "06" },
  { socCode: "2211", socLevel: "SOC-4", category: "Medical practitioners", employments: ["Medical practitioners"], relatedBroadField: "09" },
  { socCode: "2212", socLevel: "SOC-3", category: "Psychologist", employments: ["Psychologist"], relatedBroadField: "09" },
  { socCode: "2213", socLevel: "SOC-3", category: "Industrial Pharmacist / Pharmacist", employments: ["Industrial Pharmacist", "Pharmacist"], relatedBroadField: "09" },
  { socCode: "2217", socLevel: "SOC-3", category: "Radiographers", employments: ["Radiographers", "Radiation therapists", "Vascular technologists/physiologists"], relatedBroadField: "09" },
  { socCode: "2218", socLevel: "SOC-3", category: "Podiatrist / Chiropodist", employments: ["Podiatrist", "Chiropodist"], relatedBroadField: "09" },
  { socCode: "2219", socLevel: "SOC-3", category: "Audiologists / Medical Scientists", employments: ["Audiologists", "Perfusionists", "Dietician", "Cardiac Physiologist", "Medical Scientist"], relatedBroadField: "09" },
  { socCode: "2221", socLevel: "SOC-4", category: "Physiotherapist", employments: ["Physiotherapist"], relatedBroadField: "09" },
  { socCode: "2222", socLevel: "SOC-4", category: "Occupational Therapist", employments: ["Occupational Therapist"], relatedBroadField: "09" },
  { socCode: "2223", socLevel: "SOC-4", category: "Speech and Language Therapist", employments: ["Speech and Language Therapist"], relatedBroadField: "09" },
  { socCode: "2229", socLevel: "SOC-4", category: "Orthoptists", employments: ["Orthoptists"], relatedBroadField: "09" },
  { socCode: "2231", socLevel: "SOC-4", category: "Registered Nurses", employments: ["Registered Nurses"], relatedBroadField: "09" },
  { socCode: "2232", socLevel: "SOC-3", category: "Registered Midwives", employments: ["Registered Midwives"], relatedBroadField: "09" },
  { socCode: "2311", socLevel: "SOC-4", category: "Academics (ICT / third-level)", employments: ["Academics with Level 10 qualification and 1+ year teaching in third-level or ICT programmes"], relatedBroadField: "01" },
  { socCode: "2421", socLevel: "SOC-4", category: "Chartered and certified accountants", employments: ["Chartered accountants", "Taxation experts", "Auditors with US GAAP experience"], relatedBroadField: "04" },
  { socCode: "2423", socLevel: "SOC-3", category: "Management consultants / business analysts", employments: ["Big data analytics with IT, data mining, modelling, and advanced maths skills"], relatedBroadField: "04" },
  { socCode: "2424", socLevel: "SOC-3", category: "Business and financial project management professionals", employments: ["Finance & investment analytics", "Risk analytics", "Credit analytics", "Fraud analytics"], relatedBroadField: "04" },
  { socCode: "2425", socLevel: "SOC-3", category: "Actuaries, economists and statisticians", employments: ["Big data analytics with IT, data mining, modelling, and advanced maths skills"], relatedBroadField: "05" },
  { socCode: "2431", socLevel: "SOC-4", category: "Architect", employments: ["Architect"], relatedBroadField: "07" },
  { socCode: "2432", socLevel: "SOC-3", category: "Town Planning Officer", employments: ["Town Planning Officer"], relatedBroadField: "07" },
  { socCode: "2433", socLevel: "SOC-3", category: "Quantity surveyors", employments: ["Quantity surveyors"], relatedBroadField: "07" },
  { socCode: "2435", socLevel: "SOC-3", category: "Architectural Technologist", employments: ["Architectural Technologist"], relatedBroadField: "07" },
  { socCode: "2436", socLevel: "SOC-3", category: "Construction project managers", employments: ["Construction project managers", "Commercial Manager"], relatedBroadField: "07" },
  { socCode: "2442", socLevel: "SOC-4", category: "Social Worker", employments: ["Social Worker"], relatedBroadField: "09" },
  { socCode: "2461", socLevel: "SOC-4", category: "Quality control and planning engineers", employments: ["Quality control and planning engineers"], relatedBroadField: "07" },
  { socCode: "2462", socLevel: "SOC-3", category: "Quality assurance and regulatory professionals", employments: ["Quality assurance and regulatory professionals"], relatedBroadField: "04" },
  { socCode: "2463", socLevel: "SOC-3", category: "Environmental health professionals", employments: ["Environmental health professionals"], relatedBroadField: "09" },
  { socCode: "2473", socLevel: "SOC-4", category: "Art Director (animation)", employments: ["Art Director in 2D or 3D animation with 1+ year experience"], relatedBroadField: "02" },
  { socCode: "3122", socLevel: "SOC-4", category: "BIM Coordinator / Technician", employments: ["BIM Coordinator", "BIM Technician"], relatedBroadField: "07" },
  { socCode: "3213", socLevel: "SOC-4", category: "Paramedics", employments: ["PHECC registered Paramedics", "PHECC registered Advanced Paramedic Practitioners"], relatedBroadField: "09" },
  { socCode: "3218", socLevel: "SOC-3", category: "Prosthetists / Orthotists", employments: ["Prosthetists", "Orthotists", "Respiratory physiologist"], relatedBroadField: "09" },
  { socCode: "3411", socLevel: "SOC-4", category: "Animation background and design artist", employments: ["Animation Background and Design Artist in 2D/3D animation with 1+ year experience"], relatedBroadField: "02" },
  { socCode: "3421", socLevel: "SOC-4", category: "Animation designer", employments: ["Location Designer", "Character Designer", "Prop Designer", "Animation Layout Artist"], relatedBroadField: "02" },
  { socCode: "3442", socLevel: "SOC-4", category: "High performance coaches", employments: ["High performance coaches and directors for national/international sports organisations"], relatedBroadField: "10" },
  { socCode: "3531", socLevel: "SOC-4", category: "Estimator", employments: ["Estimator"], relatedBroadField: "04" },
  { socCode: "3542", socLevel: "SOC-4", category: "Business sales executives", employments: ["International Sales Roles", "IT B2B sales", "Non-EEA language fluency"], relatedBroadField: "04" },
  { socCode: "3543", socLevel: "SOC-3", category: "International marketing experts", employments: ["Product strategy development (pharma, medical devices, Software B2B, SaaS)"], relatedBroadField: "04" },
]

export function getShortageOccupations(): ShortageOccupation[] {
  return SHORTAGE_DATA
}

export function getShortageOccupationBySoc(socCode: string): ShortageOccupation | undefined {
  return SHORTAGE_DATA.find(o => o.socCode === socCode)
}

export function getShortageOccupationsByField(iscedCode: string): ShortageOccupation[] {
  return SHORTAGE_DATA.filter(o => o.relatedBroadField === iscedCode)
}

export function getShortageSocCodes(): string[] {
  return SHORTAGE_DATA.map(o => o.socCode)
}
