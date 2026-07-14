import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { TAX_YEAR } from "@/lib/tax"
import { DEGREE_YEARS } from "@/lib/degree-years"
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld"

export const metadata = pageMetadata({
  title: "Methodology — Comparison Evidence, Costs & Pathways",
  description: "How CampCareer publishes career-country comparisons, handles missing evidence, calculates after-tax disposable income, and distinguishes exploration from decision-ready results.",
  path: "/methodology",
})

const LAST_UPDATED = "14 July 2026"

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

      <h1 className="font-display text-3xl font-semibold text-slate-900 tracking-tight mb-2">Methodology</h1>
      <p className="text-sm text-slate-400 mb-10">
        Last updated: {LAST_UPDATED} · Legacy ROI tax-model reference: {TAX_YEAR}
      </p>

      <div className="space-y-10 text-sm leading-relaxed text-slate-600">

        <section id="career-comparison">
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">Career-country comparison release policy</h2>
          <p>
            CampCareer separates <strong>exploration</strong> from a publishable decision comparison.
            All 20 launch destinations may appear in Maps when a geography or institution dataset is
            available. A destination is not ranked, and no financial result is shown, until the exact
            career-to-official-occupation mapping and all required source rows have passed review.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Decision ready</strong> requires an exact occupation crosswalk plus current compensation, tax, housing, tuition, and work-pathway evidence.</li>
            <li><strong>Discovery</strong> means useful map or profile data exists, but at least one decision input has not passed review.</li>
            <li><strong>Review required</strong> means CampCareer has not published enough current evidence for the comparison.</li>
          </ul>
          <p className="mt-2">
            We never fill a missing country with another country&apos;s average, treat a broad major score as an exact occupation result, or show an unsupported tax model as zero.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">Financial definitions</h3>
          <Formula>Take-home pay = annual gross pay − income tax − mandatory employee contributions</Formula>
          <Formula>Annual disposable income = take-home pay − 12 × (monthly rent + essential non-housing costs)</Formula>
          <Formula>First-year cash need = tuition deposit + visa/health costs + 12 months of living costs + travel/setup + contingency</Formula>
          <p>
            Every money field retains its original currency and source date. Conversion, where shown,
            is a display convenience rather than a replacement for the local-currency source. The default
            tax scenario is a single filer with no dependants and full-year tax residency. Student housing
            defaults to shared housing; graduate housing defaults to a one-bedroom outside the city centre.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">Work and immigration status</h3>
          <p>
            CampCareer does not publish an immigration success percentage. We use <strong>eligible</strong>,
            <strong> conditionally eligible</strong>, <strong>not currently eligible</strong>, or <strong>unknown</strong>
            only when the relevant occupation list, post-study work period, salary threshold, licensing or
            language requirement, and policy date can be shown beside the result. This is planning information,
            not legal or immigration advice.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">Evidence record and freshness</h3>
          <p>
            Published cells carry the publisher, original URL, applicable date, retrieval date, review status,
            and methodology/data version. Policy and visa sources are reviewed on change alerts; salary, tuition,
            and housing sources are rechecked on their stated source cadence. A stale or incomplete field removes
            the financial result until it is reviewed again.
          </p>
        </section>

        <section id="degree-risk">
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">Degree Risk score</h2>
          <p>
            The Degree Risk score answers one question in plain terms: <em>if you study this
            major in this country as an international student, how likely is it to lead to a
            job — and at what cost?</em> Each major gets an overall rating of low, medium, or
            high risk, built from five layers. None of the layers says &quot;don&apos;t study
            X&quot; — a high-risk rating means the path is expensive or narrow, and we try to
            show exactly where, and under which conditions it still works.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">1 · Employment outcomes</h3>
          <p>
            What share of recent graduates in this field are in full-time work shortly after
            graduating, by country:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <strong>United States</strong> —{" "}
              <a href="https://collegescorecard.ed.gov/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">College Scorecard</a>{" "}
              earnings/outcomes and the{" "}
              <a href="https://www.bls.gov/ooh/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">BLS Occupational Outlook Handbook</a>.
            </li>
            <li>
              <strong>Canada</strong> —{" "}
              <a href="https://www.statcan.gc.ca/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Statistics Canada</a>{" "}
              graduate employment and{" "}
              <a href="https://www.jobbank.gc.ca/trend-analysis" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Job Bank</a> outlooks.
            </li>
            <li>
              <strong>United Kingdom</strong> —{" "}
              <a href="https://www.hesa.ac.uk/data-and-analysis/graduates" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">HESA Graduate Outcomes Survey</a>.
            </li>
            <li>
              <strong>Australia</strong> —{" "}
              <a href="https://www.qilt.edu.au/surveys/graduate-outcomes-survey-(gos)" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">QILT Graduate Outcomes Survey</a>{" "}
              (~4–6 months after graduation).
            </li>
            <li>
              <strong>Ireland</strong> —{" "}
              <a href="https://hea.ie/statistics/graduate-outcomes-data-and-reports/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">HEA Graduate Outcomes Survey</a>{" "}
              (nine months after graduation).
            </li>
          </ul>
          <p className="mt-2">
            These surveys measure slightly different things at slightly different timepoints —
            compare within a country first, across countries second.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">2 · Visa pathway</h3>
          <p>
            A degree only converts into a career abroad if there is a legal route from
            graduation to skilled work. We check, per country, whether the major&apos;s typical
            occupations sit on a recognised list and how long the post-study work window runs:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <strong>United States</strong> — STEM-OPT-eligible field (12-month OPT + 24-month
              STEM extension = 3 years) vs OPT-only (1 year), with{" "}
              <a href="https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">USCIS STEM-OPT</a>{" "}
              and the H-1B as the longer-term (lottery-gated) route.
            </li>
            <li>
              <strong>Canada</strong> — the{" "}
              <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Post-Graduation Work Permit</a>{" "}
              (up to 3 years) plus whether the field is covered by an Express Entry
              category-based draw (STEM / healthcare).
            </li>
            <li>
              <strong>United Kingdom</strong> — the{" "}
              <a href="https://www.gov.uk/graduate-visa" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Graduate Route</a>{" "}
              (2 years; shortening to 18 months from 2027) and Skilled Worker / Immigration
              Salary List eligibility.
            </li>
            <li>
              <strong>Australia</strong> — the{" "}
              <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Core Skills Occupation List</a>{" "}
              and Temporary Graduate (subclass 485) visa.
            </li>
            <li>
              <strong>Ireland</strong> — the{" "}
              <a href="https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Critical Skills Occupations List</a>{" "}
              and the Stamp 1G graduate permission.
            </li>
          </ul>
          <p className="mt-2">
            An occupation-list match materially changes how realistic the employer-sponsorship
            and PR routes are.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">3 · Market demand</h3>
          <p>
            A 0–100 score for how actively the local market is hiring in the field right now:
            vacancy trends, graduate-program intake, and government skills-shortage signals.
            No single official statistic captures this, so we synthesise it from several
            signals and carry it as an <em>estimate</em> by design — it is the most
            judgement-heavy layer and the one we update most often.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">4 · AI exposure</h3>
          <p>
            How much of the entry-level work in this field overlaps with what current AI systems
            already do well. We band each major (lower / moderate / higher exposure) based on
            published occupational AI-exposure research — OECD employment-outlook analyses and
            Felten-style occupational exposure indices — applied to the occupations graduates of
            the major actually enter. Important nuance: high exposure does not mean the job
            disappears; it usually means the junior layer of the job changes first, which
            matters most for fresh graduates. Like market demand, this is an interpretation of
            published research rather than a single official figure, so it is carried as an{" "}
            <em>estimate</em> by design.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">5 · ROI</h3>
          <p>
            What the degree costs an international student (full international tuition for the
            standard course length) against the median starting salary graduates actually earn,
            summarised as payback years. The mechanics are the same as the ROI score described
            below.
          </p>

          <h3 className="font-display text-base font-semibold text-slate-700 mt-5 mb-1.5">Limitations — read this part</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Official statistics rarely separate international students.</strong> QILT
              and HEA outcomes are dominated by domestic graduates, who don&apos;t face visa
              constraints. Our visa-pathway layer is the correction we apply for that — it is
              our judgement, not an official statistic.
            </li>
            <li>
              <strong>What &quot;verified&quot; means — and what it doesn&apos;t.</strong>{" "}
              Employment, visa pathway, and ROI are marked <em>verified</em>: each figure has
              been cross-checked against the government source named above for that country, and
              every major carries the date it was last checked. &quot;Verified&quot; means
              traced to a stated official source as of a stated date — not that the number
              predicts your individual outcome. Some employment figures map a major onto a
              broad field band (for example QILT and HEA report by study area), so the match to
              your specific course is approximate.
            </li>
            <li>
              <strong>Market demand and AI exposure are deliberately left as{" "}
              <em>estimate</em>.</strong> Neither has a single official statistic behind it, so
              we build them from several signals and published research and label them honestly.
              The <em>estimate</em> tag describes how the number was made — it is part of being
              straight with you, not a gap we simply haven&apos;t filled.
            </li>
            <li>
              <strong>Field-level data hides person-level variance.</strong> A major&apos;s
              employment rate is a cohort median, not your probability.
            </li>
            <li>
              The legacy Degree Risk model currently covers <strong>the US, Canada, the UK,
              Australia, and Ireland</strong>. It is an editorial study-field tool and is not used
              as an exact career-country ranking in the newer comparison release gate.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">ROI score</h2>
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
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">After-tax estimates</h2>
          <p>
            The legacy ROI Explorer uses simplified {TAX_YEAR} single-filer models only in countries
            where a country rule exists. It is not a current decision-ready tax comparison. It can
            include national income tax, selected regional approximations, and mandatory employee
            contributions. Credits, deductions, household circumstances, local taxes, and professional
            advice are not modelled. Where there is no maintained model, the product labels the tax
            and take-home result unavailable instead of showing a zero-tax estimate.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">Medicine override</h2>
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
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">Career stage adjustment</h2>
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
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">Data sources</h2>
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
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">Known limitations</h2>
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
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200 text-sm flex items-center gap-4">
        <Link href="/roi-explorer" className="text-blue-600 hover:underline">ROI Explorer</Link>
      </div>
    </div>
  )
}
