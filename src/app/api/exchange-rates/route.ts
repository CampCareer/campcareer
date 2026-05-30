import { NextResponse } from 'next/server'

// Proxy for Frankfurter exchange rates — avoids CORS issues with direct browser fetch.
// api.frankfurter.app now redirects to api.frankfurter.dev which lacks CORS headers.
export async function GET() {
  const res = await fetch(
    'https://api.frankfurter.dev/v1/latest?from=USD&to=AUD,CAD,GBP,EUR',
    { next: { revalidate: 3600 } }, // cache for 1 hour at the edge
  )
  if (!res.ok) {
    return NextResponse.json({ error: `Upstream error: ${res.status}` }, { status: 502 })
  }
  const data = await res.json()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600' },
  })
}
