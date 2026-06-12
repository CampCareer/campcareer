import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { TAX_YEAR } from "@/lib/tax"
import { DEGREE_YEARS } from "@/lib/degree-years"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"

export const metadata = pageMetadata({
  title: "Methodology — Degree Risk Score & ROI Calculations",
  description: "Full methodology behind CampCareer's Degree Risk score and ROI scores: the five risk layers, formulas, data sources (QILT, HEA, College Scorecard, HESA, CRICOS), and known limitations.",
  path: "/methodology",
})

const LAST_UPDATED = "12 June 2026"

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 font-mono text-sm text-slate-700 my-3 overflow-x-auto">
      {children}
    </div>
  )
}

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <JsonLd data={breadcrumbLd([{ name: "Methodology", path: "/methodology" }])} />

      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Methodology</h1>
      <p className="text-sm text-slate-400 mb-10">
        Last updated: {LAST_UPDATED} · Tax rules: {TAX_YEAR}
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-slate-600">

        <section id="degree-risk">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Degree Risk score</h2>
          <p>
            The Degree Risk score answers one question in plain terms: <em>if you study this
            major in this country as an international student, how likely is it to lead to a
            job — and at what cost?</em> Each major gets an overall rating of low, medium, or
            high risk, built from five layers. None of the layers says &quot;don&apos;t study
            X&quot; — a high-risk rating means the path is expensive or narrow, and we try to
            show exactly where, and under which conditions it still works.
          </p>

          <h3 className="text-base font-semibold text-slate-700 mt-5 mb-1.5">1 · Employment outcomes</h3>
          <p>
            What share of recent graduates in this field are in full-time work shortly after
            graduating. For Australia we use the{" "}
            <a href="https://www.qilt.edu.au/surveys/graduate-outcomes-survey-(gos)" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
              QILT Graduate Outcomes Survey
            </a>{" "}
            (full-time employment rate by study area, ~4–6 months after graduation). For Ireland
            we use the{" "}
            <a href="https://hea.ie/statistics/graduate-outcomes-data-and-reports/" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
              HEA Graduate Outcomes Survey
            </a>{" "}
            (share of honours-bachelor graduates in employment nine months after graduation, by
            field). The two surveys measure slightly different things at slightly different
            timepoints — compare within a country first, across countries second.
          </p>

          <h3 className="text-base font-semibold text-slate-700 mt-5 mb-1.5">2 · Visa pathway</h3>
          <p>
            A degree only converts into a career abroad if there is a legal route from
            graduation to skilled work. For Australia we check whether the typical occupations
            for the major appear on the{" "}
            <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Core Skills Occupation List
            </a>{" "}
            and how many years the Temporary Graduate (subclass 485) visa allows after the
            degree. For Ireland we check the{" "}
            <a href="https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Critical Skills Occupations List
            </a>{" "}
            and the Stamp 1G graduate permission. An occupation-list match materially changes
            how realistic the employer-sponsorship and PR routes are.
          </p>

          <h3 className="text-base font-semibold text-slate-700 mt-5 mb-1.5">3 · Market demand</h3>
          <p>
            A 0–100 score for how actively the local market is hiring in the field right now:
            vacancy trends, graduate-program intake, and government skills-shortage signals.
            This is the most judgement-heavy layer and the one we update most often.
          </p>

          <h3 className="text-base font-semibold text-slate-700 mt-5 mb-1.5">4 · AI exposure</h3>
          <p>
            How much of the entry-level work in this field overlaps with what current AI systems
            already do well. We band each major (lower / moderate / higher exposure) based on
            published occupational AI-exposure research — OECD employment-outlook analyses and
            Felten-style occupational exposure indices — applied to the occupations graduates of
            the major actually enter. Important nuance: high exposure does not mean the job
            disappears; it usually means the junior layer of the job changes first, which
            matters most for fresh graduates.
          </p>

          <h3 className="text-base font-semibold text-slate-700 mt-5 mb-1.5">5 · ROI</h3>
          <p>
            What the degree costs an international student (full international tuition for the
            standard course length) against the median starting salary graduates actually earn,
            summarised as payback years. The mechanics are the same as the ROI score described
            below.
          </p>

          <h3 className="text-base font-semibold text-slate-700 mt-5 mb-1.5">Limitations — read this part</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Official statistics rarely separate international students.</strong> QILT
              and HEA outcomes are dominated by domestic graduates, who don&apos;t face visa
              constraints. Our visa-pathway layer is the correction we apply for that — it is
              our judgement, not an official statistic.
            </li>
            <li>
              <strong>&quot;Estimate&quot; means estimate.</strong> Scores marked{" "}
              <em>estimate</em> have not yet been fully verified against the latest QILT / HEA
              releases and occupation-list updates. Verified rows are marked accordingly, and
              every major shows a last-verified date.
            </li>
            <li>
              <strong>Field-level data hides person-level variance.</strong> A major&apos;s
              employment rate is a cohort median, not your probability.
            </li>
            <li>
              We currently score <strong>Australia and Ireland</strong> only; other countries
              are shown by comparison to these two.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">ROI score</h2>
          <p>
            The ROI score answers one question: <em>how much of your total tuition do you earn
            back each year, after housing and living costs, weighted by your chance of actually
            graduating?</em>
          </p>
          <Formula>
            ROI = (net salary × graduation rate) ÷ total tuition × 100
          </Formula>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Net salary</strong> = median graduate earnings − estimated annual rent −
              estimated living costs, computed for the city where the institution is located.
            </li>
            <li>
              <strong>Annual rent</strong> = city market median rent × 0.45 (shared / student
              accommodation factor) × 12 months. Market rent represents a full private unit;
              students and recent graduates typically share.
            </li>
            <li>
              <strong>Living costs</strong> = annual rent × 0.4 (utilities, food, transport
              approximation).
            </li>
            <li>
              <strong>Total tuition</strong> = annual tuition × standard degree length:{" "}
              {Object.entries(DEGREE_YEARS).map(([c, y]) => `${c.toUpperCase()} ${y}yr`).join(" · ")}.
              Where course-level duration data exists (some Irish courses), it takes precedence.
            </li>
          </ul>
          <p className="mt-2">
            <strong>Payback years</strong> = total tuition ÷ net salary, rounded to whole years.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">After-tax estimates</h2>
          <p>
            The after-tax toggle applies {TAX_YEAR} national tax rules as simplified single-filer
            models: US federal brackets + flat state-rate approximations + FICA; UK income tax +
            National Insurance; Irish income tax + USC + PRSI; Australian brackets + Medicare
            levy; Canadian federal brackets + flat provincial approximations + CPP/EI. These are
            estimates — marginal relief, credits beyond the basics, and local taxes are not
            modelled.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Medicine override</h2>
          <p>
            Stored earnings for medical degrees use inconsistent career timepoints across
            countries (residents vs consultants), which makes raw comparison misleading. When you
            search for medicine, we replace stored earnings with first-year
            attending/consultant salary estimates: US $280k (MGMA/AAMC), Ireland €120k (HSE
            Consultant Type B), UK £100k (NHS Consultant), Canada C$280k (CIHI), Australia A$300k
            (AMA) — all {TAX_YEAR} figures. ROI and payback are recomputed from these salaries.
            Note this represents the post-residency stage, typically 5–10 years after graduation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Career stage adjustment</h2>
          <p>
            Source datasets measure earnings at different points: US College Scorecard ~6 years
            after entry, UK LEO and Irish CSO ~1 year, Canada ~2 years, Australia ~3 years after
            graduation. The career-stage toggle rescales earnings to a common target year using
            multipliers derived from longitudinal data (HMRC LEO, StatCan Job Bank, QILT GOS-L,
            CSO Revenue, College Scorecard). Rent and living costs are held fixed across stages,
            so net salary moves by the earnings delta.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Data sources</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>United States</strong> — College Scorecard (U.S. Dept. of Education): earnings, tuition, graduation rates.</li>
            <li><strong>Ireland</strong> — HEA Graduate Outcomes Survey, Qualifax course data, CSO earnings. Field-level earnings are national averages by field; college-specific earnings are not published in Ireland.</li>
            <li><strong>United Kingdom</strong> — HESA / Discover Uni graduate outcomes.</li>
            <li><strong>Australia</strong> — CRICOS registered course data, QILT graduate outcomes.</li>
            <li><strong>Canada</strong> — provincial open datasets and StatCan earnings.</li>
            <li><strong>Rent & living costs</strong> — city-level market rent medians, updated periodically.</li>
            <li><strong>Exchange rates</strong> — frankfurter.app (ECB reference rates), fetched live on the compare page.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Known limitations</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Cross-country score comparison</strong>: ROI scores are computed in each
              country&apos;s local currency and tax system. A US score of 38 vs an Irish score of
              12 reflects different price levels and salary structures, not just &quot;better
              value&quot; — compare patterns, not decimal points.
            </li>
            <li>Tuition figures are international-student list prices or net prices depending on source; scholarships are not modelled.</li>
            <li>Earnings medians hide field- and person-level variance; visa work restrictions are not priced in.</li>
            <li>Rent factors (0.45 share, 0.4 living-cost multiplier) are simplifying assumptions applied uniformly across countries.</li>
          </ul>
          <p className="mt-2">
            Found an error or have better source data?{" "}
            <a href="mailto:data@campcareer.com" className="text-indigo-600 hover:underline">data@campcareer.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200 text-sm flex items-center gap-4">
        <Link href="/roi-explorer" className="text-indigo-600 hover:underline">ROI Explorer</Link>
        <Link href="/compare" className="text-indigo-600 hover:underline">Country Compare</Link>
      </div>
    </div>
  )
}
