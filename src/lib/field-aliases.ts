// Maps common user-facing field labels to the search terms that exist in the DB.
// All keys and values must be lowercase; the helper normalizes input before lookup.
const FIELD_ALIASES: Record<string, string[]> = {
  'data science': [
    'data science',
    'data analytics',
    'analytics',
    'artificial intelligence',
    'computer science',
    'computer and information',
    'information technology',
    'statistics',
    'information systems',
    'data',
  ],
  'artificial intelligence': [
    'artificial intelligence',
    'computer science',
    'computer and information',
    'data science',
    'data analytics',
    'machine learning',
  ],
  'computer science': [
    'computer science',
    'computer and information',
    'software',
    'information technology',
    'computing',
  ],
  'software engineering': [
    'software engineering',
    'software',
    'computer science',
    'computer and information',
    'information technology',
  ],
  'information technology': [
    'information technology',
    'computer and information',
    'computer science',
    'information systems',
    'computing',
  ],
  'business': [
    'business',
    'management',
    'marketing',
    'finance',
    'accounting',
    'business administration',
    'commerce',
  ],
  'finance': [
    'finance',
    'financial',
    'accounting',
    'business',
    'economics',
  ],
  'accounting': [
    'accounting',
    'finance',
    'financial',
    'business',
  ],
  'marketing': [
    'marketing',
    'business',
    'communication',
    'media',
    'advertising',
  ],
  'economics': [
    'economics',
    'business',
    'finance',
    'social science',
  ],
  'mechanical engineering': [
    'mechanical engineering',
    'engineering',
    'mechanical',
    'manufacturing',
    'automotive',
  ],
  'electrical engineering': [
    'electrical engineering',
    'engineering',
    'electrical',
    'electronics',
    'computer engineering',
  ],
  'chemical engineering': [
    'chemical engineering',
    'engineering',
    'chemical',
    'process engineering',
    'materials',
  ],
  'engineering': [
    'engineering',
    'mechanical engineering',
    'electrical engineering',
    'civil engineering',
    'computer engineering',
    'chemical engineering',
  ],
  'nursing': [
    'nursing',
    'registered nursing',
    'health professions',
  ],
  'medicine': [
    'medicine',
    'medical',
    'clinical',
    'health professions',
  ],
  'law': [
    'law',
    'legal',
    'legal studies',
    'jurisprudence',
  ],
  'psychology': [
    'psychology',
    'counseling',
    'behavioral',
    'mental health',
  ],
  'biology': [
    'biology',
    'biochemistry',
    'molecular biology',
    'biomedical',
    'biological sciences',
  ],
  'pharmacy': [
    'pharmacy',
    'pharmacology',
    'pharmaceutical',
  ],
  'mathematics': [
    'mathematics',
    'data science',
    'analytics',
    'statistics',
    'applied mathematics',
    'actuarial',
  ],
  'communications': [
    'communications',
    'communication',
    'media',
    'journalism',
    'public relations',
    'broadcasting',
  ],
  'political science': [
    'political science',
    'politics',
    'government',
    'public policy',
    'international relations',
    'diplomacy',
  ],
  'education': [
    'education',
    'teaching',
    'teacher education',
  ],
  'architecture': [
    'architecture',
    'design',
    'urban planning',
  ],
}

function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\.$/, '')
    .replace(/\s+/g, ' ')
}

/**
 * Returns ordered search terms for a user-facing field label.
 * The original (normalized) input is always first; alias terms follow.
 * If no alias exists, only the original term is returned.
 */
export function getFieldSearchTerms(input: string): string[] {
  const normalized = normalizeInput(input)

  // Direct key match
  if (FIELD_ALIASES[normalized]) {
    return FIELD_ALIASES[normalized]
  }

  // Partial match: key contained in input or input contained in key
  for (const [key, terms] of Object.entries(FIELD_ALIASES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return [normalized, ...terms.filter(t => t !== normalized)]
    }
  }

  // No alias — return the original term as-is
  return [normalized]
}

const PROFESSIONAL_FIELDS = [
  'medicine',
  'medical',
  'law',
  'legal',
  'nursing',
  'pharmacy',
  'dentistry',
  'veterinary',
]

export function isProfessionalField(field: string): boolean {
  const f = normalizeInput(field)
  return PROFESSIONAL_FIELDS.some((term) => f.includes(term))
}
