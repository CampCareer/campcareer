import { NextResponse } from "next/server"

export function POST() {
  return NextResponse.json(
    { error: "This analytics endpoint has been retired." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  )
}
