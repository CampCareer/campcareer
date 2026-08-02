import "server-only"

import { supabaseAdmin } from "@/lib/supabase-admin"
import {
  AU_NURSING_PROGRAM_MAPPINGS,
  getAuNursingProgramMapping,
  isAuNursingProductProgramId,
  toAuNursingProgramCompareItem,
  unavailableAuNursingProgramCompareItem,
  type AuNursingCanonicalInput,
} from "@/lib/data-foundation/compare-adapters/au-nursing-programmes"
import type {
  ProgramCompareRepository,
  ProgramCompareSourceReference,
} from "@/lib/data-foundation/program-compare-contract"

const SCHEMA = "api_private"
const CATALOG_VIEW = "au_nursing_programme_catalog_v1"
const FEES_VIEW = "au_nursing_programme_fees_v1"
const REQUIREMENTS_VIEW = "au_nursing_programme_requirements_v1"
const EVIDENCE_VIEW = "au_nursing_programme_evidence_v1"

type CatalogRow = {
  identifier_programme_id: string
  identifier_source_url: string | null
  programme_id: string
  programme_institution_id: string
  canonical_title: string
  qualification_label: string | null
  institution_id: string
  institution_name: string
  offering_id: string | null
  offering_campus_id: string | null
  offering_market: string | null
  offering_duration_months: number | null
  offering_source_url: string | null
  offering_valid_from: string | null
  offering_valid_to: string | null
  campus_id: string | null
  campus_name: string | null
  campus_city: string | null
  campus_region: string | null
  campus_country_code: string | null
}

type FeeRow = {
  fee_id: string
  offering_id: string
  fee_type: string
  amount: number | string
  currency_code: string
  billing_basis: string
  student_market: string
  evidence_id: string | null
  effective_from: string | null
  effective_to: string | null
}

type RequirementRow = {
  requirement_id: string
  offering_id: string
  requirement_type: string
  requirement_text: string
  evidence_id: string | null
  review_status: string
}

type EvidenceRow = {
  observation_id: string
  metric_key: string
  scope_id: string
  value: unknown
  source_snapshot_id: string
  review_status: string
  reviewed_at: string | null
  source_id: string
  organisation_name: string
  source_name: string
  canonical_url: string
}

type ReadResult<T> = { data: T[] | null; error: { code?: string; message?: string } | null }

const CATALOG_SELECT = [
  "identifier_programme_id", "identifier_source_url", "programme_id", "programme_institution_id", "canonical_title", "qualification_label",
  "institution_id", "institution_name", "offering_id", "offering_campus_id", "offering_market", "offering_duration_months", "offering_source_url",
  "offering_valid_from", "offering_valid_to", "campus_id", "campus_name", "campus_city", "campus_region", "campus_country_code",
].join(",")
const FEE_SELECT = "fee_id,offering_id,fee_type,amount,currency_code,billing_basis,student_market,evidence_id,effective_from,effective_to"
const REQUIREMENT_SELECT = "requirement_id,offering_id,requirement_type,requirement_text,evidence_id,review_status"
const EVIDENCE_SELECT = "observation_id,metric_key,scope_id,value,source_snapshot_id,review_status,reviewed_at,source_id,organisation_name,source_name,canonical_url"

function isCurrent(from: string | null, to: string | null, asOf: string) {
  return (!from || from <= asOf) && (!to || to >= asOf)
}

function dateOnly(value: string | null) {
  return value?.slice(0, 10) ?? null
}

function sourceReferences(rows: readonly EvidenceRow[]): readonly ProgramCompareSourceReference[] {
  return [...new Map(rows.map((row) => [row.source_id, {
    organisation: row.organisation_name,
    title: row.source_name,
    url: row.canonical_url,
    reviewedAt: dateOnly(row.reviewed_at),
    verificationStatus: row.review_status === "verified" ? "verified" as const : "needs-review" as const,
  }])).values()]
}

function latestReviewedAt(rows: readonly EvidenceRow[]) {
  return rows.map((row) => dateOnly(row.reviewed_at)).filter((value): value is string => Boolean(value)).sort().at(-1) ?? null
}

function fallbackSource(url: string | null): ProgramCompareSourceReference[] {
  return url ? [{ organisation: "Programme provider", title: "Official programme page", url, reviewedAt: null, verificationStatus: "needs-review" }] : []
}

