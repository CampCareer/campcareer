/**
 * Seeds IE-specific data into Supabase:
 *   1. graduate_outcomes_ie — HEO06 graduate outcomes by ISCED field
 *   2. shortage_occupations_ie — Critical Skills Occupations List (DETE)
 *
 * Run: npx ts-node scripts/seed-ie-data.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables:')
  if (!SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_SERVICE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── 1. Graduate Outcomes ─────────────────────────────────────────────────────

async function seedGraduateOutcomes() {
  const raw = fs.readFileSync(
    path.resolve(__dirname, '../src/data/ie-graduate-outcomes.json'),
    'utf-8',
  )
  const data = JSON.parse(raw)

  // Build rows: field summaries (aggregate) + degree-class summaries
  const rows: Array<Record<string, unknown>> = []

  for (const f of data.field_summaries) {
    if (!f.isced_code) continue
    rows.push({
      isced_code: f.isced_code,
      field_name: f.field_name,
      graduation_year: 2022,
      degree_class: null,
      total_graduates: f.total_graduates,
      employment_only: f.employment_only,
      education_only: f.education_only,
      employment_and_education: f.employment_and_education,
      neither: f.neither_employment_nor_education,
      not_captured: f.not_captured,
      employment_rate_pct: f.employment_rate_pct,
      education_rate_pct: f.education_rate_pct,
      unemployment_rate_pct: f.unemployment_rate_pct,
    })
  }

  for (const f of data.degree_class_summaries) {
    if (!f.isced_code) continue
    rows.push({
      isced_code: f.isced_code,
      field_name: f.field_name,
      graduation_year: 2022,
      degree_class: f.degree_class,
      total_graduates: f.total_graduates,
      employment_only: f.employment_only,
      education_only: f.education_only,
      employment_and_education: f.employment_and_education,
      neither: f.neither_employment_nor_education,
      not_captured: f.not_captured,
      employment_rate_pct: f.employment_rate_pct,
      education_rate_pct: f.education_rate_pct,
      unemployment_rate_pct: f.unemployment_rate_pct,
    })
  }

  console.log(`Seeding ${rows.length} rows into graduate_outcomes_ie...`)

  const { error } = await supabase.from('graduate_outcomes_ie').upsert(rows, {
    onConflict: 'isced_code,degree_class',
    ignoreDuplicates: false,
  })

  if (error) {
    console.error('graduate_outcomes_ie error:', error.message)
    return
  }
  console.log(`  Done. ${rows.length} rows upserted.`)
}

// ── 2. Shortage Occupations ─────────────────────────────────────────────────

interface ShortageEntry {
  soc_code: string
  soc_level: string
  category: string
  employments: string[]
}

const SHORTAGE_OCCUPATIONS: ShortageEntry[] = [
  { soc_code: '112', soc_level: 'SOC-3', category: 'Production Managers and Directors', employments: ['Site Manager'] },
  { soc_code: '1122', soc_level: 'SOC-4', category: 'Site Manager', employments: ['Site Manager'] },
  { soc_code: '113', soc_level: 'SOC-3', category: 'ICT Professionals', employments: ['Information technology and telecommunications directors'] },
  { soc_code: '1136', soc_level: 'SOC-4', category: 'Information technology and telecommunications directors', employments: ['Information technology and telecommunications directors'] },
  { soc_code: '118', soc_level: 'SOC-3', category: 'Health and Social Services Managers and Directors', employments: ['Senior health services and public health managers and directors'] },
  { soc_code: '1181', soc_level: 'SOC-4', category: 'Senior health services and public health managers and directors', employments: ['Senior health services and public health managers and directors'] },
  { soc_code: '121', soc_level: 'SOC-3', category: 'Managers and Proprietors in Agriculture Related Services', employments: ['Professional Forester', 'Resource modelling, earth observation and data analyst'] },
  { soc_code: '1213', soc_level: 'SOC-4', category: 'Professional Forester', employments: ['Professional Forester', 'Resource modelling, earth observation and data analyst'] },
  { soc_code: '211', soc_level: 'SOC-3', category: 'Natural and Social Science Professionals', employments: ['Chemical scientists in manufacturing', 'Biological scientists and biochemists in manufacturing', 'Physical scientists in manufacturing', 'Meteorologist', 'Operational Forecaster'] },
  { soc_code: '2111', soc_level: 'SOC-4', category: 'Chemical scientists', employments: ['Chemical scientists in manufacturing (including food & beverages, medical devices)'] },
  { soc_code: '2112', soc_level: 'SOC-3', category: 'Medical laboratory scientists / Biological scientists', employments: ['Medical laboratory scientists', 'Biological scientists and biochemists in manufacturing'] },
  { soc_code: '2113', soc_level: 'SOC-3', category: 'Physical scientists', employments: ['Physical scientists in manufacturing', 'Meteorologist', 'Operational Forecaster'] },
  { soc_code: '212', soc_level: 'SOC-3', category: 'Engineering Professionals', employments: ['Civil Engineers', 'Mechanical engineers', 'Electrical engineers', 'Electronics engineers', 'Design and development engineers', 'Production and process engineers', 'Material scientists'] },
  { soc_code: '2121', soc_level: 'SOC-4', category: 'Civil Engineers', employments: ['Civil Engineers', 'Structural Engineers', 'Site Engineers'] },
  { soc_code: '2122', soc_level: 'SOC-3', category: 'Mechanical engineers', employments: ['Mechanical engineers'] },
  { soc_code: '2123', soc_level: 'SOC-3', category: 'Electrical engineers', employments: ['Electrical engineers'] },
  { soc_code: '2124', soc_level: 'SOC-3', category: 'Electronics engineers', employments: ['Chip design', 'Test engineering', 'Application engineering', 'Process automation engineering', 'Power generation, transmission and distribution'] },
  { soc_code: '2126', soc_level: 'SOC-3', category: 'Design and development engineers', employments: ['Quality control engineering', 'Validation and regulation engineering', 'Chip design', 'Process automation engineering'] },
  { soc_code: '2127', soc_level: 'SOC-3', category: 'Production and process engineers', employments: ['Quality control engineering', 'Chemical process engineering', 'Process automation engineering', 'Chemical Engineer'] },
  { soc_code: '2129', soc_level: 'SOC-3', category: 'Other engineering professionals', employments: ['Material scientists', 'Setting Out Engineer', 'Façade Designer', 'Project Engineer'] },
  { soc_code: '213', soc_level: 'SOC-3', category: 'Information Technology and Telecommunications Professionals', employments: ['IT specialist managers', 'IT project managers', 'IT business analysts', 'Software developers', 'Web developers', 'ICT professionals nec'] },
  { soc_code: '2133', soc_level: 'SOC-4', category: 'IT specialist managers', employments: ['IT specialist managers', 'BIM Manager'] },
  { soc_code: '2134', soc_level: 'SOC-3', category: 'IT project and programme managers', employments: ['IT project and programme managers'] },
  { soc_code: '2135', soc_level: 'SOC-3', category: 'IT business analysts, architects and systems designers', employments: ['IT business analysts', 'Architects', 'Systems designers'] },
  { soc_code: '2136', soc_level: 'SOC-3', category: 'Programmers and software development professionals', employments: ['Programmers', 'Software development professionals'] },
  { soc_code: '2137', soc_level: 'SOC-3', category: 'Web design and development professionals', employments: ['Web design and development professionals'] },
  { soc_code: '2139', soc_level: 'SOC-3', category: 'All other ICT professionals', employments: ['ICT professionals not elsewhere classified'] },
  { soc_code: '221', soc_level: 'SOC-3', category: 'Health Professionals', employments: ['Medical practitioners', 'Psychologist', 'Pharmacist', 'Radiographers', 'Podiatrist', 'Audiologists'] },
  { soc_code: '2211', soc_level: 'SOC-4', category: 'Medical practitioners', employments: ['Medical practitioners'] },
  { soc_code: '2212', soc_level: 'SOC-3', category: 'Psychologist', employments: ['Psychologist'] },
  { soc_code: '2213', soc_level: 'SOC-3', category: 'Industrial Pharmacist / Pharmacist', employments: ['Industrial Pharmacist', 'Pharmacist'] },
  { soc_code: '2217', soc_level: 'SOC-3', category: 'Radiographers', employments: ['Radiographers', 'Radiation therapists', 'Vascular technologists/physiologists', 'Gastro Intestinal technologists/physiologists'] },
  { soc_code: '2218', soc_level: 'SOC-3', category: 'Podiatrist / Chiropodist', employments: ['Podiatrist', 'Chiropodist'] },
  { soc_code: '2219', soc_level: 'SOC-3', category: 'Audiologists', employments: ['Audiologists', 'Perfusionists', 'Dietician', 'Cardiac Physiologist', 'Medical Scientist'] },
  { soc_code: '222', soc_level: 'SOC-3', category: 'Therapy Professionals', employments: ['Physiotherapist', 'Occupational Therapist', 'Speech and Language Therapist', 'Orthoptists'] },
  { soc_code: '2221', soc_level: 'SOC-4', category: 'Physiotherapist', employments: ['Physiotherapist'] },
  { soc_code: '2222', soc_level: 'SOC-4', category: 'Occupational Therapist', employments: ['Occupational Therapist'] },
  { soc_code: '2223', soc_level: 'SOC-4', category: 'Speech and Language Therapist', employments: ['Speech and Language Therapist'] },
  { soc_code: '2229', soc_level: 'SOC-4', category: 'Orthoptists', employments: ['Orthoptists'] },
  { soc_code: '223', soc_level: 'SOC-3', category: 'Nursing and Midwifery Professionals', employments: ['Registered Nurses', 'Registered Midwives'] },
  { soc_code: '2231', soc_level: 'SOC-4', category: 'Registered Nurses', employments: ['Registered Nurses'] },
  { soc_code: '2232', soc_level: 'SOC-3', category: 'Registered Midwives', employments: ['Registered Midwives'] },
  { soc_code: '231', soc_level: 'SOC-3', category: 'Teaching and Educational Professionals', employments: ['Academics (NFQ Level 10) with 1+ year teaching experience in third-level ICT programmes'] },
  { soc_code: '2311', soc_level: 'SOC-4', category: 'Academics', employments: ['Academics with Level 10 qualification and minimum 1 year teaching experience in third-level institution or ICT programmes'] },
  { soc_code: '242', soc_level: 'SOC-3', category: 'Business, Research and Administrative Professionals', employments: ['Chartered accountants', 'Taxation experts', 'Management consultants', 'Business analysts', 'Actuaries', 'Economists', 'Statisticians'] },
  { soc_code: '2421', soc_level: 'SOC-4', category: 'Chartered and certified accountants', employments: ['Chartered accountants', 'Taxation experts', 'Auditors (AICPA/PICPA/ICAP) with US GAAP experience'] },
  { soc_code: '2423', soc_level: 'SOC-3', category: 'Management consultants and business analysts', employments: ['Big data analytics with skills in IT, data mining, modelling, and advanced maths'] },
  { soc_code: '2424', soc_level: 'SOC-3', category: 'Business and financial project management professionals', employments: ['Finance & investment analytics', 'Risk analytics', 'Credit analytics', 'Fraud analytics'] },
  { soc_code: '2425', soc_level: 'SOC-3', category: 'Actuaries, economists and statisticians', employments: ['Big data analytics with skills in IT, data mining, modelling, and advanced maths'] },
  { soc_code: '243', soc_level: 'SOC-3', category: 'Architects, Town Planners and Surveyors', employments: ['Architect', 'Town Planning Officer', 'Quantity surveyors', 'Architectural Technologist', 'Construction project managers'] },
  { soc_code: '2431', soc_level: 'SOC-4', category: 'Architect', employments: ['Architect'] },
  { soc_code: '2432', soc_level: 'SOC-3', category: 'Town Planning Officer', employments: ['Town Planning Officer'] },
  { soc_code: '2433', soc_level: 'SOC-3', category: 'Quantity surveyors', employments: ['Quantity surveyors'] },
  { soc_code: '2435', soc_level: 'SOC-3', category: 'Architectural Technologist', employments: ['Architectural Technologist'] },
  { soc_code: '2436', soc_level: 'SOC-3', category: 'Construction project managers', employments: ['Construction project managers', 'Commercial Manager'] },
  { soc_code: '244', soc_level: 'SOC-3', category: 'Welfare Professionals', employments: ['Social Worker'] },
  { soc_code: '2442', soc_level: 'SOC-4', category: 'Social Worker', employments: ['Social Worker'] },
  { soc_code: '246', soc_level: 'SOC-3', category: 'Quality and Regulatory Professionals', employments: ['Quality control and planning engineers', 'Quality assurance and regulatory professionals', 'Environmental health professionals'] },
  { soc_code: '2461', soc_level: 'SOC-4', category: 'Quality control and planning engineers', employments: ['Quality control and planning engineers'] },
  { soc_code: '2462', soc_level: 'SOC-3', category: 'Quality assurance and regulatory professionals', employments: ['Quality assurance and regulatory professionals'] },
  { soc_code: '2463', soc_level: 'SOC-3', category: 'Environmental health professionals', employments: ['Environmental health professionals'] },
  { soc_code: '247', soc_level: 'SOC-3', category: 'Media Professionals', employments: ['Art Director in 2D or 3D animation'] },
  { soc_code: '2473', soc_level: 'SOC-4', category: 'Art Director (animation)', employments: ['Art Director in 2D or 3D animation with 1+ year experience'] },
  { soc_code: '312', soc_level: 'SOC-3', category: 'Draughtspersons and Related Architectural Technicians', employments: ['BIM Coordinator / Technician'] },
  { soc_code: '3122', soc_level: 'SOC-4', category: 'BIM Coordinator / Technician', employments: ['BIM Coordinator', 'BIM Technician'] },
  { soc_code: '321', soc_level: 'SOC-3', category: 'Health Associate Professionals', employments: ['PHECC registered Paramedics', 'Prosthetists', 'Orthotists', 'Respiratory physiologist'] },
  { soc_code: '3213', soc_level: 'SOC-4', category: 'Paramedics', employments: ['PHECC registered Paramedics', 'PHECC registered Advanced Paramedic Practitioners'] },
  { soc_code: '3218', soc_level: 'SOC-3', category: 'Prosthetists / Orthotists', employments: ['Prosthetists', 'Orthotists', 'Respiratory physiologist'] },
  { soc_code: '341', soc_level: 'SOC-3', category: 'Artistic, Literary and Media Occupations', employments: ['Animation Background and Design Artist'] },
  { soc_code: '3411', soc_level: 'SOC-4', category: 'Animation artist', employments: ['Animation Background and Design Artist in 2D or 3D animation with 1+ year experience'] },
  { soc_code: '342', soc_level: 'SOC-3', category: 'Design Occupations', employments: ['Location Designer', 'Character Designer', 'Prop Designer', 'Animation Layout Artist'] },
  { soc_code: '3421', soc_level: 'SOC-4', category: 'Animation designer', employments: ['Location Designer in 2D/3D animation', 'Character Designer in 2D/3D animation', 'Prop Designer in 2D/3D animation', 'Animation Layout Artist'] },
  { soc_code: '344', soc_level: 'SOC-3', category: 'Sports and Fitness Occupations', employments: ['High performance coaches and directors'] },
  { soc_code: '3442', soc_level: 'SOC-4', category: 'High performance coaches', employments: ['High performance coaches and directors employed by National sports organisations or High profile sports organisations engaging in international competition'] },
  { soc_code: '353', soc_level: 'SOC-3', category: 'Business, Finance and Related Associate Professionals', employments: ['Estimator'] },
  { soc_code: '3531', soc_level: 'SOC-4', category: 'Estimator', employments: ['Estimator'] },
  { soc_code: '354', soc_level: 'SOC-3', category: 'Sales, Marketing and Related Associate Professionals', employments: ['Business sales executives (international sales / IT B2B)', 'International marketing experts'] },
  { soc_code: '3542', soc_level: 'SOC-4', category: 'Business sales executives', employments: ['International Sales Roles', 'IT B2B sales roles with fluency in non-EEA language'] },
  { soc_code: '3543', soc_level: 'SOC-3', category: 'International marketing experts', employments: ['Product strategy development and management (pharma, medical devices, Software B2B, SaaS)'] },
]

async function seedShortageOccupations() {
  const rows = SHORTAGE_OCCUPATIONS.map((o) => ({
    soc_code: o.soc_code,
    soc_level: o.soc_level,
    category: o.category,
    employments: o.employments,
  }))

  console.log(`Seeding ${rows.length} rows into shortage_occupations_ie...`)

  const { error } = await supabase.from('shortage_occupations_ie').upsert(rows, {
    onConflict: 'soc_code',
    ignoreDuplicates: false,
  })

  if (error) {
    console.error('shortage_occupations_ie error:', error.message)
    return
  }
  console.log(`  Done. ${rows.length} rows upserted.`)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await seedGraduateOutcomes()
  await seedShortageOccupations()

  // Refresh roi_explorer_ie materialized view
  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)/)?.[1]
  if (projectRef) {
    console.log('\nRefreshing roi_explorer_ie...')
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'REFRESH MATERIALIZED VIEW roi_explorer_ie;' }),
      },
    )
    if (!res.ok) {
      const body = await res.text()
      console.warn(`  Warning: Could not refresh view (${res.status}): ${body}`)
      console.warn('  Run manually: REFRESH MATERIALIZED VIEW roi_explorer_ie;')
    } else {
      console.log('  roi_explorer_ie refreshed.')
    }
  } else {
    console.warn('Cannot parse project ref — skipping view refresh.')
  }

  console.log('\nDone.')  
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
