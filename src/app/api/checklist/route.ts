import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { withStableIds } from '@/lib/checklist-id'
import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { toProductCountryCode } from '@/lib/data-foundation/entity-aliases'

const VISA_PROMPTS: Record<string, string> = {
  'student':        'student visa / study permit',
  'graduate-work':  'post-study work visa (graduate route)',
  'skilled-worker': 'skilled worker visa',
}

export async function POST(req: NextRequest) {
  if (!FEATURE_FLAGS.aiGeneration) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (Number(req.headers.get('content-length') ?? 0) > 8_192) {
    return NextResponse.json({ error: 'Request is too large' }, { status: 413 })
  }
  const { country: rawCountry, visa_type } = await req.json()
 
  if (!rawCountry || !visa_type) {
    return NextResponse.json({ error: 'Missing country or visa_type' }, { status: 400 })
  }
 
  const country = toProductCountryCode(rawCountry)
  if (!country) {
    return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
  }
 
  // 1. 캐시 확인
  const { data: cachedRows } = await supabaseAdmin
    .from('checklist_cache')
    .select('items')
    .eq('country', country)
    .eq('visa_type', visa_type)
    .limit(1)
 
  const cached = (cachedRows ?? [])[0] as { items: unknown } | null

  if (cached) {
    return NextResponse.json({ items: withStableIds(cached.items), cached: true })
  }
 
  // 2. Claude API 호출
  const countryName: Record<string, string> = {
    AU: 'Australia', IE: 'Ireland', GB: 'United Kingdom', US: 'United States'
  }

  const prompt = `You are an immigration and study abroad expert. Generate a comprehensive visa application checklist for an international student applying for a ${VISA_PROMPTS[visa_type] ?? visa_type} in ${countryName[country] ?? country}.

Return ONLY a JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "category": "Category Name",
    "task": "Specific task description",
    "required": true,
    "note": "Optional short tip or note"
  }
]

Categories to cover:
- Academic Documents
- Financial Documents
- Identity & Personal Documents
- Visa Application
- Health & Insurance
- Pre-Departure

Include 20-25 items total. Be specific to ${countryName[country] ?? country} requirements. required=false for optional items.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Claude API error' }, { status: 500 })
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  let items
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    items = JSON.parse(clean)
  } catch {
    return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
  }

  // Claude가 준 id를 무시하고 결정적 id로 정규화
  const stableItems = withStableIds(items)

  // 3. 캐시 저장 (저장 데이터와 리턴 데이터를 동일하게)
  await supabaseAdmin
    .from('checklist_cache')
    .upsert({ country, visa_type, items: stableItems })

  return NextResponse.json({ items: stableItems, cached: false })
}
