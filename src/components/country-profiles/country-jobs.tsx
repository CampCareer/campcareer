import Link from "next/link"
import {
  isCountrySearchIndexable,
  type NewCountryCode,
} from "@/lib/new-country-release-gate"
import { CountryDataNotice } from "./country-data-notice"

type OccupationRow = {
  code: string;
  nameEn: string;
  nameLocal?: string;
  field?: string;
  path: string;
};

type CountryJobsProps = {
  countryCode: NewCountryCode;
  countryName: string;
  classificationLabel: string;
  hubPath: string;
  occupations: OccupationRow[];
};

export function CountryJobs({
  countryCode,
  countryName,
  classificationLabel,
  hubPath,
  occupations,
}: CountryJobsProps) {
  const searchIndexable = isCountrySearchIndexable(countryCode);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link href={hubPath} className="text-sm font-semibold text-blue-700 hover:underline">
        {countryName} profile
      </Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">
        {countryName} occupations and study pathways
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
        CampCareer uses {classificationLabel} only when an exact occupation
        mapping, wage definition and current official source are available.
        Occupation data is not immigration eligibility advice.
      </p>

      {!searchIndexable ? (
        <div className="mt-8">
          <CountryDataNotice countryName={countryName} />
        </div>
      ) : (
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {occupations.map((occupation) => (
            <Link
              key={occupation.code}
              href={occupation.path}
              className="block py-4 hover:bg-slate-50"
            >
              <span className="block font-semibold text-slate-900">
                {occupation.nameLocal ?? occupation.nameEn}
              </span>
              <span className="mt-1 block text-sm text-slate-500">
                {occupation.nameEn} · {classificationLabel} {occupation.code}
              </span>
              {occupation.field && (
                <span className="mt-1 block text-xs text-slate-500">
                  {occupation.field}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
