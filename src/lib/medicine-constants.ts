// First-year attending/consultant salary estimates for medical fields.
// Source: MGMA (US), HSE consolidated salary scales (IE)
// Used to override the pre-calculated ROI values when field=medicine,
// because stored earnings data uses different career timepoints across countries.
export const MEDICINE_FIRST_YEAR_SALARY: Record<string, number> = {
  us: 280000,  // USD — attending physician, first-year (MGMA/AAMC 2024 weighted avg)
  ie: 120000,  // EUR — HSE Consultant Type B entry (2024)
  uk: 100000,  // GBP — NHS Consultant starting (2024)
  gb: 100000,  // GBP — NHS Consultant starting (2024)
  ca: 280000,  // CAD — Specialist physician, first-year (CIHI 2024)
  au: 300000,  // AUD — Medical specialist consultant (AMA 2024)
}

export function isMedicineField(field?: string | null): boolean {
  if (!field) return false
  const lower = field.toLowerCase().trim()
  return (
    lower === 'medicine' ||
    lower === 'medical' ||
    lower.startsWith('medicine ') ||
    lower.startsWith('medical ')
  )
}
