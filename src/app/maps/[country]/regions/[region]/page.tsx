import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CountryDataNotice } from "@/components/country-profiles/country-data-notice"
import { getDKRegion, DK_REGIONS } from "@/data/dk-map-data"
import { getFIRegion, FI_REGIONS } from "@/data/fi-map-data"
import { getNORegion, NO_REGIONS } from "@/data/no-map-data"
import { getNZRegion, NZ_REGIONS } from "@/data/nz-map-data"
import { getSERegion, SE_REGIONS } from "@/data/se-map-data"
import {
  isCountrySearchIndexable,
  type NewCountryCode,
} from "@/lib/new-country-release-gate"
import { pageMetadata } from "@/lib/seo"

type RegionProfile = {
  code: string
  nameEn: string
  slug: string
}

type CountryRegionConfig = {
  countryCode: NewCountryCode
  countryName: string
  hubPath: string
  regions: RegionProfile[]
  getRegion: (value: string) => RegionProfile | null
}

const COUNTRY_REGIONS: Record<string, CountryRegionConfig> = {
  nz: {
    countryCode: "NZ",
    countryName: "New Zealand",
    hubPath: "/nz",
    regions: NZ_REGIONS,
    getRegion: getNZRegion,
  },
  no: {
    countryCode: "NO",
    countryName: "Norway",
    hubPath: "/no",
    regions: NO_REGIONS,
    getRegion: getNORegion,
  },
  se: {
    countryCode: "SE",
    countryName: "Sweden",
    hubPath: "/se",
    regions: SE_REGIONS,
    getRegion: getSERegion,
  },
  dk: {
    countryCode: "DK",
    countryName: "Denmark",
    hubPath: "/dk",
    regions: DK_REGIONS,
    getRegion: getDKRegion,
  },
  fi: {
    countryCode: "FI",
    countryName: "Finland",
    hubPath: "/fi",
    regions: FI_REGIONS,
    getRegion: getFIRegion,
  },
}

type PageProps = {
  params: Promise<{ country: string; region: string }>
}

function getCountryRegion(country: string, region: string) {
  const config = COUNTRY_REGIONS[country]
  return config ? { config, region: config.getRegion(region) } : null
}

export function generateStaticParams() {
  return Object.entries(COUNTRY_REGIONS).flatMap(([country, config]) =>
    config.regions.map((region) => ({ country, region: region.slug })),
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, region } = await params
  const result = getCountryRegion(country, region)

  if (!result?.region) {
    return {
      title: "Regional profile not found | CampCareer",
      robots: { index: false, follow: false },
    }
  }

  const { config, region: profile } = result
  const path = "/maps/" + country + "/regions/" + profile.slug
  return {
    ...pageMetadata({
      title: profile.nameEn + ", " + config.countryName + " Study Profile | CampCareer",
      description:
        "Regional study-location profile for " +
        profile.nameEn +
        ", " +
        config.countryName +
        ".",
      path,
    }),
    alternates: { canonical: path },
    robots: {
      index: isCountrySearchIndexable(config.countryCode),
      follow: true,
    },
  }
}

export default async function CountryRegionProfilePage({ params }: PageProps) {
  const { country, region } = await params
  const result = getCountryRegion(country, region)

  if (!result?.region) notFound()

  const { config, region: profile } = result
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href={config.hubPath} className="text-sm font-semibold text-blue-700 hover:underline">
        {config.countryName} profile
      </Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950">
        {profile.nameEn}, {config.countryName}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        Regional reference profile for study-location research. It is not a
        ranking, immigration assessment or employment guarantee.
      </p>
      <div className="mt-8">
        <CountryDataNotice countryName={config.countryName} />
      </div>
    </main>
  )
}
