import { NextRequest, NextResponse } from "next/server"
import {
  defaultDecisionCareer,
  parseComparisonScenario,
  resolvePublicCareer,
  resolveLaunchCountries,
  type PublicComparisonResponse,
} from "@/lib/comparison/public-contract"

export const dynamic = "force-dynamic"

const ISO_CURRENCY = /^[A-Z]{3}$/

/**
 * Public comparison contract. It deliberately returns unavailable outcomes
 * instead of making a broad major estimate look like a career-specific result.
 * Published source rows can be added behind this contract without changing
 * links, clients, or saved comparison URLs.
 */
export function GET(request: NextRequest) {
  const requestedCareer = request.nextUrl.searchParams.get("career")
  const requestedMajor = request.nextUrl.searchParams.get("major")
  const resolvedCareer = resolvePublicCareer(
    requestedCareer,
    requestedMajor,
  )
  if ((requestedCareer || requestedMajor) && !resolvedCareer) {
    return NextResponse.json({ error: "Unknown canonical career or major" }, { status: 422 })
  }
  const career = resolvedCareer ?? defaultDecisionCareer()
  const requestedCountries = (request.nextUrl.searchParams.get("countries") ?? "AU,CA,US,UK")
    .split(",")
  const countries = resolveLaunchCountries(requestedCountries)
  const displayCurrency = (request.nextUrl.searchParams.get("currency") ?? "USD").toUpperCase()

  if (requestedCountries.length > 4) {
    return NextResponse.json({ error: "Compare up to four countries at a time." }, { status: 422 })
  }
  if (!ISO_CURRENCY.test(displayCurrency)) {
    return NextResponse.json({ error: "currency must be an ISO 4217 code" }, { status: 422 })
  }
  if (countries.length === 0) {
    return NextResponse.json({ error: "Select at least one supported destination." }, { status: 422 })
  }

  const response: PublicComparisonResponse = {
    data: {
      career: {
        id: career.id,
        label: career.label,
        labelKo: career.labelKo,
        categoryId: career.categoryId,
      },
      ...(request.nextUrl.searchParams.get("origin") ? { origin: request.nextUrl.searchParams.get("origin")!.toUpperCase() } : {}),
      ...(request.nextUrl.searchParams.get("city") ? { city: request.nextUrl.searchParams.get("city")!.slice(0, 100) } : {}),
      displayCurrency,
      scenario: parseComparisonScenario({
        degreeYears: request.nextUrl.searchParams.get("degreeYears"),
        annualTuition: request.nextUrl.searchParams.get("annualTuition"),
        currency: displayCurrency,
        studentHousing: request.nextUrl.searchParams.get("studentHousing"),
        graduateHousing: request.nextUrl.searchParams.get("graduateHousing"),
      }),
      ...((request.nextUrl.searchParams.get("budget") || request.nextUrl.searchParams.get("goal")) ? {
        intent: {
          ...(["under-30000", "30000-50000", "50000-75000", "75000-100000", "100000-plus"].includes(request.nextUrl.searchParams.get("budget") ?? "") ? { budgetBand: request.nextUrl.searchParams.get("budget") as NonNullable<PublicComparisonResponse["data"]["intent"]>["budgetBand"] } : {}),
          ...(["career-outcomes", "lower-first-year-cost", "work-and-immigration"].includes(request.nextUrl.searchParams.get("goal") ?? "") ? { goal: request.nextUrl.searchParams.get("goal") as NonNullable<PublicComparisonResponse["data"]["intent"]>["goal"] } : {}),
        },
      } : {}),
      comparisons: countries.map((country) => ({
        country: {
          code: country.code,
          slug: country.slug,
          name: country.name,
          currency: country.currency,
          mapReady: country.mapReady,
        },
        readiness: country.mapReady ? "discovery" : "review_required",
        financial: {
          status: "unavailable",
          assumptions: [
            "Single filer, no dependants, full-year tax resident is the default comparison scenario.",
            "Student housing uses shared housing; graduate housing uses a one-bedroom outside the city centre.",
          ],
          reason: "An exact, current occupation mapping plus salary, tax, housing, tuition, and pathway evidence has not been published for this career-country pair.",
        },
        immigration: {
          status: "unknown",
          occupationMatch: "unavailable",
          reason: "CampCareer does not turn incomplete occupation or visa evidence into a success percentage.",
        },
        evidence: [],
      })),
    },
    evidence: [],
    readiness: "review_required",
    dataVersion: "career-publication-pending",
    methodologyVersion: "comparison-v1",
    generatedAt: new Date().toISOString(),
  }

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
