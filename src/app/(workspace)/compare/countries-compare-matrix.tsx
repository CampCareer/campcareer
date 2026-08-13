"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Plus, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  COUNTRY_COMPARE_MAX_LOCATIONS,
  addCountrySlot,
  buildCountryCompareHref,
  cancelEmptyCountrySlot,
  completeCountryLocations,
  getCountryCompareCityOption,
  removeCountrySlot,
  replaceCityInSlot,
  replaceCountryInSlot,
  slotsFromCountryLocations,
  parseCountryComparisonState,
  type CountryCompareLocation,
  type CountryCompareSlot,
} from "@/lib/country-comparison"
import {
  COUNTRY_COMPARE_CATALOG,
  getCountryCompareCities,
  getCountryCompareCity,
  getCountryCompareCountry,
  type CountryCompareCode,
} from "@/data/country-comparison/locations"
import { getRegisteredNurseCountryShell } from "@/data/country-comparison/registered-nurse"
import {
  formatCountryComparisonRow,
  REGISTERED_NURSE_MATRIX_ROWS,
  type CountryComparisonRowDefinition,
} from "@/data/country-comparison/registered-nurse-rows"
import { countryDisplayName, localizePath, type Locale } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

type CountriesCompareMatrixProps = { initialLocations: readonly CountryCompareLocation[] }
type MatrixRow = { key: string; label: string; section: string; values: readonly string[] }
const NOT_AVAILABLE = "—"

const KO_ROW_LABELS: Record<string, string> = {
  goal: "목표",
  profile: "시작 조건",
  "pathway.qualificationRoute": "일반적인 자격 취득 경로",
  "pathway.qualificationOutcome": "취득 자격",
  "pathway.studyDuration": "학업 기간",
  "pathway.registrationAuthority": "등록 기관",
  "pathway.registrationSteps": "등록 절차",
  currency: "통화",
  "studyCost.annualTuition": "연간 국제학생 학비",
  "studyCost.tuitionRange": "학비 범위",
  "studyCost.estimatedTotalTuition": "예상 총 학비",
  "studyCost.mandatoryStudyCosts": "필수 학업 비용",
  "studyCost.healthInsurance": "건강보험",
  "city.cityName": "선택 도시",
  "cityCost.rent": "주거비",
  "cityCost.food": "식비·장보기",
  "cityCost.transport": "교통비",
  "cityCost.utilities": "공과금",
  "cityCost.otherEssentials": "기타 필수 생활비",
  "cityCost.monthlyTotal": "월 생활비",
  "cityCost.annualTotal": "연간 생활비",
  "cityCost.accommodationProfile": "주거비 산정 기준",
  "cityCost.householdProfile": "가구 기준",
  "cityCost.dataYear": "데이터 기준연도",
  "visa.studentVisa": "학생 비자",
  "visa.visaApplicationFee": "비자 신청 비용",
  "visa.financialEvidence": "재정 증빙",
  "visa.workRightsDuringStudy": "학업 중 근로 조건",
  "visa.postStudyRoute": "졸업 후 체류 경로",
  "visa.postStudyDuration": "졸업 후 체류 기간",
  "visa.eligibilityConditions": "주요 조건",
  "professionalIncome.startingIncome": "초기 전문직 소득",
  "professionalIncome.incomeBasis": "소득 기준",
  "professionalIncome.grossOrNet": "세전·세후 기준",
  "professionalIncome.geographicScope": "지역 범위",
  "professionalIncome.effectiveYear": "데이터 기준연도",
  "timeAndInvestment.timeToProfessionalIncome": "전문직 소득까지 예상 기간",
  "timeAndInvestment.totalStudyInvestment": "총 학업 투자비",
  "timeAndInvestment.recoveryPeriod": "투자 회수 예상 기간",
  sources: "공식 출처",
  "sources.verificationStatus": "검토 상태",
}

