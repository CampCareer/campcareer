// 2024 rates — 매년 갱신 필요. 단일 출처: API 라우트와 페이지 컴포넌트 모두 여기서 import.
export const TAX_YEAR = 2024

function calcUSTax(gross: number, state: string): number {
  // Federal income tax 2024 (single filer, standard deduction $14,600)
  const taxable = Math.max(0, gross - 14600)
  let federal = 0
  if (taxable <= 11600)       federal = taxable * 0.10
  else if (taxable <= 47150)  federal = 1160  + (taxable - 11600)  * 0.12
  else if (taxable <= 100525) federal = 5426  + (taxable - 47150)  * 0.22
  else if (taxable <= 191950) federal = 17168 + (taxable - 100525) * 0.24
  else if (taxable <= 243725) federal = 39110 + (taxable - 191950) * 0.32
  else if (taxable <= 609350) federal = 55678 + (taxable - 243725) * 0.35
  else                         federal = 183647 + (taxable - 609350) * 0.37

  // State income tax (flat approximations by state)
  const STATE_TAX: Record<string, number> = {
    AL: 0.05, AK: 0.00, AZ: 0.025, AR: 0.047, CA: 0.093,
    CO: 0.044, CT: 0.065, DE: 0.066, DC: 0.085, FL: 0.00,
    GA: 0.055, HI: 0.11, ID: 0.058, IL: 0.0495, IN: 0.0305,
    IA: 0.057, KS: 0.057, KY: 0.045, LA: 0.0425, ME: 0.075,
    MD: 0.0575, MA: 0.05, MI: 0.0425, MN: 0.0985, MS: 0.05,
    MO: 0.054, MT: 0.069, NE: 0.0664, NV: 0.00, NH: 0.00,
    NJ: 0.0637, NM: 0.059, NY: 0.0685, NC: 0.0499, ND: 0.0290,
    OH: 0.0399, OK: 0.0475, OR: 0.099, PA: 0.0307, RI: 0.0599,
    SC: 0.07, SD: 0.00, TN: 0.00, TX: 0.00, UT: 0.0485,
    VT: 0.0875, VA: 0.0575, WA: 0.00, WV: 0.065, WI: 0.0765,
    WY: 0.00,
  }
  const stateRate = STATE_TAX[state] ?? 0.05
  const stateTax = gross * stateRate

  // FICA (Social Security 6.2% + Medicare 1.45%)
  const fica = Math.min(gross, 160200) * 0.062 + gross * 0.0145

  return Math.round(federal + stateTax + fica)
}

function calcAUTax(gross: number): number {
  // Australian income tax 2024 + Medicare levy 2%
  let tax = 0
  if (gross <= 18200)       tax = 0
  else if (gross <= 45000)  tax = (gross - 18200) * 0.19
  else if (gross <= 120000) tax = 5092 + (gross - 45000) * 0.325
  else if (gross <= 180000) tax = 29467 + (gross - 120000) * 0.37
  else                       tax = 51667 + (gross - 180000) * 0.45
  const medicare = gross * 0.02
  return Math.round(tax + medicare)
}

function calcCATax(gross: number, province: string): number {
  // Federal tax 2024
  let federal = 0
  const fd = Math.max(0, gross - 15705) // basic personal amount
  if (fd <= 55867)       federal = fd * 0.15
  else if (fd <= 111733) federal = 8380 + (fd - 55867) * 0.205
  else if (fd <= 154906) federal = 19832 + (fd - 111733) * 0.26
  else if (fd <= 220000) federal = 21057 + (fd - 154906) * 0.29
  else                    federal = 39929 + (fd - 220000) * 0.33

  // CPP + EI
  const cpp = Math.min(Math.max(0, gross - 3500), 68500) * 0.0595
  const ei  = Math.min(gross, 63200) * 0.0166

  // Provincial tax (flat approximations)
  const PROV_TAX: Record<string, number> = {
    ON: 0.0505, BC: 0.0506, QC: 0.14, AB: 0.10,
    MB: 0.108, NS: 0.0879, NB: 0.094, SK: 0.105,
    NL: 0.087, PE: 0.0965,
  }
  const provRate = PROV_TAX[province] ?? 0.08
  const provincial = gross * provRate

  return Math.round(federal + cpp + ei + provincial)
}

