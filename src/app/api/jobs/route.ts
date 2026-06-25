import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country") ?? "au"
  const what = req.nextUrl.searchParams.get("what") ?? ""
  const where = req.nextUrl.searchParams.get("where") ?? ""
  if (!what) return NextResponse.json({ jobs: [] })

  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) {
    return NextResponse.json({ error: "Adzuna not configured" }, { status: 500 })
  }

  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`)
  url.searchParams.set("app_id", appId)
  url.searchParams.set("app_key", appKey)
  url.searchParams.set("what", what)
  url.searchParams.set("results_per_page", "5")
  url.searchParams.set("content-type", "application/json")
  if (where) url.searchParams.set("where", where)

  try {
    const res = await fetch(url.toString())
    if (!res.ok) {
      return NextResponse.json({ error: `Adzuna returned ${res.status}` }, { status: res.status })
    }
    const body = await res.json()
    const jobs = (body.results ?? []).map((r: Record<string, unknown>) => ({
      id: r.id,
      title: r.title,
      company: (r.company as Record<string, string>)?.display_name ?? "",
      location: (r.location as Record<string, string>)?.display_name ?? "",
      salary_min: r.salary_min ?? null,
      salary_max: r.salary_max ?? null,
      currency: r.salary_currency ?? "",
      url: r.redirect_url ?? "",
      created: r.created ?? "",
    }))
    return NextResponse.json({ jobs, count: body.count ?? 0 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