const KO_SECTION_LABELS: Record<string, string> = {
  "Key metrics": "핵심 지표",
  "Entry & requirements": "진입 경로·요건",
  "Costs & location": "비용·지역",
  "Visa & work": "비자·근로",
  Outcomes: "소득·회수",
  "Other details": "기타 정보",
}

function localizeValue(value: string, locale: Locale) {
  if (locale !== "ko") return value
  if (value === "Verified") return "검증 완료"
  if (value === "Needs review") return "추가 검토 필요"
  if (value === "Not available") return NOT_AVAILABLE
  return value
    .replace(/\b(years?)\b/gi, "년")
    .replace(/\b(months?)\b/gi, "개월")
    .replace(/\b(weeks?)\b/gi, "주")
}

export default function CountriesCompareMatrix({ initialLocations }: CountriesCompareMatrixProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useRouteLocale()
  const ko = locale === "ko"
  const urlKey = searchParams.toString()
  const writtenUrlKey = useRef<string | null>(null)
  const parsed = useMemo(() => parseCountryComparisonState(searchParams), [searchParams])
  const [slots, setSlots] = useState<CountryCompareSlot[]>(() => slotsFromCountryLocations(initialLocations))

  useEffect(() => {
    if (writtenUrlKey.current === urlKey) { writtenUrlKey.current = null; return }
    setSlots(slotsFromCountryLocations(parsed.locations))
  }, [parsed.locations, urlKey])

  const completeCount = completeCountryLocations(slots).length
  const hasIncompleteSlot = slots.some((slot) => !(slot.countryCode && slot.citySlug))
  const canAddCountry = completeCount >= 2 && completeCount < COUNTRY_COMPARE_MAX_LOCATIONS && !hasIncompleteSlot
  const rows = useMemo(() => buildMatrixRows(slots, locale), [locale, slots])
  const sharedSelectorProps = {
    locale,
    selectedCountryCodes: slots.flatMap((current) => current.countryCode ? [current.countryCode] : []),
    onCountryChange: handleCountryChange,
    onCityChange: handleCityChange,
    onRemove: handleRemove,
    onCancel: handleCancel,
  }

  function syncUrl(nextSlots: readonly CountryCompareSlot[]) {
    const href = localizePath(buildCountryCompareHref(completeCountryLocations(nextSlots)), locale)
    writtenUrlKey.current = new URL(href, "https://campcareer.local").searchParams.toString()
    router.replace(href, { scroll: false })
  }
  function commit(nextSlots: CountryCompareSlot[]) { setSlots(nextSlots); syncUrl(nextSlots) }
  function handleCountryChange(index: number, rawCountryCode: string) { const country = getCountryCompareCountry(rawCountryCode); if (country) commit(replaceCountryInSlot(slots, index, country.productCode)) }
  function handleCityChange(index: number, rawCitySlug: string) { const slot = slots[index]; if (!slot.countryCode) return; const city = getCountryCompareCity(slot.countryCode, rawCitySlug); if (city) commit(replaceCityInSlot(slots, index, city)) }
  function handleRemove(index: number) { commit(removeCountrySlot(slots, index)) }
  function handleAdd() { setSlots(addCountrySlot(slots)) }
  function handleCancel(index: number) { setSlots(cancelEmptyCountrySlot(slots, index)) }

  return <section className="mt-1" aria-label={ko ? "국가 비교" : "Country comparison"}>
    {completeCount < 2 ? <p className="mb-3 text-sm font-medium text-[#5f5d57]" role="status">{completeCount === 1 ? (ko ? "비교할 국가와 도시를 하나 더 선택하세요." : "Select one more country and city to compare.") : (ko ? "비교를 시작하려면 국가와 도시 두 곳을 선택하세요." : "Select two countries and cities to start comparing.")}</p> : null}
    <DesktopCountryMatrix rows={rows} slots={slots} canAddCountry={canAddCountry} onAddCountry={handleAdd} {...sharedSelectorProps} />
    <MobileCountryMatrix rows={rows} slots={slots} canAddCountry={canAddCountry} onAddCountry={handleAdd} {...sharedSelectorProps} />
    {completeCount >= 2 ? <p className="mt-5 text-xs leading-5 text-[#77746e]">{ko ? "검증된 필드만 표시합니다. 확인되지 않은 값은 —로 표시됩니다." : "Verified fields only. Missing values are shown as —."}</p> : null}
  </section>
}

