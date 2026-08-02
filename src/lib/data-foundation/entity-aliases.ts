import { COUNTRY_COMPARE_CATALOG } from "@/data/country-comparison/locations"
import {
  CAREER_COMPARE_IDS,
  type CareerCompareId,
} from "@/data/career-comparison/australia"
import { AUSTRALIA_NURSING_PROGRAMS } from "@/data/programs/australia-nursing"

export const PRODUCT_COUNTRY_CODES = ["AU", "IE", "UK"] as const
export type ProductCountryCode = (typeof PRODUCT_COUNTRY_CODES)[number]

export const CANONICAL_COUNTRY_CODES = ["AU", "IE", "GB"] as const
export type CanonicalCountryCode = (typeof CANONICAL_COUNTRY_CODES)[number]

export type ProductLocationId = `${ProductCountryCode}:${string}`

export type AliasRelation = "exact" | "related" | "broader" | "narrower" | "legacy"
export type EntityResolutionStatus = "resolved" | "unresolved" | "ambiguous"
export type RegistryEntityType = "country" | "location" | "career" | "program"

export type OccupationCodeMapping = {
  system: string
  version: string
  code: string
  relation: AliasRelation
  sourceId: string | null
  reviewedAt: string | null
}

export type EntityAlias = {
  entityType: RegistryEntityType
  inputId: string
  productId: string | null
  canonicalResolverKey: string
  canonicalEntityId: string | null
  relation: AliasRelation
  status: EntityResolutionStatus
}

export type CountryAlias = EntityAlias & {
  entityType: "country"
  productId: ProductCountryCode
  canonicalEntityId: CanonicalCountryCode
}

export type LocationAlias = EntityAlias & {
  entityType: "location"
  inputId: ProductLocationId
  productId: ProductLocationId
  productLocationId: ProductLocationId
  productCountryCode: ProductCountryCode
  citySlug: string
  displayName: string
  canonicalCountryCode: CanonicalCountryCode
  canonicalEntityId: null
}

export type CareerAlias = EntityAlias & {
  entityType: "career"
  occupationCodeMappings: readonly OccupationCodeMapping[]
}

export type ProgramAlias = EntityAlias & {
  entityType: "program"
  resolverKind: "catalog-programme-id" | "provider-identifier" | "institution-programme-key" | "official-url"
  officialUrl: string | null
}

const COUNTRY_ALIASES: readonly CountryAlias[] = [
  {
    entityType: "country",
    inputId: "AU",
    productId: "AU",
    canonicalResolverKey: "core.country:AU",
    canonicalEntityId: "AU",
    relation: "exact",
    status: "resolved",
  },
  {
    entityType: "country",
    inputId: "IE",
    productId: "IE",
    canonicalResolverKey: "core.country:IE",
    canonicalEntityId: "IE",
    relation: "exact",
    status: "resolved",
  },
  {
    entityType: "country",
    inputId: "UK",
    productId: "UK",
    canonicalResolverKey: "core.country:GB",
    canonicalEntityId: "GB",
    relation: "exact",
    status: "resolved",
  },
]

const PRODUCT_COUNTRY_BY_INPUT = new Map<string, ProductCountryCode>([
  ["au", "AU"],
  ["australia", "AU"],
  ["ie", "IE"],
  ["ireland", "IE"],
  ["uk", "UK"],
  ["united-kingdom", "UK"],
  ["united kingdom", "UK"],
  ["gb", "UK"],
])

function normalizeCountryInput(value: string): string {
  return value.trim().toLowerCase().replaceAll("_", "-")
}

/** Converts a product or accepted ISO country input to the canonical code. */
export function toCanonicalCountryCode(value: string): CanonicalCountryCode | null {
  const productCode = PRODUCT_COUNTRY_BY_INPUT.get(normalizeCountryInput(value))
  if (!productCode) return null
  return productCode === "UK" ? "GB" : productCode
}

/** Converts product, ISO, Maps, or supported country-slug input to product code. */
export function toProductCountryCode(value: string): ProductCountryCode | null {
  return PRODUCT_COUNTRY_BY_INPUT.get(normalizeCountryInput(value)) ?? null
}

export function countrySlugToProductCountryCode(value: string): ProductCountryCode | null {
  return toProductCountryCode(value)
}

export function getCountryAlias(value: string): CountryAlias | null {
  const productCode = toProductCountryCode(value)
  return productCode
    ? COUNTRY_ALIASES.find((alias) => alias.productId === productCode) ?? null
    : null
}

