import { VISA_CATALOG, type VisaEntry } from "./visa-catalog"
import { applyBatch1VisaCatalog } from "./visa-catalog-batch-1"
import { applyBatch2VisaCatalog } from "./visa-catalog-batch-2"
import { applyNewZealandVisaCatalog } from "./visa-catalog-new-zealand"
import { applySwitzerlandVisaCatalog } from "./visa-catalog-switzerland"
import { applyUaeVisaCatalog } from "./visa-catalog-uae"

/**
 * Applies the completed country catalogue replacements in the same order used
 * by the runtime loader. Keep this module free of server-only dependencies so
 * sitemap generation and URL tests can consume the exact fallback catalogue.
 */
export function applyCompletedVisaCatalog(
  base: readonly VisaEntry[],
): readonly VisaEntry[] {
  return applyUaeVisaCatalog(
    applySwitzerlandVisaCatalog(
      applyBatch2VisaCatalog(
        applyNewZealandVisaCatalog(applyBatch1VisaCatalog(base)),
      ),
    ),
  )
}

export function getCompletedVisaCatalog(): readonly VisaEntry[] {
  return applyCompletedVisaCatalog(VISA_CATALOG)
}
