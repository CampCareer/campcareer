import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Info, MapPin, TrainFront, Users, Wallet } from "lucide-react"
import type { FiCityProfile } from "@/lib/cities/fi-city-profile.server"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/server"
import { CityCompareSelector, type CityCompareOption } from "./city-compare-selector"

type Props = { left: FiCityProfile; right: FiCityProfile; options: readonly CityCompareOption[] }

function money(value: number, currency = "EUR", locale: Locale) { return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-FI", { style: "currency", currency, maximumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value) }
function compact(value: number, locale: Locale) { return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-FI", { notation: "compact", maximumFractionDigits: 2 }).format(value) }
function period(value: string, locale: Locale) { if (locale === "ko") { if (value === "month") return "월"; if (value === "week") return "주"; if (value === "semester") return "학기" } return value.replaceAll("_", " ") }
function living(profile: FiCityProfile, locale: Locale) { if (!profile.livingCost) return "—"; return `${money(profile.livingCost.low, profile.livingCost.currency, locale)}–${money(profile.livingCost.high, profile.livingCost.currency, locale)} / ${locale === "ko" ? "월" : "month"}` }
function transport(profile: FiCityProfile, locale: Locale) { if (!profile.transport) return "—"; return `${money(profile.transport.amount, profile.transport.currency, locale)} / ${period(profile.transport.period, locale)}` }
function work(profile: FiCityProfile) { if (!profile.workRights) return "—"; return `${profile.workRights.hoursNormalPeriod} h / ${profile.workRights.period.replaceAll("_", " ")}` }

function Row({ icon, label, note, left, right, leftName, rightName }: { icon: React.ReactNode; label: string; note?: string; left: string; right: string; leftName: string; rightName: string }) {
  return <div className="grid grid-cols-2 border-t border-[#ecebe7] md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
    <div className="col-span-2 flex items-start gap-2 px-4 py-3.5 text-[12px] font-semibold text-[#5f5d57] md:col-span-1 md:px-5 md:py-4"><span className="mt-0.5 text-[#8f8c85]">{icon}</span><div><p>{label}</p>{note ? <p className="mt-1 text-[10px] font-normal leading-4 text-[#9a978f]">{note}</p> : null}</div></div>
    <div className="min-w-0 border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[14px]"><span className="mb-1 block text-[9.5px] uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{leftName}</span>{left}</div>
    <div className="min-w-0 border-l border-t border-[#f0efec] px-3 py-3.5 text-[13px] font-semibold leading-5 text-[#1b1b1b] md:px-5 md:py-4 md:text-[14px]"><span className="mb-1 block text-[9.5px] uppercase tracking-[0.08em] text-[#9a978f] md:hidden">{rightName}</span>{right}</div>
  </div>
}

function Header({ city, locale }: { city: FiCityProfile; locale: Locale }) {
  return <div className="min-w-0 px-3 py-4 sm:px-4 md:px-5 md:py-5"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f8c85]">{city.regionName}</p><h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-[#1b1b1b] md:text-[24px]">{city.name}</h2><p className="mt-1 text-[10.5px] text-[#77746e]">{locale === "ko" ? `Statistics Finland 지자체 코드 ${city.municipalityCode}` : `Statistics Finland municipality ${city.municipalityCode}`}</p><Link href={localizePath(`/cities/fi/${city.slug}`, locale)} className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#275b50] hover:underline">{locale === "ko" ? "도시 프로필" : "City profile"} <ArrowRight className="size-3" /></Link></div>
}

export async function FinlandCitiesCompareMatrix({ left, right, options }: Props) {
  const locale = await getLocale()
  const ko = locale === "ko"
  return <div className="w-full">
    <CityCompareSelector options={options} leftSlug={left.slug} rightSlug={right.slug} countryCode="FI" />
    <header className="mt-4 rounded-2xl border border-[#dbe7e3] bg-gradient-to-br from-[#f3f8f6] via-white to-[#f8f6f0] p-5 sm:p-8"><p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#275b50]">{ko ? "핀란드 도시 비교" : "Finland city comparison"}</p><h2 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px]">{left.name} vs {right.name}</h2><p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#6f6d68]">{ko ? "동일한 Statistics Finland 지자체 경계, 출처 기준 교통비, 검증된 대학 위치와 부분 검증된 과정 근거를 비교합니다. 국가 단위 기준은 도시 순위와 분리해 다룹니다." : "Compare the same Statistics Finland municipality boundary, source-native transport references, verified university-core locations and verified-partial programme evidence."}</p></header>
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#e7e6e3] bg-white"><div className="grid grid-cols-2 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]"><div className="hidden md:block" /><Header city={left} locale={locale} /><div className="border-l border-[#ecebe7]"><Header city={right} locale={locale} /></div></div>
      <Row icon={<MapPin className="size-3.5" />} label={ko ? "지자체 인구" : "Municipality population"} note={ko ? "동일한 Statistics Finland 지자체 기준" : "Same Statistics Finland municipality contract"} left={left.population ? compact(left.population.amount, locale) : "—"} right={right.population ? compact(right.population.amount, locale) : "—"} leftName={left.name} rightName={right.name} />
      <Row icon={<Wallet className="size-3.5" />} label={ko ? "학생 예산 계획 범위" : "Student budget planning range"} note={ko ? "국가 단위 계획 참고값이며 도시 물가 순위에는 사용하지 않습니다." : "National Study in Finland reference; not a city price ranking"} left={living(left, locale)} right={living(right, locale)} leftName={left.name} rightName={right.name} />
      <Row icon={<TrainFront className="size-3.5" />} label={ko ? "지역 교통비 참고값" : "Local transport reference"} note={ko ? "출처의 원래 상품·기간을 유지합니다." : "Source-native product/period; no synthetic monthly normalization"} left={transport(left, locale)} right={transport(right, locale)} leftName={left.name} rightName={right.name} />
      {!ko ? <Row icon={<Clock3 className="size-3.5" />} label="Student work context" note="National Migri average-hours rule; not a city differentiator" left={work(left)} right={work(right)} leftName={left.name} rightName={right.name} /> : null}
      <Row icon={<Building2 className="size-3.5" />} label={ko ? "검증된 대학 위치" : "Verified university locations"} note={ko ? "선정된 대학 핵심 자료이며 핀란드 전체 기관 목록은 아닙니다." : "Selected university core only; not all Finnish HEIs/UAS"} left={ko ? `${left.linkedInstitutionCount}개 기관 · ${left.linkedCampusCount}개 장소` : `${left.linkedInstitutionCount} institutions · ${left.linkedCampusCount} locations`} right={ko ? `${right.linkedInstitutionCount}개 기관 · ${right.linkedCampusCount}개 장소` : `${right.linkedInstitutionCount} institutions · ${right.linkedCampusCount} locations`} leftName={left.name} rightName={right.name} />
      <Row icon={<Users className="size-3.5" />} label={ko ? "부분 검증 과정" : "Verified-partial programmes"} note={ko ? "정확한 출처-도시 연결만 사용하며 전체 지자체 과정 목록은 아닙니다." : "Exact FI_OFFICIAL source-city linkage; not a complete municipal catalogue"} left={ko ? `${left.linkedProgramCount}개 과정` : `${left.linkedProgramCount} programmes`} right={ko ? `${right.linkedProgramCount}개 과정` : `${right.linkedProgramCount} programmes`} leftName={left.name} rightName={right.name} />
      <Row icon={<BriefcaseBusiness className="size-3.5" />} label={ko ? "취업 환경" : "Career environment"} note={ko ? "공식 지역 경제 맥락이며 인력부족 순위가 아닙니다." : "Official local economic context; not shortage rankings"} left={ko ? `${left.employmentSectors.length}개 주요 분야` : (left.employmentSectors.join(" · ") || "—")} right={ko ? `${right.employmentSectors.length}개 주요 분야` : (right.employmentSectors.join(" · ") || "—")} leftName={left.name} rightName={right.name} />
    </div>
    <div className="mt-4 rounded-xl border border-[#e4e3df] bg-[#fafaf8] p-4 text-[11px] leading-5 text-[#74716b]"><div className="flex items-start gap-2"><Info className="mt-0.5 size-3.5 shrink-0" /><p>{ko ? "핀란드 비교는 의도적으로 승자를 점수화하지 않습니다. 생활비와 교통비는 출처 기준을 유지하고, 과정 수는 현재 검증된 대학 핵심 범위만 반영합니다." : "Finland Compare intentionally does not score a winner. The living-cost and transport references retain their source basis, and programme counts cover the current verified university core."}</p></div></div>
  </div>
}
