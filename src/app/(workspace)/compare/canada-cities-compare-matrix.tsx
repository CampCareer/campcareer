import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  GraduationCap,
  MapPin,
  TrainFront,
  Users,
  Wallet,
} from "lucide-react"
import type { CaCityProfile } from "@/lib/cities/ca-city-profile.server"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type CanadaCitiesCompareMatrixProps = {
  left: CaCityProfile
  right: CaCityProfile
  options: readonly CityCompareOption[]
  sharedCareerCount: number
}

function money(value: number, currency: string, decimals: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function compact(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-CA", { notation: "compact", maximumFractionDigits: 2 }).format(value)
}

function transportPeriod(period: string, locale: Locale) {
  if (locale === "ko") {
    if (period === "4_month_term") return "4개월 학기"
    if (period === "month") return "월"
    if (period === "term") return "학기"
  }
  if (period === "4_month_term") return "4-month term"
  if (period === "month") return "month"
  if (period === "term") return "term"
  return period.replaceAll("_", " ")
}

function publishedProgramCount(profile: CaCityProfile) {
  return profile.publishedPrograms?.totalPrograms ?? 0
}

function publishedInstitutionCount(profile: CaCityProfile) {
  return profile.publishedPrograms?.institutionCount ?? 0
}

function cityValue(profile: CaCityProfile, kind: "living" | "transport" | "work" | "population" | "programs" | "providers" | "locations", locale: Locale) {
  const ko = locale === "ko"
  if (kind === "living") {
    if (!profile.livingCost) return "—"
    if (Math.abs(profile.livingCost.high - profile.livingCost.low) < 1) return `~${money(profile.livingCost.low, profile.livingCost.currency, 0, locale)} / ${ko ? "월" : "month"}`
    return `${money(profile.livingCost.low, profile.livingCost.currency, 0, locale)}–${money(profile.livingCost.high, profile.livingCost.currency, 0, locale)} / ${ko ? "월" : "month"}`
  }
  if (kind === "transport") {
    if (!profile.transport) return "—"
    const decimals = profile.transport.referenceAmount % 1 === 0 ? 0 : 2
    return `${money(profile.transport.referenceAmount, profile.transport.currency, decimals, locale)} / ${transportPeriod(profile.transport.period, locale)}`
  }
  if (kind === "work") return profile.workRights ? `${profile.workRights.hours}${ko ? "시간 / 주" : " h / week"}` : "—"
  if (kind === "population") return profile.population ? compact(profile.population.amount, locale) : "—"
  if (kind === "programs") return publishedProgramCount(profile).toLocaleString(ko ? "ko-KR" : "en-CA")
  if (kind === "providers") return publishedInstitutionCount(profile).toLocaleString(ko ? "ko-KR" : "en-CA")
  return profile.linkedCampusCount.toLocaleString(ko ? "ko-KR" : "en-CA")
}

function ComparisonRow({ label, left, right, leftName, rightName, note, icon }: { label: string; left: string; right: string; leftName: string; rightName: string; note?: string; icon: React.ReactNode }) {
  return <div className="grid grid-cols-2 border-t border-[#ecebe7] md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
    <div className="col-span-2 flex items-start gap-2 px-4 py-3.5 text-[12px] font-semibold text-[#5f5d57] md:col-span-1 md:px-5 md:py-4"><span className="mt-0.5 text-[#8f8c85]">{icon}</span><div><p>{label}</p>{note ? <p className="mt-1 text-[10px] font-normal leading-4 text-[#9a978f]">{note}</p> : null}</div></div>
    <div className="min-w-0 border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] sm:px-4 md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[14px]"><span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{leftName}</span><span className="break-words">{left}</span></div>
    <div className="min-w-0 border-l border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] sm:px-4 md:px-5 md:py-4 md:text-[14px]"><span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{rightName}</span><span className="break-words">{right}</span></div>
  </div>
}

function CityHeader({ city, locale }: { city: CaCityProfile; locale: Locale }) {
  const ko = locale === "ko"
  return <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5">
    <p className="truncate text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8f8c85] sm:text-[10.5px] sm:tracking-[0.1em]">{city.regionName}</p>
    <h2 className="mt-1 flex min-w-0 items-start gap-1.5 text-[18px] font-semibold leading-tight tracking-[-0.03em] text-[#1b1b1b] sm:text-[20px] md:text-[24px]"><span aria-hidden="true" className="shrink-0">🏙️</span><span className="min-w-0 break-words">{city.name}</span></h2>
    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1"><Link href={localizePath(`/cities/ca/${city.slug}`, locale)} className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#2563eb] hover:underline sm:text-[11px]">{ko ? "도시 프로필" : "City profile"} <ArrowRight className="size-3" /></Link><Link href={localizePath(`/programs?country=CA&city=${city.slug}`, locale)} className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#3e7a2e] hover:underline sm:text-[11px]">{ko ? "과정" : "Programs"} <ArrowRight className="size-3" /></Link></div>
  </div>
}

function livingMidpoint(profile: CaCityProfile) { if (!profile.livingCost) return null; return (profile.livingCost.low + profile.livingCost.high) / 2 }

export async function CanadaCitiesCompareMatrix({ left, right, options, sharedCareerCount }: CanadaCitiesCompareMatrixProps) {
  const locale = await getLocale()
  const ko = locale === "ko"
  const leftLivingMidpoint = livingMidpoint(left)
  const rightLivingMidpoint = livingMidpoint(right)
  const livingDifference = leftLivingMidpoint !== null && rightLivingMidpoint !== null ? leftLivingMidpoint - rightLivingMidpoint : null
  const livingSignal = livingDifference === null
    ? (ko ? "공개된 참고값을 비교하세요" : "Compare the published references")
    : Math.abs(livingDifference) < 1
      ? (ko ? "현재 공개된 중간값은 사실상 같습니다" : "Current published midpoints are effectively the same")
      : (ko ? `${livingDifference < 0 ? left.name : right.name}의 현재 중간값이 더 낮습니다` : `${livingDifference < 0 ? left.name : right.name} has the lower current midpoint`)

  const leftPrograms = publishedProgramCount(left)
  const rightPrograms = publishedProgramCount(right)
  const programmeDifference = leftPrograms - rightPrograms
  const programmeSignal = programmeDifference === 0
    ? (ko ? "공개된 대상 과정 수가 같습니다" : "Published target-program counts are equal")
    : (ko ? `${programmeDifference > 0 ? left.name : right.name}에 공개된 대상 과정이 더 많습니다` : `${programmeDifference > 0 ? left.name : right.name} has more published target programs`)
  const sharedCareerSignal = sharedCareerCount === 0
    ? (ko ? "현재 공개 범위에서 두 도시에 공통인 대상 직업이 없습니다" : "No shared target careers in current published coverage")
    : (ko ? `공통 대상 직업 ${sharedCareerCount.toLocaleString("ko-KR")}개` : `${sharedCareerCount.toLocaleString("en-CA")} shared target ${sharedCareerCount === 1 ? "career" : "careers"}`)

  return <div className="w-full">
    <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="CA" />
    <header className="mt-4 rounded-2xl border border-[#dfe6dc] bg-gradient-to-br from-[#f5f9f3] via-white to-[#eef4ff] p-5 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3e7a2e]">{ko ? "캐나다 도시 비교" : "Canada city comparison"}</p>
      <h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2>
      <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">{ko ? "도시별 학생 생활비, 교통, 국가 단위 근로시간 기준과 CampCareer의 검토된 80개 직업 관련 과정 범위를 비교합니다. 검증된 장소 정보는 별도 출처 계층으로 유지합니다." : "Compare named-city student living, transport, work rules and CampCareer's reviewed program set for the 80 target careers. Verified location records remain a separate source-backed layer."}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap"><Link href={localizePath(`/cities/ca/${left.slug}`, locale)} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2.5 text-[11.5px] font-semibold text-white sm:w-auto sm:py-2">{ko ? `${left.name} 보기` : `View ${left.name}`} <ArrowRight className="size-3.5" /></Link><Link href={localizePath(`/cities/ca/${right.slug}`, locale)} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3e7a2e] px-3.5 py-2.5 text-[11.5px] font-semibold text-white sm:w-auto sm:py-2">{ko ? `${right.name} 보기` : `View ${right.name}`} <ArrowRight className="size-3.5" /></Link></div>
    </header>

    <section className="mt-5 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white">
      <div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]"><div className="hidden md:block" /><div className="border-r border-[#ecebe7] md:border-l md:border-r-0"><CityHeader city={left} locale={locale} /></div><div className="md:border-l md:border-[#ecebe7]"><CityHeader city={right} locale={locale} /></div></div>
      <ComparisonRow icon={<Wallet className="size-4" />} label={ko ? "학생 생활비" : "Student living"} note={ko ? "월 기준 참고값 · 출처에서 분리 가능한 경우 학비 제외" : "Indicative monthly reference · tuition excluded where the source permits separation"} left={cityValue(left, "living", locale)} right={cityValue(right, "living", locale)} leftName={left.name} rightName={right.name} />
      <ComparisonRow icon={<TrainFront className="size-4" />} label={ko ? "학생 교통비" : "Student transport"} note={ko ? "학생 교통 상품은 출처별 기간과 조건이 달라 월·학기 상품을 직접 비교하기 어려울 수 있습니다." : "Student products use source-native periods and eligibility rules; monthly and term products are not directly equivalent."} left={cityValue(left, "transport", locale)} right={cityValue(right, "transport", locale)} leftName={left.name} rightName={right.name} />
      <ComparisonRow icon={<Clock3 className="size-4" />} label={ko ? "학생 근로시간 기준" : "Student work rule"} note={ko ? "정규 학기 중 적용되는 국가 단위 IRCC 교외 근로시간 기준으로, 도시별 차이는 아닙니다." : "National IRCC off-campus rule during regular academic sessions; this is not a city differentiator."} left={cityValue(left, "work", locale)} right={cityValue(right, "work", locale)} leftName={left.name} rightName={right.name} />
      <ComparisonRow icon={<GraduationCap className="size-4" />} label={ko ? "공개된 대상 과정" : "Published target programs"} note={ko ? "CampCareer의 캐나다 80개 직업 검토 범위에 공개된 과정이며, 각 교육기관의 전체 카탈로그가 아닙니다." : "Public programs in CampCareer's reviewed Canada 80-career set; this is not each institution's full catalogue."} left={cityValue(left, "programs", locale)} right={cityValue(right, "programs", locale)} leftName={left.name} rightName={right.name} />
      <ComparisonRow icon={<Building2 className="size-4" />} label={ko ? "공개 과정이 있는 교육기관" : "Institutions with published programs"} note={ko ? "공개된 대상 과정에 포함된 서로 다른 교육기관 수입니다." : "Distinct institutions represented in the published target-program set."} left={cityValue(left, "providers", locale)} right={cityValue(right, "providers", locale)} leftName={left.name} rightName={right.name} />
      <ComparisonRow icon={<MapPin className="size-4" />} label={ko ? "검증된 장소 기록" : "Verified location records"} note={ko ? "출처가 확인된 장소 링크를 과정 공개 상태와 별도로 관리합니다." : "Source-backed location links remain separate from program publication eligibility."} left={cityValue(left, "locations", locale)} right={cityValue(right, "locations", locale)} leftName={left.name} rightName={right.name} />
      <ComparisonRow icon={<Users className="size-4" />} label={ko ? "도시 인구" : "City population"} note={ko ? "CMA가 아닌 도시·census subdivision 기준" : "Named-city / census-subdivision geography, not CMA population"} left={cityValue(left, "population", locale)} right={cityValue(right, "population", locale)} leftName={left.name} rightName={right.name} />
      <ComparisonRow icon={<BriefcaseBusiness className="size-4" />} label={ko ? "취업시장 맥락" : "Career context"} note={ko ? "공식 도시 경제 안내 기준이며 직업 인력부족 순위가 아닙니다." : "Official city economic guidance, not occupation-shortage rankings"} left={ko ? `${left.employmentSectors.length}개 주요 분야` : left.employmentSectors.slice(0, 5).join(" · ")} right={ko ? `${right.employmentSectors.length}개 주요 분야` : right.employmentSectors.slice(0, 5).join(" · ")} leftName={left.name} rightName={right.name} />
    </section>

    <div className="mt-5 grid gap-4 md:grid-cols-3">
      <article className="rounded-xl border border-[#e7e6e3] bg-white p-5"><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#c2691e]">{ko ? "생활비 신호" : "Living-cost signal"}</p><p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">{livingSignal}</p><p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{ko ? "출처별 산정 시나리오가 다르므로 개인 예산을 보장하는 값이 아니라 도시 방향성을 보는 참고값으로 사용하세요." : "Source scenarios differ by institution, so use this as a directional city signal rather than a guaranteed personal budget."}</p></article>
      <article className="rounded-xl border border-[#e7e6e3] bg-white p-5"><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#2563eb]">{ko ? "공개 과정 범위" : "Published program coverage"}</p><p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">{programmeSignal}</p><p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{left.name}: {leftPrograms.toLocaleString(ko ? "ko-KR" : "en-CA")} · {right.name}: {rightPrograms.toLocaleString(ko ? "ko-KR" : "en-CA")} {ko ? "공개 대상 과정" : "published target-career programs"}.</p></article>
      <article className="rounded-xl border border-[#e7e6e3] bg-white p-5"><p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#3e7a2e]">{ko ? "두 도시에 공통인 대상 직업" : "Target careers in both"}</p><p className="mt-2 text-[18px] font-semibold leading-6 text-[#1b1b1b]">{sharedCareerSignal}</p><p className="mt-2 text-[11.5px] leading-5 text-[#77746e]">{ko ? "공개된 과정의 검토된 대상 직업 범위를 비교하며, 같은 과정이 두 도시에 모두 있어야 한다는 의미는 아닙니다." : "This compares reviewed target-career coverage across published programs; it does not require the same program identity to exist in both cities."}</p></article>
    </div>

    <section className="mt-5 rounded-xl border border-[#d9e3f7] bg-[#f7f9fe] p-5 sm:p-6">
      <h2 className="text-[15px] font-semibold text-[#1b1b1b]">{ko ? "이 비교를 활용하는 방법" : "How to use this comparison"}</h2>
      <p className="mt-2 max-w-4xl text-[12px] leading-5 text-[#5e6f91]">{ko ? "생활비, 교통, 지역 취업시장 맥락과 공개된 대상 과정 범위를 함께 보고 도시 환경을 좁히세요. 근로시간 행은 국가 단위 기준입니다. 실제 과정의 교육기관, 장소, 최신 모집 정보와 PGWP 상태는 공식 출처에서 별도로 확인하세요." : "Use living, transport, local career context and published target-program coverage to choose the city environment that fits you. The work-hours row is a national rule, not a city differentiator. Then verify the actual institution, location, admission evidence and PGWP status before applying."}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap"><Link href={localizePath(`/programs?country=CA&city=${left.slug}`, locale)} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#bfcff0] bg-white px-3.5 py-2.5 text-[11.5px] font-semibold text-[#2563eb] sm:w-auto sm:py-2">{ko ? `${left.name} 과정 보기` : `Browse ${left.name} programs`} <ArrowRight className="size-3.5" /></Link><Link href={localizePath(`/programs?country=CA&city=${right.slug}`, locale)} className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#cfd9ca] bg-white px-3.5 py-2.5 text-[11.5px] font-semibold text-[#3e7a2e] sm:w-auto sm:py-2">{ko ? `${right.name} 과정 보기` : `Browse ${right.name} programs`} <ArrowRight className="size-3.5" /></Link></div>
    </section>
  </div>
}
