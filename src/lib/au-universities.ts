import 'server-only'

import { unstable_cache } from 'next/cache'
import { supabase } from '@/lib/supabase'

export type AuUniversity = {
  id: string
  institutionId: string
  name: string
  state: string | null
  city: string | null
  websiteUrl: string | null
}

type CollegeRow = {
  id: string
  institution_id: string | null
  name: string | null
  state: string | null
  city: string | null
  website_url: string | null
}

function toUniversity(row: CollegeRow): AuUniversity | null {
  if (!row.institution_id || !row.name) return null
  return {
    id: row.id,
    institutionId: row.institution_id,
    name: row.name,
    state: row.state,
    city: row.city,
    websiteUrl: row.website_url,
  }
}

export const getAuUniversityBySlug = unstable_cache(async (institutionId: string): Promise<AuUniversity | null> => {
  const { data, error } = await supabase
    .from('colleges_au')
    .select('id, institution_id, name, state, city, website_url')
    .eq('institution_id', institutionId)
    .maybeSingle()

  if (error) {
    console.error('[au-universities] university lookup failed:', error)
    return null
  }

  return data ? toUniversity(data as CollegeRow) : null
}, ['au-university-by-slug'], { revalidate: 86400 })

export const getAuUniversityById = unstable_cache(async (id: string): Promise<AuUniversity | null> => {
  const { data, error } = await supabase
    .from('colleges_au')
    .select('id, institution_id, name, state, city, website_url')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('[au-universities] university ID lookup failed:', error)
    return null
  }

  return data ? toUniversity(data as CollegeRow) : null
}, ['au-university-by-id'], { revalidate: 86400 })

export const getAuUniversityCatalog = unstable_cache(async (): Promise<AuUniversity[]> => {
  const { data, error } = await supabase
    .from('colleges_au')
    .select('id, institution_id, name, state, city, website_url')
    .order('name', { ascending: true })

  if (error) {
    console.error('[au-universities] university catalog lookup failed:', error)
    return []
  }

  return (data as CollegeRow[] ?? [])
    .map(toUniversity)
    .filter((university): university is AuUniversity => university !== null)
}, ['au-university-catalog'], { revalidate: 86400 })

export async function getAuUniversitiesByIds(ids: readonly string[]): Promise<Map<string, AuUniversity>> {
  const uniqueIds = [...new Set(ids.filter(Boolean))]
  if (uniqueIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('colleges_au')
    .select('id, institution_id, name, state, city, website_url')
    .in('id', uniqueIds)

  if (error) {
    console.error('[au-universities] university batch lookup failed:', error)
    return new Map()
  }

  return new Map(
    (data as CollegeRow[] ?? [])
      .map(toUniversity)
      .filter((university): university is AuUniversity => university !== null)
      .map((university) => [university.id, university])
  )
}

export const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'] as const

export const AU_AQF_FILTERS = {
  all: { label: 'All study levels', levels: [] },
  vocational: { label: 'Certificate & Diploma', levels: [5, 6] },
  bachelor: { label: 'Bachelor', levels: [7] },
  postgraduate: { label: 'Postgraduate & Master', levels: [8, 9, 10] },
} as const

export type AuAqfFilter = keyof typeof AU_AQF_FILTERS

export function isAuAqfFilter(value: string | undefined): value is AuAqfFilter {
  return !!value && value in AU_AQF_FILTERS
}

export function aqfLabel(level: number | null | undefined): string {
  if (level === 5) return 'Diploma'
  if (level === 6) return 'Advanced Diploma / Associate Degree'
  if (level === 7) return 'Bachelor'
  if (level === 8) return 'Graduate Certificate / Graduate Diploma'
  if (level === 9) return 'Master'
  if (level === 10) return 'Doctoral'
  return 'Study level not specified'
}
