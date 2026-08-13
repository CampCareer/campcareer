"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeInfo,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileBadge2,
  Globe2,
  GraduationCap,
  MessageCircleMore,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog";
import { LAUNCH_COUNTRIES } from "@/data/launch-countries";
import { countryDisplayName, localizePath, type Locale } from "@/lib/i18n/config";
import { useRouteLocale } from "@/lib/i18n/locale-provider";
import { HomeSearchForm } from "./home-search-form";
import type { OverviewSearchValues } from "./home-overview-config";

type ExploreCategory =
  "countries" | "visas" | "occupation" | "programs" | "institutions";

type MemberHomeHubProps = {
  targetCountry: string | null;
  targetOccupation: string | null;
};

type HomeCopy = {
  eyebrow: string;
  title: string;
  description: string;
  searchTitle: string;
  searchDescription: string;
  searchAction: string;
  currentFocus: string;
  openJobMarket: string;
  updates: string;
  viewAll: string;
  news: string;
  information: string;
  sources: string;
  methodology: string;
  howToUse: string;
  feedbackTitle: string;
  feedbackDescription: string;
  feedbackAction: string;
  category: Record<
    ExploreCategory,
    {
      label: string;
      searchDescription: string;
      action: string;
    }
  >;
  updatesList: readonly { label: string; detail: string }[];
  newsList: readonly { label: string; detail: string }[];
};

const CATEGORY_ICONS: Record<ExploreCategory, LucideIcon> = {
  countries: Globe2,
  visas: FileBadge2,
  occupation: BriefcaseBusiness,
  programs: GraduationCap,
  institutions: Building2,
};

const CATEGORY_ORDER: readonly ExploreCategory[] = [
  "countries",
  "visas",
  "occupation",
  "programs",
  "institutions",
];

const INSTITUTION_COUNTRIES = new Set([
  "AU",
  "CA",
  "UK",
  "NL",
  "NZ",
  "SG",
  "DE",
  "FR",
  "ES",
  "BE",
  "CH",
  "SE",
  "DK",
  "FI",
  "NO",
  "JP",
  "KR",
  "AE",
  "US",
]);

const COPY: Record<Locale, HomeCopy> = {
  en: {
    eyebrow: "CAREER WORKSPACE",
    title: "Explore your global career in one place.",
    description: "Search the part of the decision you need right now.",
    searchTitle: "Find the right information",
    searchDescription:
      "Choose a category, then open its matching explorer with your selection already applied.",
    searchAction: "Open explorer",
    currentFocus: "CURRENT FOCUS",
    openJobMarket: "Open job market",
    updates: "Updates",
    viewAll: "View more",
    news: "News and guides",
    information: "More information",
    sources: "Sources",
    methodology: "Methodology",
    howToUse: "How to use the workspace",
    feedbackTitle: "Help improve CampCareer",
    feedbackDescription:
      "Tell us what would make your next career decision clearer.",
    feedbackAction: "Send feedback",
    category: {
      countries: {
        label: "Countries",
        searchDescription:
          "Choose a destination to open its country dashboard.",
        action: "Open country",
      },
      visas: {
        label: "Visas",
        searchDescription: "Choose a destination to filter its visa routes.",
        action: "Open visas",
      },
      occupation: {
        label: "Jobs",
        searchDescription:
          "Choose a destination and occupation to open the job-market view.",
        action: "Open jobs",
      },
      programs: {
        label: "Programs",
        searchDescription:
          "Choose a destination and occupation to search related programs.",
        action: "Open programs",
      },
      institutions: {
        label: "Institutions",
        searchDescription:
          "Choose a destination to browse verified institutions.",
        action: "Open institutions",
      },
    },
    updatesList: [
      {
        label: "Home search now opens the correct workspace category",
        detail:
          "Country, visa, job, program and institution search stay inside CampCareer.",
      },
      {
        label: "Your onboarding choices prefill the Home search",
        detail:
          "Change either choice here whenever you want to explore another direction.",
      },
    ],
    newsList: [
      {
        label: "How to compare career evidence",
        detail:
          "Read how demand, visa and qualification information are kept separate.",
      },
    ],
  },
  ko: {
    eyebrow: "커리어 워크스페이스",
    title: "해외 커리어 정보를 한 곳에서 탐색하세요.",
    description: "지금 필요한 결정 단계부터 바로 확인할 수 있어요.",
    searchTitle: "필요한 정보 찾기",
    searchDescription:
      "카테고리를 고르면 선택한 조건이 적용된 탐색 화면으로 바로 이동해요.",
    searchAction: "탐색 화면 열기",
    currentFocus: "현재 관심 경로",
    openJobMarket: "취업시장 열기",
    updates: "업데이트",
    viewAll: "더 보기",
    news: "뉴스와 가이드",
    information: "더 알아보기",
    sources: "출처",
    methodology: "방법론",
    howToUse: "워크스페이스 사용법",
    feedbackTitle: "CampCareer를 함께 개선해요",
    feedbackDescription:
      "다음 커리어 결정을 더 명확하게 만들 방법을 알려주세요.",
    feedbackAction: "피드백 보내기",
    category: {
      countries: {
        label: "국가",
        searchDescription: "국가를 선택해 국가 대시보드를 열어보세요.",
        action: "국가 열기",
      },
      visas: {
        label: "비자",
        searchDescription: "국가를 선택해 해당 비자 경로를 필터링하세요.",
        action: "비자 열기",
      },
      occupation: {
        label: "직업",
        searchDescription: "국가와 직업을 선택해 취업시장 화면을 열어보세요.",
        action: "직업 열기",
      },
      programs: {
        label: "프로그램",
        searchDescription: "국가와 직업을 선택해 관련 과정을 찾아보세요.",
        action: "프로그램 열기",
      },
      institutions: {
        label: "기관",
        searchDescription: "국가를 선택해 검증된 기관을 둘러보세요.",
        action: "기관 열기",
      },
    },
    updatesList: [
      {
        label: "Home 검색이 알맞은 워크스페이스 카테고리로 바로 연결됩니다",
        detail:
          "국가·비자·직업·프로그램·기관 탐색이 CampCareer 안에서 이어집니다.",
      },
      {
        label: "온보딩에서 고른 조건이 Home 검색에 반영됩니다",
        detail:
          "다른 경로를 보고 싶을 때는 이 화면에서 언제든 선택을 바꿀 수 있어요.",
      },
    ],
    newsList: [
      {
        label: "커리어 근거를 비교하는 방법",
        detail:
          "직업 수요, 비자, 자격 정보가 왜 별도로 확인되어야 하는지 알아보세요.",
      },
    ],
  },
};

