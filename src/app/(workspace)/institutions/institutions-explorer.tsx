import Link from "next/link"
import { Building2, ChevronRight, DatabaseZap, ExternalLink, GraduationCap, MapPin, Search } from "lucide-react"
import { InstitutionLogo } from "@/components/institution-logo"
import { getLaunchCountry } from "@/data/launch-countries"
import { countryDisplayName, localizePath, type Locale } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import { InstitutionCountrySelector } from "./institution-country-selector"
import {
  buildInstitutionExplorerUrl, INSTITUTION_KIND_OPTIONS,
  institutionCountryPath, institutionDetailPath, parseInstitutionSearchParams,
  type InstitutionMvpCountryCode, type InstitutionSearchFilters,
} from "@/lib/institutions/institution-search"
import { searchInstitutions, type InstitutionExplorerItem, type InstitutionSearchResult } from "@/lib/institutions/institutions.server"

function verifiedKindLabel(kind: string | null, locale: Locale) {
  const ko = locale === "ko"
  switch (kind) {
    case "university": return ko ? "대학교" : "University"
    case "college": return ko ? "칼리지" : "College"
    case "polytechnic": return ko ? "폴리테크닉" : "Polytechnic"
    case "tafe_vet": return "TAFE / VET"
    case "other": return ko ? "기타" : "Other"
    default: return null
  }
}
function ownershipLabel(ownership: string | null, locale: Locale) {
  const ko = locale === "ko"
  switch (ownership) {
    case "public": return ko ? "공립" : "Public"
    case "private": return ko ? "사립" : "Private"
    case "private_nonprofit": return ko ? "사립 비영리" : "Private nonprofit"
    case "private_forprofit": return ko ? "사립 영리" : "Private for-profit"
    default: return null
  }
}
function safeWebsiteUrl(value: string | null) {
  if (!value) return null
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null } catch { return null }
}
function usesLocationLanguage(countryCode: InstitutionMvpCountryCode) { return countryCode !== "AU" }
function hasPendingProgrammeCatalog(countryCode: InstitutionMvpCountryCode) {
  return countryCode === "NL" || countryCode === "NZ" || countryCode === "SG" || countryCode === "DE"
    || countryCode === "FR" || countryCode === "ES" || countryCode === "BE" || countryCode === "CH"
    || countryCode === "SE" || countryCode === "DK" || countryCode === "FI" || countryCode === "NO"
    || countryCode === "JP" || countryCode === "KR" || countryCode === "AE" || countryCode === "US"
}
function citySummary(institution: InstitutionExplorerItem, locale: Locale) {
  const cities = institution.cityNames
  if (cities.length === 0) {
    if (institution.campusCount === 0) return locale === "ko" ? "위치 정보 없음" : "Location unavailable"
    return locale === "ko" ? "위치 정보 있음" : usesLocationLanguage(institution.countryCode) ? "Locations available" : "Campus locations available"
  }
  if (cities.length <= 2) return cities.join(", ")
  return `${cities.slice(0, 2).join(", ")} +${cities.length - 2}`
}
function programSummary(institution: InstitutionExplorerItem, locale: Locale) {
  if (hasPendingProgrammeCatalog(institution.countryCode) && institution.programCount === 0) return locale === "ko" ? "과정 카탈로그 준비 중" : "Program catalog pending"
  return locale === "ko" ? `과정 ${institution.programCount.toLocaleString("ko-KR")}개` : `${institution.programCount.toLocaleString()} programs`
}
function localizedInstitutionUrl(path: string, locale: Locale) { return localizePath(path, locale) }

