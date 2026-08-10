import type { MetadataRoute } from "next"
import { ROUTE_GUIDES, routeGuideHref } from "@/data/route-guides"
import { AU_PROGRAMMATIC_STUDY_PAGES } from "@/lib/programs/au-programmatic-seo"
import { INDEXABLE_AU_PROGRAMS, indexableAuProgramPath } from "@/lib/programs/program-routes"
import { INDEXABLE_AE_PROGRAM_PATHS } from "@/lib/programs/ae-program-seo"
import { INDEXABLE_KR_PROGRAM_PATHS } from "@/lib/programs/kr-program-seo"
import { INDEXABLE_JP_PROGRAM_PATHS } from "@/lib/programs/jp-program-seo"
import { INDEXABLE_NO_PROGRAM_PATHS } from "@/lib/programs/no-program-seo"
import { INDEXABLE_FI_PROGRAM_PATHS } from "@/lib/programs/fi-program-seo"
import { INDEXABLE_DK_PROGRAM_PATHS } from "@/lib/programs/dk-program-seo"
import { INDEXABLE_SE_PROGRAM_PATHS } from "@/lib/programs/se-program-seo"
import { INDEXABLE_CH_PROGRAM_PATHS } from "@/lib/programs/ch-program-seo"
import { INDEXABLE_BE_PROGRAM_PATHS } from "@/lib/programs/be-program-seo"
import { INDEXABLE_ES_PROGRAM_PATHS } from "@/lib/programs/es-program-seo"
import { INDEXABLE_FR_PROGRAM_PATHS } from "@/lib/programs/fr-program-seo"
import { INDEXABLE_DE_PROGRAM_PATHS } from "@/lib/programs/de-program-seo"
import { INDEXABLE_SG_PROGRAM_PATHS } from "@/lib/programs/sg-program-seo"
import { AU_OCCUPATION_STATE_PAGES } from "@/lib/workspace/au-occupation-state-seo"
import { INDEXABLE_OCCUPATION_PROFILES, occupationCanonicalPath } from "@/lib/workspace/occupation-routes"
import { getCompletedVisaCatalog } from "@/lib/workspace/visa-catalog-complete"
import { getIndexableVisaRoutes } from "@/lib/workspace/visa-routes"
import { INDEXABLE_AE_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-ae"
import { INDEXABLE_AUTHORITY_FASTPATH_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-authority-fastpath"
import { INDEXABLE_DE_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-de"
import { INDEXABLE_ES_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-es"
import { INDEXABLE_EU_FASTPATH_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-eu-fastpath"
import { INDEXABLE_FR_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-fr"
import { INDEXABLE_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo"
import { INDEXABLE_NL_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-nl"
import { INDEXABLE_NZ_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-nz"
import { INDEXABLE_SG_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-sg"
import { INDEXABLE_UK_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-uk"
import { INDEXABLE_US_INSTITUTION_PATHS } from "@/lib/institutions/institution-seo-us"
import { PUBLISHED_UK_CITY_SLUGS, PUBLISHED_US_CITY_SLUGS } from "@/lib/cities/city-routes"
import { CANONICAL_COUNTRY_SLUGS, SITE_URL, countryCanonicalPath } from "@/lib/seo-routes.mjs"

const lastModified = new Date("2026-08-10")
export default function sitemap(): MetadataRoute.Sitemap {
  const methodologies=["australia","canada","united-states","united-kingdom","ireland","germany","netherlands","belgium","france","spain","singapore","south-korea","japan","new-zealand","norway","sweden","denmark","finland","switzerland","united-arab-emirates"]
  const staticPages:MetadataRoute.Sitemap=[
    {url:`${SITE_URL}/`,lastModified,priority:1,changeFrequency:"weekly"},{url:`${SITE_URL}/maps`,lastModified,priority:.9,changeFrequency:"daily"},{url:`${SITE_URL}/programs`,lastModified,priority:.85,changeFrequency:"weekly"},{url:`${SITE_URL}/institutions`,lastModified,priority:.85,changeFrequency:"weekly"},
    ...["au","ca","uk","nl","nz","sg","de","fr","es","be","ch","se","dk","fi","no","jp","kr","ae","us"].map(slug=>({url:`${SITE_URL}/institutions/${slug}`,lastModified,priority:.82,changeFrequency:"weekly" as const})),
    ...CANONICAL_COUNTRY_SLUGS.map(slug=>({url:`${SITE_URL}${countryCanonicalPath(slug)}`,lastModified,priority:.85,changeFrequency:"monthly" as const})),
    ...["sydney","melbourne","brisbane","perth","adelaide"].map(city=>({url:`${SITE_URL}/cities/au/${city}`,lastModified,priority:.8,changeFrequency:"monthly" as const})),
    ...["toronto","vancouver","montreal","ottawa","calgary"].map(city=>({url:`${SITE_URL}/cities/ca/${city}`,lastModified,priority:.8,changeFrequency:"monthly" as const})),
    ...["waterloo","edmonton"].map(city=>({url:`${SITE_URL}/cities/ca/${city}`,lastModified,priority:.78,changeFrequency:"monthly" as const})),
    ...PUBLISHED_US_CITY_SLUGS.map(slug=>({url:`${SITE_URL}/cities/us/${slug}`,lastModified,priority:.8,changeFrequency:"monthly" as const})),
    ...PUBLISHED_UK_CITY_SLUGS.map(slug=>({url:`${SITE_URL}/cities/uk/${slug}`,lastModified,priority:.8,changeFrequency:"monthly" as const})),
    {url:`${SITE_URL}/methodology`,lastModified,priority:.5,changeFrequency:"monthly"},...methodologies.map(slug=>({url:`${SITE_URL}/methodology/${slug}`,lastModified,priority:.45,changeFrequency:"monthly" as const})),{url:`${SITE_URL}/privacy`,lastModified,priority:.2,changeFrequency:"yearly"},{url:`${SITE_URL}/terms`,lastModified,priority:.2,changeFrequency:"yearly"}
  ]
  const programPages:MetadataRoute.Sitemap=[
    ...INDEXABLE_AU_PROGRAMS.map(program=>({url:`${SITE_URL}${indexableAuProgramPath(program)}`,lastModified:new Date(program.sourceCheckedAt),priority:.74,changeFrequency:"weekly" as const})),
    ...[...INDEXABLE_AE_PROGRAM_PATHS,...INDEXABLE_KR_PROGRAM_PATHS,...INDEXABLE_JP_PROGRAM_PATHS,...INDEXABLE_NO_PROGRAM_PATHS,...INDEXABLE_FI_PROGRAM_PATHS,...INDEXABLE_DK_PROGRAM_PATHS,...INDEXABLE_SE_PROGRAM_PATHS,...INDEXABLE_CH_PROGRAM_PATHS,...INDEXABLE_BE_PROGRAM_PATHS,...INDEXABLE_ES_PROGRAM_PATHS,...INDEXABLE_FR_PROGRAM_PATHS,...INDEXABLE_DE_PROGRAM_PATHS,...INDEXABLE_SG_PROGRAM_PATHS].map(path=>({url:`${SITE_URL}${path}`,lastModified,priority:.74,changeFrequency:"weekly" as const}))
  ]
  const occupationPages:MetadataRoute.Sitemap=INDEXABLE_OCCUPATION_PROFILES.map(profile=>({url:`${SITE_URL}${occupationCanonicalPath(profile.countryCode,profile.careerId)}`,lastModified:new Date(profile.sourceCheckedAt),priority:.74,changeFrequency:"weekly" as const}))
  const visaPages:MetadataRoute.Sitemap=getIndexableVisaRoutes(getCompletedVisaCatalog()).map(route=>({url:`${SITE_URL}${route.path}`,lastModified,priority:.7,changeFrequency:"monthly" as const}))
  const studyPages:MetadataRoute.Sitemap=AU_PROGRAMMATIC_STUDY_PAGES.map(page=>({url:`${SITE_URL}${page.path}`,lastModified,priority:.72,changeFrequency:"weekly" as const}))
  const occupationStatePages:MetadataRoute.Sitemap=AU_OCCUPATION_STATE_PAGES.map(page=>({url:`${SITE_URL}${page.path}`,lastModified,priority:.71,changeFrequency:"monthly" as const}))
  const institutionPages:MetadataRoute.Sitemap=[...INDEXABLE_INSTITUTION_PATHS,...INDEXABLE_UK_INSTITUTION_PATHS,...INDEXABLE_NL_INSTITUTION_PATHS,...INDEXABLE_NZ_INSTITUTION_PATHS,...INDEXABLE_SG_INSTITUTION_PATHS,...INDEXABLE_DE_INSTITUTION_PATHS,...INDEXABLE_FR_INSTITUTION_PATHS,...INDEXABLE_ES_INSTITUTION_PATHS,...INDEXABLE_EU_FASTPATH_INSTITUTION_PATHS,...INDEXABLE_AUTHORITY_FASTPATH_INSTITUTION_PATHS,...INDEXABLE_AE_INSTITUTION_PATHS,...INDEXABLE_US_INSTITUTION_PATHS].map(path=>({url:`${SITE_URL}${path}`,lastModified,priority:.72,changeFrequency:"weekly" as const}))
  const routePages:MetadataRoute.Sitemap=ROUTE_GUIDES.flatMap(guide=>[{url:`${SITE_URL}${routeGuideHref(guide)}`,lastModified:new Date(guide.lastVerified),priority:.95,changeFrequency:"weekly" as const},{url:`${SITE_URL}/ko${routeGuideHref(guide)}`,lastModified,priority:.9,changeFrequency:"weekly" as const}])
  return Array.from(new Map([...staticPages,...programPages,...occupationPages,...visaPages,...studyPages,...occupationStatePages,...institutionPages,...routePages].map(entry=>[entry.url,entry])).values())
}