export function MemberHomeHub({
  targetCountry,
  targetOccupation,
}: MemberHomeHubProps) {
  const locale = useRouteLocale();
  const router = useRouter();
  const copy = COPY[locale];
  const country = useMemo(
    () =>
      LAUNCH_COUNTRIES.find(
        (item) => item.code === targetCountry?.toUpperCase(),
      ),
    [targetCountry],
  );
  const career = useMemo(
    () =>
      targetOccupation
        ? CANONICAL_CAREER_BY_ID.get(targetOccupation)
        : undefined,
    [targetOccupation],
  );
  const [activeCategory, setActiveCategory] =
    useState<ExploreCategory>("occupation");
  const [searchValues, setSearchValues] = useState<OverviewSearchValues>({
    country: country?.code ?? "",
    occupation: career?.id ?? "",
  });
  const active = copy.category[activeCategory];
  const needsOccupation =
    activeCategory === "occupation" || activeCategory === "programs";
  const currentJobHref =
    country && career
      ? toCategoryHref(
          "occupation",
          { country: country.code, occupation: career.id },
          locale,
        )
      : null;

  const openExplorer = (values: OverviewSearchValues) => {
    router.push(toCategoryHref(activeCategory, values, locale));
  };

  return (
    <main
      className="mx-auto w-full max-w-6xl pb-12 pt-1 sm:pb-16"
      id="home-search"
    >
      <header className="border-b border-[#e8e9ee] pb-7 pt-2 sm:pb-9">
        <p className="text-[11px] font-bold tracking-[0.13em] text-blue-700">
          {copy.eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-slate-600">
          {copy.description}
        </p>
      </header>

      {country && career && currentJobHref ? (
        <section
          className="mt-7 flex flex-col gap-4 rounded-2xl border border-[#dce5f3] bg-[#f8fbff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          aria-label={copy.currentFocus}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
              <BriefcaseBusiness className="size-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.1em] text-blue-700">
                {copy.currentFocus}
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                {countryDisplayName(locale, country.code, country.name)} ·{" "}
                {locale === "ko" ? career.labelKo : career.label}
              </p>
            </div>
          </div>
          <Link
            href={currentJobHref}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#cbd9ef] bg-white px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
          >
            {copy.openJobMarket}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      ) : null}

      <section
        className="mt-7 overflow-visible rounded-3xl border border-[#dfe5ef] bg-[#fbfcff] p-5 shadow-[0_18px_44px_-38px_rgba(31,75,145,.42)] sm:p-7"
        aria-labelledby="workspace-search-heading"
      >
        <div className="max-w-2xl">
          <h2
            id="workspace-search-heading"
            className="text-xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-2xl"
          >
            {copy.searchTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {copy.searchDescription}
          </p>
        </div>

        <div
          className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
          role="tablist"
          aria-label={copy.searchTitle}
        >
          {CATEGORY_ORDER.map((categoryId) => {
            const Icon = CATEGORY_ICONS[categoryId];
            const category = copy.category[categoryId];
            const selected = categoryId === activeCategory;
            return (
              <button
                key={categoryId}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveCategory(categoryId)}
                className={`group rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 ${selected ? "border-blue-300 bg-white shadow-[0_12px_25px_-22px_rgba(30,64,175,.5)]" : "border-transparent bg-transparent hover:border-[#dbe3ee] hover:bg-white"}`}
              >
                <span
                  className={`grid size-9 place-items-center rounded-xl ${selected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"}`}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="mt-3 block text-sm font-semibold text-slate-950">
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-[#e5eaf2] pt-5" role="tabpanel">
          <div className="mb-4 flex items-start gap-2 text-sm text-slate-600">
            <BadgeInfo className="mt-0.5 size-4 shrink-0 text-blue-600" />
            <p>{active.searchDescription}</p>
          </div>
          <HomeSearchForm
            values={searchValues}
            locale={locale}
            onValuesChange={setSearchValues}
            onSubmit={openExplorer}
            showOccupation={needsOccupation}
            submitLabel={active.action}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,.8fr)]">
        <div className="space-y-5">
          <InfoList
            title={copy.updates}
            actionLabel={copy.viewAll}
            actionHref={localizePath("/blog", locale)}
            items={copy.updatesList}
            icon={<CheckCircle2 className="size-5 text-[#36745f]" />}
          />
          <InfoList
            title={copy.news}
            actionLabel={copy.viewAll}
            actionHref={localizePath("/blog", locale)}
            items={copy.newsList}
            icon={<Newspaper className="size-5 text-blue-700" />}
          />
        </div>

        <aside className="space-y-5">
          <section
            className="rounded-2xl border border-[#e0e5ee] bg-white p-5 sm:p-6"
            aria-labelledby="home-information-heading"
          >
            <h2
              id="home-information-heading"
              className="text-xl font-semibold tracking-[-0.04em] text-slate-950"
            >
              {copy.information}
            </h2>
            <div className="mt-5 space-y-3">
              <InfoLink
                href={localizePath("/sources", locale)}
                label={copy.sources}
              />
              <InfoLink
                href={localizePath("/methodology", locale)}
                label={copy.methodology}
              />
              <InfoLink href="#home-search" label={copy.howToUse} />
            </div>
          </section>

          <section
            className="rounded-2xl bg-[#174f83] p-5 text-white sm:p-6"
            aria-labelledby="home-feedback-heading"
          >
            <MessageCircleMore className="size-6 text-[#bce6d3]" />
            <h2
              id="home-feedback-heading"
              className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.045em]"
            >
              {copy.feedbackTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              {copy.feedbackDescription}
            </p>
            <FeedbackWidget
              label={copy.feedbackAction}
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#c9e36a] px-4 text-sm font-semibold text-[#17314f] hover:bg-[#d5ec81] focus-visible:ring-white"
            />
          </section>
        </aside>
      </section>
    </main>
  );
}

function toCategoryHref(
  category: ExploreCategory,
  values: OverviewSearchValues,
  locale: Locale,
) {
  const countryCode =
    values.country === "not-sure" ? "" : values.country.toUpperCase();
  const career = CANONICAL_CAREER_BY_ID.get(values.occupation);
  const countryPath =
    countryCode && LAUNCH_COUNTRIES.some((item) => item.code === countryCode)
      ? localizePath(`/countries/${countryCode.toLowerCase()}`, locale)
      : localizePath("/countries", locale);

  if (category === "countries") return countryPath;

  if (category === "visas") {
    const params = new URLSearchParams();
    if (countryCode) params.set("country", countryCode);
    const query = params.toString();
    return `${localizePath("/visas", locale)}${query ? `?${query}` : ""}`;
  }

  if (category === "occupation") {
    const params = new URLSearchParams();
    if (countryCode) params.set("country", countryCode);
    if (values.occupation) params.set("occupation", values.occupation);
    return `${localizePath("/occupation", locale)}?${params.toString()}`;
  }

  if (category === "programs") {
    const params = new URLSearchParams();
    if (countryCode) params.set("country", countryCode);
    if (career) params.set("q", career.label);
    const query = params.toString();
    return `${localizePath("/programs", locale)}${query ? `?${query}` : ""}`;
  }

  if (countryCode && INSTITUTION_COUNTRIES.has(countryCode)) {
    return localizePath(`/institutions/${countryCode.toLowerCase()}`, locale);
  }

  return localizePath("/institutions", locale);
}

function InfoList({
  title,
  actionLabel,
  actionHref,
  items,
  icon,
}: {
  title: string;
  actionLabel: string;
  actionHref: string;
  items: readonly { label: string; detail: string }[];
  icon: ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border border-[#e0e5ee] bg-white p-5 sm:p-6"
      aria-labelledby={`${title}-heading`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          {icon}
          <h2
            id={`${title}-heading`}
            className="text-xl font-semibold tracking-[-0.04em] text-slate-950"
          >
            {title}
          </h2>
        </div>
        <Link
          href={actionHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
        >
          {actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-5 divide-y divide-[#e9edf3] border-t border-[#e9edf3]">
        {items.map((item) => (
          <article key={item.label} className="py-4 first:pt-4 last:pb-0">
            <h3 className="text-sm font-semibold text-slate-900">
              {item.label}
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              {item.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function InfoLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center justify-between rounded-xl border border-[#e0e6ef] bg-[#fbfcff] px-4 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
    >
      {label}
      <ArrowRight className="size-4" />
    </Link>
  );
}