function CountryColumnControls({ index, slot, selectedCountryCodes, onCountryChange, onCityChange, onRemove, onCancel, locale, compact = false }: {
  index:number; slot:CountryCompareSlot; selectedCountryCodes:readonly CountryCompareCode[]; onCountryChange:(index:number,countryCode:string)=>void; onCityChange:(index:number,citySlug:string)=>void; onRemove:(index:number)=>void; onCancel:(index:number)=>void; locale:Locale; compact?:boolean
}) {
  const ko = locale === "ko"
  const country = slot.countryCode ? getCountryCompareCountry(slot.countryCode) : null
  const city = country && slot.citySlug ? getCountryCompareCityOption(country.productCode, slot.citySlug) : null
  const displayedCountry = country ? countryDisplayName(locale, country.productCode, country.countryName) : (ko ? "국가 선택" : "Choose country")
  const cityName = city?.cityName ?? (country ? (ko ? "도시 선택" : "Choose city") : (ko ? "도시" : "City"))
  return <div className={`relative min-w-0 ${compact ? "rounded-xl border border-[#e7e6e3] bg-white p-2" : "p-1"}`}>
    <div className="grid min-w-0 gap-2">
      <label className="relative min-w-0 rounded-lg border border-[#deddd9] bg-white transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
        <span className="sr-only">{ko ? `국가 ${index + 1}` : `Country ${index + 1}`}</span>
        <span aria-hidden="true" className="pointer-events-none flex min-h-11 items-center gap-2 px-3"><span className="truncate text-sm font-semibold text-[#1b1b1b]">{displayedCountry}</span>{country ? <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#77746e]">{country.productCode}</span> : null}<ChevronDown className="ml-auto size-4 shrink-0 text-[#77746e]" aria-hidden="true" /></span>
        <select aria-label={ko ? `국가 ${index + 1}` : `Country ${index + 1}`} value={slot.countryCode ?? ""} onChange={(event) => onCountryChange(index, event.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"><option value="">{ko ? "국가 선택" : "Choose country"}</option>{COUNTRY_COMPARE_CATALOG.map((option) => <option key={option.productCode} value={option.productCode} disabled={option.productCode !== slot.countryCode && selectedCountryCodes.includes(option.productCode)}>{countryDisplayName(locale, option.productCode, option.countryName)} ({option.productCode})</option>)}</select>
      </label>
      <label className="relative min-w-0 rounded-lg border border-[#deddd9] bg-white transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
        <span className="sr-only">{ko ? `${displayedCountry} 도시` : `City for ${country?.countryName ?? `country ${index + 1}`}`}</span>
        <span aria-hidden="true" className={`pointer-events-none flex min-h-11 items-center gap-2 px-3 ${!country ? "text-[#9a978f]" : "text-[#1b1b1b]"}`}><span className="truncate text-sm font-semibold">{cityName}</span><ChevronDown className="ml-auto size-4 shrink-0 text-[#77746e]" aria-hidden="true" /></span>
        <select aria-label={ko ? `${displayedCountry} 도시` : `City for ${country?.countryName ?? `country ${index + 1}`}`} value={city?.citySlug ?? ""} disabled={!country} onChange={(event) => onCityChange(index, event.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"><option value="">{country ? (ko ? "도시 선택" : "Choose city") : (ko ? "먼저 국가를 선택하세요" : "Choose a country first")}</option>{(country ? getCountryCompareCities(country.productCode) : []).map((option) => <option key={option.citySlug} value={option.citySlug}>{option.cityName}</option>)}</select>
      </label>
    </div>
    {slot.countryCode && slot.citySlug ? <button type="button" onClick={() => onRemove(index)} aria-label={ko ? `${displayedCountry} ${city?.cityName ?? "도시"} 비교에서 제거` : `Remove ${country?.countryName ?? "country"} and ${city?.cityName ?? "city"} from comparison`} className="absolute right-2 top-2 z-10 inline-flex size-9 items-center justify-center rounded-lg text-[#77746e] hover:bg-[#f0efeb] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><X aria-hidden="true" className="size-4" /></button> : slot.optional ? <button type="button" onClick={() => onCancel(index)} aria-label={ko ? `국가 ${index + 1} 선택 취소` : `Cancel country ${index + 1}`} className="absolute right-2 top-2 z-10 min-h-9 rounded-lg px-2 text-xs font-semibold text-[#5f5d57] hover:bg-[#f0efeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35">{ko ? "취소" : "Cancel"}</button> : null}
  </div>
}

type CountrySelectorProps = { locale:Locale; selectedCountryCodes:readonly CountryCompareCode[]; onCountryChange:(index:number,countryCode:string)=>void; onCityChange:(index:number,citySlug:string)=>void; onRemove:(index:number)=>void; onCancel:(index:number)=>void }

function DesktopCountryMatrix({ rows, slots, canAddCountry, onAddCountry, locale, ...selectorProps }: { rows:readonly MatrixRow[]; slots:readonly CountryCompareSlot[]; canAddCountry:boolean; onAddCountry:()=>void } & CountrySelectorProps) {
  const ko = locale === "ko"
  const canCompare = completeCountryLocations(slots).length >= 2
  return <div className="hidden border-y border-[#e7e6e3] bg-white md:block"><table className="w-full table-fixed border-collapse text-left text-sm"><thead><tr><th scope="col" className="sticky top-14 z-20 w-36 border-b border-[#e7e6e3] bg-white/95 px-4 py-3 backdrop-blur-md xl:w-44"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#77746e]">{ko ? "비교" : "Compare"}</span>{canAddCountry ? <button type="button" onClick={onAddCountry} aria-label={ko ? "세 번째 국가 추가" : "Add a third country"} className="inline-flex size-9 items-center justify-center rounded-lg text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><Plus aria-hidden="true" className="size-4" /></button> : null}</div></th>{slots.map((slot,index)=><th key={`${index}-${slot.countryCode ?? "empty"}-${slot.citySlug ?? "empty"}`} scope="col" className="sticky top-14 z-20 border-b border-l border-[#e7e6e3] bg-white/95 px-2 py-2 align-top backdrop-blur-md"><CountryColumnControls index={index} slot={slot} locale={locale} {...selectorProps}/></th>)}</tr></thead>{canCompare ? <tbody>{rows.map((row,index)=><MatrixDesktopRow key={row.key} row={row} isSectionStart={index===0||rows[index-1].section!==row.section}/>)}</tbody> : null}</table></div>
}

function MatrixDesktopRow({ row, isSectionStart }: { row:MatrixRow; isSectionStart:boolean }) { return <>{isSectionStart ? <tr><th colSpan={row.values.length+1} className="border-b border-[#e7e6e3] bg-[#f7f7f5] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{row.section}</th></tr> : null}<tr><th scope="row" className="border-b border-[#ecebe7] bg-white px-4 py-4 align-top text-sm font-medium text-[#5f5d57]">{row.label}</th>{row.values.map((value,index)=><td key={`${row.key}-${index}`} className="border-b border-l border-[#ecebe7] px-5 py-4 align-top text-sm font-semibold leading-6 text-[#1b1b1b]">{value}</td>)}</tr></> }

function MobileCountryMatrix({ rows, slots, canAddCountry, onAddCountry, locale, ...selectorProps }: { rows:readonly MatrixRow[]; slots:readonly CountryCompareSlot[]; canAddCountry:boolean; onAddCountry:()=>void } & CountrySelectorProps) {
  const ko = locale === "ko"
  const canCompare = completeCountryLocations(slots).length >= 2
  return <div className="md:hidden" aria-label={ko ? "국가 비교 상세" : "Country comparison details"}><div className="sticky top-14 z-20 -mx-1 border-y border-[#e7e6e3] bg-white/95 px-1 py-2 backdrop-blur-md" aria-label={ko ? "국가 비교 열" : "Country comparison columns"}><div className="grid grid-cols-2 gap-2">{slots.map((slot,index)=><div key={`${index}-${slot.countryCode ?? "empty"}-${slot.citySlug ?? "empty"}`} className={index===2?"col-span-2":""}><CountryColumnControls index={index} slot={slot} locale={locale} compact {...selectorProps}/></div>)}</div>{canAddCountry ? <button type="button" onClick={onAddCountry} className="mt-2 inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"><Plus aria-hidden="true" className="mr-1.5 size-4" />{ko ? "국가 추가" : "Add country"}</button> : null}</div>{canCompare ? <div className="mt-5 space-y-7">{Array.from(new Set(rows.map((row)=>row.section))).map((section)=><section key={section}><h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{section}</h3><div className="mt-2 divide-y divide-[#ecebe7] border-y border-[#ecebe7]">{rows.filter((row)=>row.section===section).map((row)=><div key={row.key} className="py-4"><p className="text-sm font-medium text-[#5f5d57]">{row.label}</p><div className="mt-2 grid grid-cols-2 gap-2">{slots.map((slot,index)=>{if(!slot.countryCode||!slot.citySlug)return null;const country=getCountryCompareCountry(slot.countryCode);const city=getCountryCompareCity(slot.countryCode,slot.citySlug);return <div key={`${row.key}-${slot.countryCode}-${slot.citySlug}`} className="min-w-0 rounded-xl bg-[#fafaf9] p-3"><p className="truncate text-[11px] font-semibold text-[#77746e]">{country ? countryDisplayName(locale,country.productCode,country.countryName) : ""} · {city?.cityName}</p><p className="mt-1 break-words text-sm font-semibold leading-5 text-[#1b1b1b]">{row.values[index]}</p></div>})}</div></div>)}</div></section>)}</div> : null}</div>
}

function sectionForRow(row:CountryComparisonRowDefinition){if(["pathway.studyDuration","studyCost.annualTuition","professionalIncome.startingIncome","timeAndInvestment.totalStudyInvestment","timeAndInvestment.recoveryPeriod"].includes(row.fieldKey))return"Key metrics";if(row.section==="Pathway")return"Entry & requirements";if(row.section==="Study cost"||row.section==="Living in selected city")return"Costs & location";if(row.section==="Visa and post-study")return"Visa & work";if(row.section==="Professional income"||row.section==="Time and investment")return"Outcomes";return"Other details"}
function buildMatrixRows(slots:readonly CountryCompareSlot[],locale:Locale):MatrixRow[]{const sectionOrder=["Key metrics","Entry & requirements","Costs & location","Visa & work","Outcomes","Other details"];return REGISTERED_NURSE_MATRIX_ROWS.map((row)=>{const section=sectionForRow(row);return{key:row.fieldKey,section:locale==="ko"?(KO_SECTION_LABELS[section]??section):section,label:locale==="ko"?(KO_ROW_LABELS[row.fieldKey]??row.label):row.label,values:slots.map((slot)=>{if(!slot.countryCode||!slot.citySlug)return NOT_AVAILABLE;const country=getRegisteredNurseCountryShell(slot.countryCode);const city=getCountryCompareCity(slot.countryCode,slot.citySlug);if(!country)return NOT_AVAILABLE;const value=formatCountryComparisonRow(row,{country,city,cityCost:null});return value==="Not available"?NOT_AVAILABLE:localizeValue(value,locale)})}}).sort((a,b)=>{const aOriginal=Object.entries(KO_SECTION_LABELS).find(([,value])=>value===a.section)?.[0]??a.section;const bOriginal=Object.entries(KO_SECTION_LABELS).find(([,value])=>value===b.section)?.[0]??b.section;return sectionOrder.indexOf(aOriginal)-sectionOrder.indexOf(bOriginal)})}
