import { NextRequest, NextResponse } from 'next/server'
import { FEATURE_FLAGS } from '@/lib/feature-flags'

export async function POST(req: NextRequest) {
  if (!FEATURE_FLAGS.aiGeneration) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (Number(req.headers.get('content-length') ?? 0) > 16_384) {
    return NextResponse.json({ error: 'Request is too large' }, { status: 413 })
  }
  const { country, field, currentStatus, experience, goalText, goal, english } = await req.json()
  if (!country || !field || !currentStatus) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const STATUS_LABEL: Record<string, string> = {
    student: 'currently a student',
    fresh_grad: 'a recent graduate (0–1 year)',
    professional: `a working professional (${experience ?? '1-3'} years experience)`,
    career_changer: 'looking to change careers',
  }
  const GOAL_LABEL: Record<string, string> = {
    visa: 'get a work visa and build a career abroad',
    pr: 'achieve permanent residency',
    study: 'pursue academic excellence and strong ROI',
  }
  const COUNTRY_NAME: Record<string, string> = {
    ie: 'Ireland', au: 'Australia', ca: 'Canada', uk: 'United Kingdom', us: 'United States',
    IE: 'Ireland', AU: 'Australia', CA: 'Canada', UK: 'United Kingdom', US: 'United States',
  }

  const systemPrompt = `You are a career path advisor specializing in international study and work migration.
Generate a realistic, planning-focused career roadmap as JSON only. No markdown, no text outside JSON.

Important: Use hedged language throughout — "typically", "may", "often", "generally", "check official sources".
Visa rules, salary thresholds, and PR pathways change frequently. Do not state visa requirements as fixed facts.
Always include at least one key_consideration reminding the user to verify immigration rules with the official government body.

Return exactly this schema:
{
  "title": "short title e.g. Nursing → PR in Australia",
  "summary": "2-3 sentence planning overview using hedged language",
  "total_duration": "e.g. 4-6 years (estimate)",
  "stages": [
    {
      "id": "s1",
      "title": "Stage title",
      "duration": "e.g. 0-6 months",
      "phase": "Education | Entry | Growth | Senior | PR/Visa",
      "color": "indigo | violet | blue | emerald | amber | rose",
      "description": "what typically happens in this stage",
      "actions": ["specific action 1 — verify requirements with official sources", "action 2", "action 3"],
      "visa": "visa type that may apply at this stage — verify eligibility with the official immigration authority",
      "milestone": "key achievement that typically marks stage completion",
      "salary_range": "estimated salary range based on available data, else null",
      "tips": "practical planning tip"
    }
  ],
  "key_considerations": [
    "Visa rules, salary thresholds, and PR pathways change frequently — always verify with the official immigration authority before making decisions.",
    "note 2",
    "note 3"
  ],
  "pr_pathway": "concise PR/long-term visa pathway overview using hedged language — verify current requirements with official sources, or null if not applicable"
}`

  const userPrompt = `Generate a career roadmap for:
- Country: ${COUNTRY_NAME[country] ?? country}
- Field of study: ${field}
- Current situation: ${STATUS_LABEL[currentStatus] ?? currentStatus}
- Primary goal: ${GOAL_LABEL[goal ?? 'visa']}
- English level: ${english ?? 'intermediate'}
${goalText ? `- Additional context: ${goalText}` : ''}

Create 4-6 concrete stages with realistic timelines. Use hedged language ("typically", "may", "often").
Where relevant, mention the official registration or immigration body (e.g. IRCC for Canada, Home Office for UK, Department of Home Affairs for Australia, ISD for Ireland, USCIS for the US).
Always include a key_consideration reminding the user that visa rules change and to verify with official government immigration sources.`

  try {
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
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })
    const data = await response.json()
    const text = data.content?.map((b: { type: string; text?: string }) => b.type === 'text' ? b.text : '').join('') ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const roadmap = JSON.parse(clean)
    return NextResponse.json({ roadmap })
  } catch (err) {
    console.error('Career path generation error:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