function calcUKTax(gross: number): number {
  // UK income tax 2024 + NI
  const personal = 12570
  const taxable = Math.max(0, gross - personal)
  let tax = 0
  if (taxable <= 37700)      tax = taxable * 0.20
  else if (taxable <= 125140) tax = 7540 + (taxable - 37700) * 0.40
  else                         tax = 42384 + (taxable - 125140) * 0.45

  // National Insurance Class 1
  let ni = 0
  if (gross > 12570 && gross <= 50270) ni = (gross - 12570) * 0.08
  else if (gross > 50270)               ni = (50270 - 12570) * 0.08 + (gross - 50270) * 0.02

  return Math.round(tax + ni)
}

function calcIETax(gross: number): number {
  // Irish income tax 2024
  const personalCredit = 1875
  const employeeCredit = 1875
  const totalCredits = personalCredit + employeeCredit

  let tax = 0
  if (gross <= 42000) tax = gross * 0.20
  else                 tax = 8400 + (gross - 42000) * 0.40
  tax = Math.max(0, tax - totalCredits)

  // USC
  let usc = 0
  if (gross <= 12012)       usc = gross * 0.005
  else if (gross <= 21295)  usc = 60 + (gross - 12012) * 0.02
  else if (gross <= 70044)  usc = 246 + (gross - 21295) * 0.04
  else                       usc = 2196 + (gross - 70044) * 0.08

  // PRSI 4%
  const prsi = gross > 18304 ? gross * 0.04 : 0

  return Math.round(tax + usc + prsi)
}

function calcNLTax(gross: number): number {
  // Simplified Dutch income tax + social security estimation (2025)
  // Box 1 brackets (single filer):
  // €0-38,441: 35.82% (includes social security contributions)
  // €38,441-76,817: 37.48%
  // €76,817+: 49.50%
  if (gross <= 38441) return Math.round(gross * 0.3582)
  if (gross <= 76817) return Math.round(38441 * 0.3582 + (gross - 38441) * 0.3748)
  return Math.round(38441 * 0.3582 + (76817 - 38441) * 0.3748 + (gross - 76817) * 0.4950)
}

function calcNZTax(gross: number): number {
  // New Zealand income tax 2024-25 (NZD, single earner)
  // NZD 0-15,600: 10.5%
  // NZD 15,601-53,500: 17.5%
  // NZD 53,501-78,100: 30%
  // NZD 78,101-180,000: 33%
  // NZD 180,001+: 39%
  // ACC levy ~1.46% (simplified)
  let tax = 0
  if (gross <= 15600)       tax = gross * 0.105
  else if (gross <= 53500)  tax = 15600 * 0.105 + (gross - 15600) * 0.175
  else if (gross <= 78100)  tax = 15600 * 0.105 + (53500 - 15600) * 0.175 + (gross - 53500) * 0.30
  else if (gross <= 180000) tax = 15600 * 0.105 + (53500 - 15600) * 0.175 + (78100 - 53500) * 0.30 + (gross - 78100) * 0.33
  else                       tax = 15600 * 0.105 + (53500 - 15600) * 0.175 + (78100 - 53500) * 0.30 + (180000 - 78100) * 0.33 + (gross - 180000) * 0.39

  const acc = gross * 0.0146
  return Math.round(tax + acc)
}