function InstitutionCard({ institution, locale }: { institution: InstitutionExplorerItem; locale: Locale }) {
  const ko = locale === "ko"
  const kind = verifiedKindLabel(institution.institutionKind, locale)
  const ownership = ownershipLabel(institution.ownershipType, locale)
  const website = safeWebsiteUrl(institution.websiteUrl)
  const detailPath = localizedInstitutionUrl(institutionDetailPath(institution.countryCode, institution.slug), locale)
  const locationUnit = ko ? (usesLocationLanguage(institution.countryCode) ? "개 위치" : "개 캠퍼스") : (usesLocationLanguage(institution.countryCode) ? "locations" : "campuses")
  return <article className="rounded-xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#cfd9ca] hover:shadow-sm">
    <div className="flex items-start gap-4"><InstitutionLogo name={institution.name} logoUrl={institution.logoUrl} /><div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2"><Link href={detailPath} className="group inline-flex min-w-0 items-center gap-1.5 text-[16px] font-semibold leading-6 tracking-[-0.01em] text-[#1b1b1b] transition hover:text-[#3e7a2e]"><span className="truncate">{institution.name}</span><ChevronRight className="size-3.5 shrink-0 text-[#aaa7a0] transition group-hover:translate-x-0.5 group-hover:text-[#3e7a2e]" /></Link>{kind ? <span className="rounded-full bg-[#f3f4f1] px-2.5 py-1 text-[10.5px] font-semibold text-[#686660]">{kind}</span> : null}{ownership ? <span className="rounded-full border border-[#e7e6e3] px-2.5 py-1 text-[10.5px] font-medium text-[#8b8881]">{ownership}</span> : null}</div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#6f6d68]"><span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-[#9c9a94]" />{citySummary(institution, locale)}</span><span className="inline-flex items-center gap-1.5"><GraduationCap className="size-3.5 text-[#9c9a94]" />{programSummary(institution, locale)}</span><span>{institution.campusCount.toLocaleString(locale === "ko" ? "ko-KR" : "en-US")} {locationUnit}</span></div>
      <div className="mt-3 flex flex-wrap items-center gap-4"><Link href={detailPath} className="text-[11.5px] font-semibold text-[#3e7a2e] hover:underline">{ko ? "교육기관 보기" : "View institution"}</Link>{website ? <a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#6f6d68] hover:text-[#3e7a2e]">{ko ? "공식 웹사이트" : "Official website"} <ExternalLink className="size-3" /></a> : null}</div>
    </div></div>
  </article>
}

function Pagination({ countryCode, filters, result, locale }: { countryCode: InstitutionMvpCountryCode; filters: InstitutionSearchFilters; result: InstitutionSearchResult; locale: Locale }) {
  if (result.pageCount <= 1) return null
  const href = (page: number) => localizePath(buildInstitutionExplorerUrl(countryCode, filters, { page }), locale)
  return <nav aria-label={locale === "ko" ? "교육기관 결과 페이지" : "Institution result pages"} className="mt-6 flex items-center justify-between rounded-xl border border-[#e7e6e3] bg-white px-4 py-3">{result.page > 1 ? <Link href={href(result.page - 1)} className="rounded-lg border border-[#deddd8] px-3 py-2 text-[12px] font-semibold text-[#4d4c48] transition hover:border-[#3e7a2e]/50 hover:text-[#3e7a2e]">{locale === "ko" ? "이전" : "Previous"}</Link> : <span />}<p className="text-[11.5px] font-medium text-[#8f8c85]">{locale === "ko" ? `${result.page} / ${result.pageCount}페이지` : `Page ${result.page} of ${result.pageCount}`}</p>{result.page < result.pageCount ? <Link href={href(result.page + 1)} className="rounded-lg bg-[#3e7a2e] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#326625]">{locale === "ko" ? "다음" : "Next"}</Link> : <span />}</nav>
}

function sourceNote(locale: Locale, countryCode: InstitutionMvpCountryCode, countryName: string) {
  if (locale !== "ko") {
    if (countryCode === "US") return "The US database retains the broader IPEDS institution universe, but this Explorer intentionally publishes only the 25-institution NCSES launch cohort. Existing US CIP outcome rows are not degree-program records, so zero canonical programs must not be interpreted as no programs offered."
    if (hasPendingProgrammeCatalog(countryCode)) return `${countryName} institution identities and locations are source-backed. The program catalogue is pending, so zero canonical program records do not mean an institution offers no programs.`
    return "Institution type and ownership are shown only when normalized from source-backed classifications. Program counts include active canonical programs only; city labels use normalized geography links."
  }
  if (countryCode === "US") return "미국 데이터베이스에는 더 넓은 IPEDS 교육기관 집합이 있지만, 이 탐색기는 NCSES 기준으로 선정한 25개 출시 교육기관만 공개합니다. 기존 미국 CIP 성과 행은 학위 과정 레코드가 아니므로 과정 0건을 ‘제공 과정 없음’으로 해석하면 안 됩니다."
  if (hasPendingProgrammeCatalog(countryCode)) return `${countryName} 교육기관의 공식 명칭과 위치는 출처를 확인해 공개합니다. 과정 카탈로그는 준비 중이므로 canonical 과정 0건을 해당 기관이 과정을 제공하지 않는다는 뜻으로 해석하면 안 됩니다.`
  return "교육기관 유형과 소유 형태는 출처 기반 분류를 정규화한 경우에만 표시합니다. 과정 수는 현재 활성화된 canonical 과정만 포함하며 도시명은 정규화된 위치 연결을 사용합니다."
}

export async function InstitutionsExplorer({ countryCode, searchParams }: { countryCode: InstitutionMvpCountryCode; searchParams: Record<string, string | string[] | undefined> }) {
  const locale = await getLocale()
  const ko = locale === "ko"
  const country = getLaunchCountry(countryCode)
  const countryName = countryDisplayName(locale, countryCode, country?.name ?? countryCode)
  const filters = parseInstitutionSearchParams(searchParams)
  const countryPath = localizePath(institutionCountryPath(countryCode), locale)
  const connectionLabel = ko ? (usesLocationLanguage(countryCode) ? "위치" : "캠퍼스") : (usesLocationLanguage(countryCode) ? "location" : "campus")
  let result: InstitutionSearchResult | null = null
  let errorMessage: string | null = null
  try { result = await searchInstitutions(countryCode, filters) } catch (error) { console.error("Unable to load institution explorer", error); errorMessage = ko ? "잠시 후 다시 시도해 주세요. 확인되지 않은 대체 교육기관 데이터는 표시하지 않았습니다." : "Please try again shortly. No substitute institution data has been shown." }

  return <>
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">{ko ? "탐색" : "Explore"}</p>
    <div className="mt-1.5 flex flex-wrap items-center gap-3"><h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-3xl">{ko ? "교육기관" : "Institutions"}</h1><InstitutionCountrySelector countryCode={countryCode} /></div>
    <p className="mt-2 max-w-2xl text-[12.5px] leading-5 text-[#77746e]">{countryCode === "US" ? (ko ? "NCSES 연방 과학·공학 지원 표를 기준으로 선정한 미국 25개 출시 대학을 둘러보세요. 교육기관 식별자는 NCES/IPEDS UNITID를 유지하며 CampCareer 미국 학위 과정 카탈로그는 아직 준비 중입니다." : "Explore the 25-university US launch cohort selected from the latest NCSES federal science and engineering support table. NCES selection is a publication criterion; official institution identity remains NCES/IPEDS UNITID. The CampCareer US degree-program catalogue is not yet published.") : hasPendingProgrammeCatalog(countryCode) ? (ko ? `${countryName}의 검증된 교육기관 명칭과 출처 기반 ${connectionLabel} 정보를 검색하세요. CampCareer ${countryName} 과정 카탈로그는 준비 중입니다.` : `Search verified institution identities and source-backed ${connectionLabel} data in ${country?.name ?? countryCode}. The CampCareer ${country?.name ?? countryCode} program catalog is not yet published.`) : (ko ? `${countryName}의 검증된 교육기관과 현재 CampCareer 과정·${connectionLabel} 연결을 검색하세요.` : `Search verified institution identities and their current CampCareer program and ${connectionLabel} connections in ${country?.name ?? countryCode}.`)}</p>

    {filters.city ? <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11.5px] font-semibold text-[#2755a5]"><MapPin className="size-3.5" />{ko ? `${filters.city} 캠퍼스` : `Campuses in ${filters.city}`}<Link href={countryPath} className="ml-1 text-[#2755a5]/70 underline underline-offset-2 hover:text-[#2755a5]">{ko ? "해제" : "Clear"}</Link></div> : null}

    <form action={countryPath} method="get" className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_210px_auto]">{filters.city ? <input type="hidden" name="city" value={filters.city} /> : null}<label className="relative block"><Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#a3a19b]" /><input type="search" name="q" defaultValue={filters.q} placeholder={ko ? "교육기관 이름 검색…" : "Search institution name…"} aria-label={ko ? "교육기관 이름 검색" : "Search institution name"} className="h-12 w-full rounded-xl border border-[#deddd8] bg-white pl-11 pr-4 text-[13.5px] text-[#1b1b1b] outline-none transition placeholder:text-[#aaa8a2] focus:border-[#3e7a2e] focus:ring-2 focus:ring-[#3e7a2e]/10" /></label><select name="kind" defaultValue={filters.kind} aria-label={ko ? "검증된 교육기관 유형" : "Verified institution type"} className="h-12 rounded-xl border border-[#deddd8] bg-white px-3 text-[12.5px] font-medium text-[#4d4c48] outline-none focus:border-[#3e7a2e]">{INSTITUTION_KIND_OPTIONS.map((option) => <option key={option.value} value={option.value}>{ko ? (option.value === "all" ? "전체 유형" : verifiedKindLabel(option.value, locale) ?? option.label) : option.label}</option>)}</select><button type="submit" className="h-12 rounded-xl bg-[#3e7a2e] px-5 text-[12.5px] font-semibold text-white transition hover:bg-[#326625]">{ko ? "검색" : "Search"}</button></form>

    <section className="mt-6">{errorMessage ? <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-[#f0d8d2] bg-[#fff9f7] p-8 text-center"><DatabaseZap className="size-6 text-[#b65c45]" /><h2 className="mt-3 text-[16px] font-semibold text-[#1b1b1b]">{ko ? "교육기관 데이터를 잠시 불러올 수 없어요" : "Institution data is temporarily unavailable"}</h2><p className="mt-2 max-w-lg text-[12px] leading-5 text-[#786b66]">{errorMessage}</p></div> : result ? <><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[12px] font-medium text-[#77746e]">{ko ? `교육기관 ${result.total.toLocaleString("ko-KR")}개` : `${result.total.toLocaleString()} institutions`}</p>{filters.q || filters.city || filters.kind !== "all" ? <Link href={countryPath} className="text-[11.5px] font-semibold text-[#3e7a2e] hover:underline">{ko ? "필터 초기화" : "Clear filters"}</Link> : null}</div>{result.institutions.length === 0 ? <div className="mt-3 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#dcdad4] bg-[#fbfbf9] p-8 text-center"><Building2 className="size-6 text-[#3e7a2e]" /><h2 className="mt-3 text-[16px] font-semibold text-[#1b1b1b]">{ko ? "이 필터에 맞는 교육기관이 없어요" : "No institutions match these filters"}</h2><p className="mt-2 text-[12px] text-[#77746e]">{ko ? "검색어를 넓히거나 교육기관 유형 필터를 해제해 보세요." : "Try a broader name search or clear the verified type filter."}</p></div> : <div className="mt-3 space-y-3">{result.institutions.map((institution) => <InstitutionCard key={institution.id} institution={institution} locale={locale} />)}</div>}<Pagination countryCode={countryCode} filters={filters} result={result} locale={locale} /></> : null}</section>

    <p className="mt-4 text-[10.5px] leading-5 text-[#aaa7a0]">{sourceNote(locale, countryCode, countryName)}</p>
  </>
}
