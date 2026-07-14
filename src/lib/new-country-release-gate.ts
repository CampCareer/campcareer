/**
 * Release controls for the five country data packs added in the Nordic/NZ wave.
 *
 * A country profile can exist while its job-level data is still being audited.
 * Until the data has exact occupation mappings and reviewable source snapshots,
 * it must not enter search, sitemaps, or a ranked comparison.
 */
import { getLaunchCountry, type CountryPublicationStage } from "@/data/launch-countries"

export const NEW_COUNTRY_CODES = ["NZ", "NO", "SE", "DK", "FI"] as const;

export type NewCountryCode = (typeof NEW_COUNTRY_CODES)[number];

export type CountryReleaseStage = CountryPublicationStage;

export type CountryReleaseGate = {
  stage: CountryReleaseStage;
  indexable: boolean;
  comparable: boolean;
  reasons: readonly string[];
};

/**
 * Do not promote these values by changing a page-level flag. A country becomes
 * PROFILE_READY only after its source snapshots have real URLs/hashes and a
 * content review; it becomes DECISION_READY after exact career mappings,
 * compensation, housing, study-path and post-study evidence all pass review.
 */
export const NEW_COUNTRY_RELEASE_GATES: Record<
  NewCountryCode,
  CountryReleaseGate
> = {
  NZ: {
    stage: "REVIEW_REQUIRED",
    indexable: true,
    comparable: false,
    reasons: [
      "The map bundle has reviewed geography and provider references, but its salary, rent, shortage, and pathway source rows remain unpublished.",
      "Occupation-to-canonical-career mappings need exact-code verification before a decision comparison can be published.",
    ],
  },
  NO: {
    stage: "REVIEW_REQUIRED",
    indexable: true,
    comparable: false,
    reasons: [
      "Official-source snapshots need a completed capture and editorial review.",
      "Occupation-to-canonical-career mappings need exact-code verification.",
    ],
  },
  SE: {
    stage: "REVIEW_REQUIRED",
    indexable: true,
    comparable: false,
    reasons: [
      "Official-source snapshots need a completed capture and editorial review.",
      "Occupation-to-canonical-career mappings need exact-code verification.",
    ],
  },
  DK: {
    stage: "REVIEW_REQUIRED",
    indexable: true,
    comparable: false,
    reasons: [
      "Official-source snapshots need a completed capture and editorial review.",
      "Occupation-to-canonical-career mappings need exact-code verification.",
    ],
  },
  FI: {
    stage: "REVIEW_REQUIRED",
    indexable: true,
    comparable: false,
    reasons: [
      "Official-source snapshots need a completed capture and editorial review.",
      "Occupation-to-canonical-career mappings need exact-code verification.",
    ],
  },
};

export function isNewCountryCode(countryCode: string): countryCode is NewCountryCode {
  return NEW_COUNTRY_CODES.includes(countryCode.toUpperCase() as NewCountryCode);
}

export function getNewCountryReleaseGate(countryCode: string) {
  const normalized = countryCode.toUpperCase();
  return isNewCountryCode(normalized)
    ? NEW_COUNTRY_RELEASE_GATES[normalized]
    : undefined;
}

export function isCountrySearchIndexable(countryCode: string) {
  const gate = getNewCountryReleaseGate(countryCode)
  if (gate) return gate.indexable
  return getLaunchCountry(countryCode)?.publicationStage !== "REVIEW_REQUIRED"
}

export function isCountryDecisionReady(countryCode: string) {
  const gate = getNewCountryReleaseGate(countryCode)
  if (gate) return gate.comparable
  // Country readiness is not career readiness. V4 only admits a country after
  // an exact, approved career-country crosswalk and current observations.
  return false
}