function calcNOTax(gross: number): number {
  // Norwegian income tax 2025 (NOK, single filer)
  // NOK 0-208,050: 0%
  // NOK 208,050-292,850: 1.7% (trinnskatt step 2)
  // NOK 292,850-670,000: 4.0% (trinnskatt step 3)
  // NOK 670,000-937,900: 13.2% (trinnskatt step 4)
  // NOK 937,900+: 16.2% (trinnskatt step 5)
  // Base income tax: 22% flat
  // National insurance (folketrygden): 7.8% on wage income
  const baseIncomeTax = gross * 0.22

  let trinnskatt = 0
  if (gross > 208050 && gross <= 292850) trinnskatt = (gross - 208050) * 0.017
  else if (gross > 292850 && gross <= 670000) trinnskatt = (292850 - 208050) * 0.017 + (gross - 292850) * 0.04
  else if (gross > 670000 && gross <= 937900) trinnskatt = (292850 - 208050) * 0.017 + (670000 - 292850) * 0.04 + (gross - 670000) * 0.132
  else if (gross > 937900) trinnskatt = (292850 - 208050) * 0.017 + (670000 - 292850) * 0.04 + (937900 - 670000) * 0.132 + (gross - 937900) * 0.162

  const folketrygd = gross > 58150 ? gross * 0.078 : 0

  return Math.round(baseIncomeTax + trinnskatt + folketrygd)
}

function calcSETax(gross: number): number {
  // Swedish income tax 2025 (SEK, single filer)
  // Municipal tax: ~32% (varies by municipality, average ~32%)
  // State income tax: 20% on income above SEK 598,500
  // Funeral fee: 0.35%
  const municipalTax = Math.min(gross, 598500) * 0.32
  const stateTax = gross > 598500 ? (gross - 598500) * 0.20 : 0
  const funeralFee = gross * 0.0035
  return Math.round(municipalTax + stateTax + funeralFee)
}

function calcDETax(gross: number): number {
  // Simplified German income tax + social security estimation (2025)
  // Income tax (Einkommensteuer) brackets for single filers:
  // €0-12,096: 0%, €12,097-17,443: 14-24%, €17,444-68,430: 24-42%,
  // €68,431-277,825: 42%, >€277,825: 45%
  // + Solidaritätszuschlag (5.5% of tax) for most
  // + Social security ~20% (pension 9.3% + health ~7.3% + unemployment 1.3% + care 1.8%)
  const socSec = Math.min(gross * 0.20, 18000)

  const taxable = gross - socSec
  if (taxable <= 12096) return Math.round(socSec)
  if (taxable <= 17443) {
    const rate = 0.14 + (taxable - 12096) / (17443 - 12096) * (0.24 - 0.14)
    return Math.round(socSec + taxable * rate * 1.055)
  }
  if (taxable <= 68430) {
    const rate = 0.24 + (taxable - 17443) / (68430 - 17443) * (0.42 - 0.24)
    return Math.round(socSec + taxable * rate * 1.055)
  }
  if (taxable <= 277825) {
    return Math.round(socSec + taxable * 0.42 * 1.055)
  }
  return Math.round(socSec + taxable * 0.45 * 1.055)
}

function calcDKTax(gross: number): number {
  // Danish income tax 2025 (DKK, single filer)
  // Labour market contribution (AM-bidrag): 8%
  // Municipal tax: ~25% (average)
  // Church tax: ~0.77%
  // State tax: 12.11% above DKK 58,894, 15.14% above DKK 560,400
  const amBidrag = gross * 0.08
  const municipalTax = gross * 0.25
  const churchTax = gross * 0.0077
  let stateTax = 0
  if (gross > 560400) stateTax = (560400 - 58894) * 0.1211 + (gross - 560400) * 0.1514
  else if (gross > 58894) stateTax = (gross - 58894) * 0.1211
  return Math.round(amBidrag + municipalTax + churchTax + stateTax)
}

export function calcTax(gross: number, country: string, stateOrProvince: string): number {
  switch (country) {
    case 'us': return calcUSTax(gross, stateOrProvince)
    case 'au': return calcAUTax(gross)
    case 'ca': return calcCATax(gross, stateOrProvince)
    case 'uk': return calcUKTax(gross)
    case 'ie': return calcIETax(gross)
    case 'de': return calcDETax(gross)
    case 'nl': return calcNLTax(gross)
    case 'nz': return calcNZTax(gross)
    case 'no': return calcNOTax(gross)
    case 'se': return calcSETax(gross)
    case 'dk': return calcDKTax(gross)
    default:   return 0
  }
}