function parseReferenceYear(value: unknown): number | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null
  const year = (value as { year?: unknown }).year
  return typeof year === "number" && Number.isInteger(year) ? year : null
}

function selectCurrentTuition(fees: readonly FeeRow[], evidenceById: ReadonlyMap<string, EvidenceRow>, asOf: string) {
  const candidates = fees
    .filter((row) => row.fee_type === "tuition" && row.student_market === "international" && isCurrent(row.effective_from, row.effective_to, asOf))
    .map((row) => ({ row, evidence: row.evidence_id ? evidenceById.get(row.evidence_id) : undefined }))
    .filter((candidate) => candidate.evidence?.review_status === "verified" && Number(candidate.row.amount) > 0)
    .sort((a, b) => (b.row.effective_from ?? "").localeCompare(a.row.effective_from ?? ""))
  return candidates[0] ?? null
}

function toInput(
  mapping: (typeof AU_NURSING_PROGRAM_MAPPINGS)[number],
  catalog: CatalogRow,
  fee: { row: FeeRow; evidence?: EvidenceRow } | null,
  requirement: RequirementRow | null,
  evidenceById: ReadonlyMap<string, EvidenceRow>,
): AuNursingCanonicalInput {
  const evidenceRows = [...evidenceById.values()].filter((row) => row.scope_id === mapping.canonicalProgrammeId)
  const refs = sourceReferences(evidenceRows)
  const fallbackRefs = refs.length ? refs : fallbackSource(catalog.identifier_source_url ?? mapping.officialUrl)
  const tuitionEvidence = fee?.evidence
  const tuitionRefs = tuitionEvidence ? sourceReferences([tuitionEvidence]) : []
  const reviewedAt = latestReviewedAt(evidenceRows)
  return {
    productProgramId: mapping.productProgramId,
    canonicalProgrammeId: mapping.canonicalProgrammeId,
    canonicalOfferingId: mapping.canonicalOfferingId,
    institutionId: catalog.institution_id,
    institutionName: catalog.institution_name,
    institutionShortName: catalog.institution_name === "Queensland University of Technology" ? "QUT" : catalog.institution_name === "University of the Sunshine Coast" ? "UniSC" : null,
    programmeName: catalog.canonical_title,
    qualification: catalog.qualification_label,
    campusId: catalog.campus_id ?? catalog.offering_campus_id,
    campusName: catalog.campus_name,
    cityName: catalog.campus_city,
    regionName: catalog.campus_region,
    durationMonths: catalog.offering_duration_months,
    tuition: tuitionEvidence && fee
      ? { amount: Number(fee.row.amount), currency: fee.row.currency_code, basis: fee.row.billing_basis, referenceYear: parseReferenceYear(tuitionEvidence.value), reviewedAt: dateOnly(tuitionEvidence.reviewed_at), sources: tuitionRefs }
      : null,
    entryRequirements: requirement?.requirement_text ?? null,
    sources: fallbackRefs,
    reviewedAt,
  }
}

function errorForMissing(catalogRows: readonly CatalogRow[], mapping: (typeof AU_NURSING_PROGRAM_MAPPINGS)[number]) {
  const programmeRows = catalogRows.filter((row) => row.programme_id === mapping.canonicalProgrammeId)
  if (programmeRows.length === 0) return "canonical_programme_not_found" as const
  const offering = programmeRows.find((row) => row.offering_id === mapping.canonicalOfferingId && (row.offering_market === "international" || row.offering_market === "both"))
  return offering ? null : "canonical_offering_not_found" as const
}

async function readRows<T>(query: PromiseLike<unknown>) {
  const result = await query as ReadResult<T>
  return { rows: result.data ?? [], errorCode: result.error?.code ?? null }
}

