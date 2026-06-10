// PostgREST .or() filter strings use `,` `(` `)` as syntax — user input containing
// them can break the filter or inject extra conditions. Strip before interpolating.
export function sanitizeFilterTerm(term: string): string {
  return term.replace(/[,()]/g, ' ').trim()
}

/** Builds a PostgREST .or() filter of ilike conditions from raw search terms. */
export function buildIlikeOrFilter(column: string, terms: string[]): string {
  return terms
    .map(sanitizeFilterTerm)
    .filter(Boolean)
    .map(t => `${column}.ilike.%${t}%`)
    .join(',')
}
