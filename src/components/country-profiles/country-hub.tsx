import Link from "next/link"
import {
  isCountrySearchIndexable,
  type NewCountryCode,
} from "@/lib/new-country-release-gate"
import {
  CountryDecisionOverview,
  CountryQuickRoiPreview,
} from "./australia-decision-overview"
import { CountryDataNotice } from "./country-data-notice"

type CountryHubCode = NewCountryCode | "CH";

type RegionSummary = {
  code: string;
  nameEn: string;
  slug: string;
};

type CountryHubProps = {
  countryCode: CountryHubCode;
  countryName: string;
  classificationLabel: string;
  regions: RegionSummary[];
  cityCount: number;
  institutionCount: number;
  jobsPath: string;
  showDataNotice?: boolean;
  countryRoiCode?: string;
};

export function CountryHub({
  countryCode,
  countryName,
  classificationLabel,
  regions,
  cityCount,
  institutionCount,
  jobsPath,
  showDataNotice = true,
  countryRoiCode,
}: CountryHubProps) {
  const searchIndexable = isCountrySearchIndexable(countryCode);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className={`mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16${countryRoiCode ? " grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start" : ""}`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              {countryName}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">
              {countryName} study and career profile
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Explore regional study locations, institutions and the official
              occupation classification used for comparable career data.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Compare verified career paths
              </Link>
              <Link
                href={jobsPath}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-100"
              >
                View occupation methodology
              </Link>
            </div>
          </div>
          {countryRoiCode && <CountryQuickRoiPreview countryCode={countryRoiCode} />}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric value={String(regions.length)} label="Regional profiles" note="Regional reference data" />
          <Metric value={String(cityCount)} label="Cities" note="Location reference data" />
          <Metric value={classificationLabel} label="Occupation classification" note="Used for exact career mappings" />
          <Metric value={String(institutionCount)} label="Institutions" note="Institution reference data" />
        </div>

        {countryRoiCode && <CountryDecisionOverview countryCode={countryRoiCode} />}

        {!searchIndexable && showDataNotice && (
          <div className="mt-8">
            <CountryDataNotice countryName={countryName} />
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Regional study profiles</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => (
              <Link
                key={region.code}
                href={"/maps/" + countryCode.toLowerCase() + "/regions/" + region.slug}
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm hover:border-slate-400 hover:bg-slate-50"
              >
                <span className="font-semibold text-slate-900">{region.nameEn}</span>
                <span className="ml-2 text-slate-500">Regional profile</span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}