function createLocationAlias(
  productCountryCode: ProductCountryCode,
  citySlug: string,
  displayName: string,
): LocationAlias {
  const canonicalCountryCode = toCanonicalCountryCode(productCountryCode)!
  const productLocationId = `${productCountryCode}:${citySlug}` as ProductLocationId
  return {
    entityType: "location",
    inputId: productLocationId,
    productId: productLocationId,
    productLocationId,
    productCountryCode,
    citySlug,
    displayName,
    canonicalCountryCode,
    canonicalResolverKey: `core.geography:${productLocationId}`,
    canonicalEntityId: null,
    relation: "exact",
    status: "unresolved",
  }
}

const LOCATION_ALIASES: readonly LocationAlias[] = COUNTRY_COMPARE_CATALOG.flatMap((country) =>
  country.cities.map((city) => createLocationAlias(country.productCode, city.citySlug, city.cityName)),
)

const LOCATION_BY_ID = new Map<string, LocationAlias>(LOCATION_ALIASES.map((alias) => [alias.productId, alias]))

/** Parses only country-qualified locations; `sydney` is intentionally invalid. */
export function parseProductLocationId(value: string): LocationAlias | null {
  const normalized = value.trim()
  if (!normalized || normalized.split(":").length !== 2) return null

  const [rawCountry, rawCity] = normalized.split(":")
  const normalizedRawCountry = normalizeCountryInput(rawCountry)
  if (!(PRODUCT_COUNTRY_CODES as readonly string[]).some((code) => code.toLowerCase() === normalizedRawCountry)) return null
  const productCountryCode = toProductCountryCode(rawCountry)
  if (!productCountryCode) return null
  return LOCATION_BY_ID.get(`${productCountryCode}:${rawCity.trim().toLowerCase()}`) ?? null
}

export function getLocationAlias(value: string): LocationAlias | null {
  return parseProductLocationId(value)
}

function careerAlias(
  inputId: string,
  productId: string | null,
  relation: AliasRelation,
  canonicalResolverKey: string,
): CareerAlias {
  return {
    entityType: "career",
    inputId,
    productId,
    canonicalResolverKey,
    canonicalEntityId: null,
    relation,
    status: "unresolved",
    occupationCodeMappings: [],
  }
}

const CAREER_ALIASES: readonly CareerAlias[] = [
  careerAlias("registered-nurse", "registered-nurse", "exact", "taxonomy.occupation:registered-nurse"),
  careerAlias("software-engineer", "software-engineer", "exact", "taxonomy.occupation:software-engineer"),
  careerAlias("software-developer", "software-engineer", "related", "taxonomy.occupation:software-developer"),
  careerAlias("early-childhood-teacher", "early-childhood-teacher", "exact", "taxonomy.occupation:early-childhood-teacher"),
  // Educator remains a separate occupation entity; it is not an alias of teacher.
  careerAlias("early-childhood-educator", null, "exact", "taxonomy.occupation:early-childhood-educator"),
]

const CAREER_ALIAS_BY_ID = new Map(CAREER_ALIASES.map((alias) => [alias.inputId, alias]))

export function getCareerAlias(value: string): CareerAlias | null {
  return CAREER_ALIAS_BY_ID.get(value.trim().toLowerCase()) ?? null
}

const PROGRAM_ALIASES: readonly ProgramAlias[] = AUSTRALIA_NURSING_PROGRAMS.map((program) => ({
  entityType: "program",
  inputId: program.id,
  productId: program.id,
  canonicalResolverKey: `official-url:${program.source.url}`,
  canonicalEntityId: null,
  relation: "exact" as const,
  status: "resolved" as const,
  resolverKind: "official-url" as const,
  officialUrl: program.source.url,
}))

const PROGRAM_ALIAS_BY_ID = new Map(PROGRAM_ALIASES.map((alias) => [alias.inputId, alias]))

export function getProgramAlias(value: string): ProgramAlias | null {
  return PROGRAM_ALIAS_BY_ID.get(value.trim()) ?? null
}

export function resolveProductEntity(entityType: RegistryEntityType, inputId: string): EntityAlias | null {
  if (entityType === "country") return getCountryAlias(inputId)
  if (entityType === "location") return getLocationAlias(inputId)
  if (entityType === "career") return getCareerAlias(inputId)
  return getProgramAlias(inputId)
}

export function isSupportedProductEntityId(entityType: RegistryEntityType, inputId: string): boolean {
  const alias = resolveProductEntity(entityType, inputId)
  if (!alias) return false
  if (entityType === "career") return CAREER_COMPARE_IDS.includes(alias.inputId as CareerCompareId)
  return alias.productId !== null
}

export const PRODUCT_ENTITY_REGISTRY = {
  countries: COUNTRY_ALIASES,
  locations: LOCATION_ALIASES,
  careers: CAREER_ALIASES,
  programs: PROGRAM_ALIASES,
} as const
