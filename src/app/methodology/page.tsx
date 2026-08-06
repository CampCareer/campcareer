import Link from "next/link"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"
import { DEGREE_YEARS } from "@/lib/degree-years"
import { pageMetadata } from "@/lib/seo"
import { TAX_YEAR } from "@/lib/tax"

export const metadata = pageMetadata({
  title: "Methodology — Comparison Evidence, Costs & Pathways",
  description:
    "How CampCareer reviews evidence, publishes country-career comparisons, calculates financial estimates, and handles missing or non-comparable data.",
  path: "/methodology",
})

const LAST_UPDATED = "6 August 2026"

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
      {children}
    </div>
  )
}

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <JsonLd data={breadcrumbLd([{ name: "Methodology", path: "/methodology" }])} />

      <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
        Methodology
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Last updated: {LAST_UPDATED} · Legacy ROI tax-model reference: {TAX_YEAR}
      </p>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-slate-700">
        This page explains how CampCareer turns evidence into comparisons. Official publications,
        source dates and country-specific coverage are maintained separately in{" "}
        <Link href="/sources" className="font-semibold text-blue-700 hover:underline">
          Sources
        </Link>
        .
      </div>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-600">
        <section id="release-policy">
          <h2 className="font-display text-lg font-semibold text-slate-800">
            Comparison release policy
          </h2>
          <p className="mt-2">
            CampCareer separates exploration from a publishable decision comparison. A destination
            may appear in maps or profiles when useful discovery data exists, but it is not ranked
            until the required career mapping and decision inputs pass review.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>
              <strong>Decision ready</strong> requires an exact occupation crosswalk plus current
              compensation, tax, housing, tuition and work-pathway evidence.
            </li>
            <li>
              <strong>Discovery</strong> means useful information exists, but at least one decision
              input has not passed review.
            </li>
            <li>
              <strong>Review required</strong> means CampCareer has not published enough current
              evidence for the comparison.
            </li>
          </ul>
          <p className="mt-3">
            Missing country data is never replaced with another country&apos;s average. An unsupported
            tax or visa result is shown as unavailable rather than zero.
          </p>
        </section>

        <section id="evidence">
          <h2 className="font-display text-lg font-semibold text-slate-800">
            Evidence records and freshness
          </h2>
          <p className="mt-2">
            Published values retain the publisher, original URL, applicable date, retrieval date,
            review status and methodology or data version. Policy and visa evidence is reviewed when
            rules change. Salary, tuition, housing and education evidence is rechecked according to
            the cadence of the underlying publication.
          </p>
          <p className="mt-2">
            A stale, inaccessible or incomplete record removes the affected result until it is
            reviewed again. This prevents an old value from remaining visible simply because it
            already exists in the database.
          </p>
        </section>

        <section id="financial-definitions">
          <h2 className="font-display text-lg font-semibold text-slate-800">
            Financial definitions
          </h2>
          <Formula>
            Take-home pay = annual gross pay − income tax − mandatory employee contributions
          </Formula>
          <Formula>
            Annual disposable income = take-home pay − 12 × (monthly rent + essential non-housing costs)
          </Formula>
          <Formula>
            First-year cash need = tuition deposit + visa/health costs + 12 months of living costs + travel/setup + contingency
          </Formula>
          <p>
            Money fields remain in their original currency. Currency conversion is a display
            convenience, not a replacement for the local-currency record. The default tax scenario
            is a single filer with no dependants and full-year tax residency. Student housing
            normally assumes a room in shared housing; graduate housing normally assumes a
            one-bedroom home outside the city centre.
          </p>
        </section>

        <section id="work-status">
          <h2 className="font-display text-lg font-semibold text-slate-800">
            Work and immigration status
          </h2>
          <p className="mt-2">
            CampCareer does not publish immigration success percentages. A route is labelled
            eligible, conditionally eligible, not currently eligible or unknown only when the
            relevant occupation rule, post-study period, salary threshold, licensing or language
            requirement, and policy date can be shown beside the result.
          </p>
          <p className="mt-2">
            These labels support planning and comparison. They are not legal or immigration advice
            and do not predict an individual application outcome.
          </p>
        </section>

        <section id="degree-risk">
          <h2 className="font-display text-lg font-semibold text-slate-800">
            Degree Risk score
          </h2>
          <p className="mt-2">
            Degree Risk describes how narrow or expensive a study-to-career path may be for an
            international student. It is built from five layers:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              <strong>Employment outcomes</strong> compare recent graduate employment within each
              country before making cross-country comparisons.
            </li>
            <li>
              <strong>Visa pathway</strong> checks whether common occupations connected to the field
              have a realistic post-study or employer-sponsored route.
            </li>
            <li>
              <strong>Market demand</strong> combines vacancy, hiring and shortage signals. Because
              no single official measure captures current demand, this layer is labelled as an estimate.
            </li>
            <li>
              <strong>AI exposure</strong> estimates how much entry-level work overlaps with tasks
              current AI systems can perform. Exposure describes likely task change, not certain job loss.
            </li>
            <li>
              <strong>ROI</strong> compares international tuition with the earnings and living-cost
              assumptions used for the same country and career stage.
            </li>
          </ol>
          <p className="mt-3">
            A high-risk result does not mean a subject should not be studied. It means the route is
            comparatively expensive, competitive, narrow or dependent on conditions that deserve
            closer review.
          </p>
        </section>

        <section id="roi">
          <h2 className="font-display text-lg font-semibold text-slate-800">ROI score</h2>
          <p className="mt-2">
            The ROI score estimates how much total tuition may be recovered each year after housing
            and essential living costs, weighted by the published graduation rate.
          </p>
          <Formula>ROI = (net salary × graduation rate) ÷ total tuition × 100</Formula>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Net salary</strong> is the selected earnings benchmark minus estimated annual
              rent and essential living costs.
            </li>
            <li>
              <strong>Annual rent</strong> uses the maintained housing scenario for the selected
              country or city.
            </li>
            <li>
              <strong>Total tuition</strong> is annual tuition multiplied by the standard degree
              length:{" "}
              {Object.entries(DEGREE_YEARS)
                .map(([country, years]) => `${country.toUpperCase()} ${years}yr`)
                .join(" · ")}
              . Course-level duration takes precedence where available.
            </li>
          </ul>
          <p className="mt-2">
            <strong>Payback years</strong> equals total tuition divided by net salary and is rounded
            for display.
          </p>
        </section>

        <section id="tax">
          <h2 className="font-display text-lg font-semibold text-slate-800">
            After-tax estimates
          </h2>
          <p className="mt-2">
            The legacy ROI Explorer uses simplified {TAX_YEAR} single-filer rules only where a
            maintained country model exists. Credits, deductions, household circumstances, local
            taxes and professional advice are not modelled. Countries without a maintained model
            show tax and take-home results as unavailable.
          </p>
        </section>

        <section id="normalisation">
          <h2 className="font-display text-lg font-semibold text-slate-800">
            Career-stage normalisation
          </h2>
          <p className="mt-2">
            Country datasets can measure earnings at different points after graduation. When a
            comparison offers a career-stage adjustment, CampCareer rescales earnings toward a
            common stage using maintained longitudinal evidence. Housing and living-cost assumptions
            remain fixed unless the selected scenario changes.
          </p>
          <p className="mt-2">
            Medicine and other regulated professions may require a role-stage override when one
            country reports trainees and another reports fully qualified professionals. Any override
            is labelled with the represented career stage and is not treated as an immediate
            graduate salary.
          </p>
        </section>

        <section id="limitations">
          <h2 className="font-display text-lg font-semibold text-slate-800">
            Known limitations
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              Official graduate statistics often combine domestic and international students, while
              international students face additional visa and licensing constraints.
            </li>
            <li>
              National and field medians hide city, institution, experience and person-level variation.
            </li>
            <li>
              Tuition may be a list price or a net price depending on the source; scholarships are
              not assumed unless a scenario explicitly includes them.
            </li>
            <li>
              Cross-country scores reflect different currencies, tax systems, price levels and data
              definitions. Compare patterns and assumptions, not decimal points alone.
            </li>
            <li>
              Market demand and AI exposure remain estimates because neither has one complete,
              universally comparable official statistic.
            </li>
          </ul>
          <p className="mt-3">
            Found an error or have a stronger source?{" "}
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">
              contact@campcareer.com
            </a>
          </p>
        </section>
      </div>

      <div className="mt-12 flex items-center gap-4 border-t border-slate-200 pt-6 text-sm">
        <Link href="/sources" className="text-blue-600 hover:underline">
          Sources
        </Link>
        <Link href="/roi-explorer" className="text-blue-600 hover:underline">
          ROI Explorer
        </Link>
      </div>
    </main>
  )
}