export const AU_NURSING_PROGRAM_COMPARE_REPOSITORY: ProgramCompareRepository = {
  async resolveProductProgramId(productProgramId) {
    const mapping = getAuNursingProgramMapping(productProgramId)
    if (!mapping) return { status: "unresolved", canonicalProgrammeId: null, canonicalOfferingId: null, errorCode: "invalid_product_program_id" }
    return { status: "resolved", canonicalProgrammeId: mapping.canonicalProgrammeId, canonicalOfferingId: mapping.canonicalOfferingId, errorCode: null }
  },

  async getProgramCompareItem(canonicalProgrammeId, canonicalOfferingId) {
    const mapping = AU_NURSING_PROGRAM_MAPPINGS.find((candidate) => candidate.canonicalProgrammeId === canonicalProgrammeId && candidate.canonicalOfferingId === canonicalOfferingId)
    if (!mapping) return null
    const items = await this.getProgramCompareItems([mapping.productProgramId])
    return items[0] ?? null
  },

  async getProgramCompareItems(productProgramIds) {
    const uniqueIds = [...new Set(productProgramIds)]
    const invalidItems = uniqueIds.filter((id) => !isAuNursingProductProgramId(id)).map((id) => unavailableAuNursingProgramCompareItem(id, "invalid_product_program_id"))
    const mappings = uniqueIds.map((id) => getAuNursingProgramMapping(id)).filter((mapping): mapping is (typeof AU_NURSING_PROGRAM_MAPPINGS)[number] => Boolean(mapping))
    if (mappings.length === 0) return invalidItems
    const asOf = new Date().toISOString().slice(0, 10)
    const urls = mappings.map((mapping) => mapping.officialUrl)
    const catalogResult = await readRows<CatalogRow>(supabaseAdmin.schema(SCHEMA).from(CATALOG_VIEW).select(CATALOG_SELECT).in("identifier_source_url", urls))
    if (catalogResult.errorCode) return [...invalidItems, ...mappings.map((mapping) => unavailableAuNursingProgramCompareItem(mapping.productProgramId, "server_data_error"))]
    const selectedCatalog = mappings.flatMap((mapping) => catalogResult.rows.filter((row) => row.programme_id === mapping.canonicalProgrammeId && row.offering_id === mapping.canonicalOfferingId && (row.offering_market === "international" || row.offering_market === "both")))
    const offeringIds = [...new Set(selectedCatalog.map((row) => row.offering_id).filter((id): id is string => Boolean(id)))]
    const programmeIds = [...new Set(selectedCatalog.map((row) => row.programme_id))]
    const [feesResult, requirementsResult, evidenceResult] = await Promise.all([
      offeringIds.length ? readRows<FeeRow>(supabaseAdmin.schema(SCHEMA).from(FEES_VIEW).select(FEE_SELECT).in("offering_id", offeringIds)) : Promise.resolve({ rows: [], errorCode: null }),
      offeringIds.length ? readRows<RequirementRow>(supabaseAdmin.schema(SCHEMA).from(REQUIREMENTS_VIEW).select(REQUIREMENT_SELECT).in("offering_id", offeringIds)) : Promise.resolve({ rows: [], errorCode: null }),
      programmeIds.length ? readRows<EvidenceRow>(supabaseAdmin.schema(SCHEMA).from(EVIDENCE_VIEW).select(EVIDENCE_SELECT).in("scope_id", programmeIds)) : Promise.resolve({ rows: [], errorCode: null }),
    ])
    if (feesResult.errorCode || requirementsResult.errorCode || evidenceResult.errorCode) return [...invalidItems, ...mappings.map((mapping) => unavailableAuNursingProgramCompareItem(mapping.productProgramId, "server_data_error"))]
    const evidenceById = new Map(evidenceResult.rows.map((row) => [row.observation_id, row]))
    const items = mappings.map((mapping) => {
      const catalog = selectedCatalog.find((row) => row.programme_id === mapping.canonicalProgrammeId && row.offering_id === mapping.canonicalOfferingId)
      if (!catalog) return unavailableAuNursingProgramCompareItem(mapping.productProgramId, errorForMissing(catalogResult.rows, mapping) ?? "canonical_offering_not_found")
      const fee = selectCurrentTuition(feesResult.rows.filter((row) => row.offering_id === mapping.canonicalOfferingId), evidenceById, asOf)
      const requirement = requirementsResult.rows.find((row) => row.offering_id === mapping.canonicalOfferingId && row.requirement_type === "academic" && row.review_status === "verified") ?? null
      return toAuNursingProgramCompareItem(toInput(mapping, catalog, fee, requirement, evidenceById))
    })
    return [...invalidItems, ...items]
  },
}
