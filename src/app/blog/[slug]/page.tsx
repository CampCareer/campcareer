import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"

type Post = {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  tag: string
  tagColor: string
  content: React.ReactNode
}

const POSTS: Record<string, Post> = {
  "cost-of-studying-in-ireland-2026": {
    slug: "cost-of-studying-in-ireland-2026",
    title: "How Much Does It Cost to Study in Ireland in 2026? A Complete Breakdown",
    description: "Tuition, the reduced student contribution charge, city-by-city living costs, visa funds, and the Stamp 1G payoff — the full 2026 cost picture for international students.",
    date: "June 1, 2026",
    readTime: "8 min",
    tag: "Ireland",
    tagColor: "bg-emerald-100 text-emerald-700",
    content: (
      <div className="prose prose-slate prose-headings:mt-10 prose-headings:mb-4 max-w-none">

        {/* 작성자 소개 */}
        <div className="not-prose flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-indigo-600">YL</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Yaehun Lee</p>
            <p className="text-xs text-slate-500">NCI Computer Science · Dublin, Ireland · Written June 2026</p>
          </div>
        </div>

        <p className="text-xl text-slate-600 leading-relaxed mb-8">
          I&apos;m writing this from Dublin, where I&apos;m currently studying Computer Science at NCI with 113 days left until my intake. Before I got here, I spent time in Germany — and if I&apos;m being honest, I wish I&apos;d come to Ireland sooner. This is the cost breakdown I wish someone had given me before I started researching: not the brochure numbers, but what it actually looks like on the ground.
        </p>

        <h2>Why Ireland, after Germany and Australia</h2>
        <p>
          I&apos;d already done two years of working holiday in Australia before this. I loved it, but getting back on a student visa there is genuinely difficult, and the tuition fees are steep. Canada never really made sense for me — I couldn&apos;t find a compelling enough reason. The UK I dismissed pretty quickly; I&apos;d heard too many stories about the racial dynamics there, and what I saw in Australia already put me off that kind of environment.
        </p>
        <p>
          Ireland made sense partly because my partner is an EU citizen, which opened up the EU Treaty Rights (EUTR) route — something that simply isn&apos;t possible in most other English-speaking countries. But even without that, Ireland had a compelling case: relatively affordable tuition for the English-speaking world, a thriving tech sector, and a genuine post-study pathway through the Stamp 1G. The EU angle just made it an easy call.
        </p>
        <p>
          One thing I didn&apos;t expect: after a year in Germany — where the bureaucracy is exhausting and people can be genuinely cold — Ireland felt like a relief. People here are warm, the culture isn&apos;t as competitive academically, and the lifestyle is more relaxed than I anticipated. I adapted faster than I did anywhere else.
        </p>

        <h2>Tuition: the honest numbers</h2>
        <p>
          For non-EU international students, tuition in Ireland runs roughly <strong>€10,000–€25,000 per year</strong> for undergraduate programmes and <strong>€10,000–€35,000</strong> for a taught master&apos;s. STEM, business and health programmes sit at the top; arts and humanities at the lower end. Medicine is its own category entirely — often €50,000–€65,000.
        </p>
        <p>
          Compared to the UK or Australia, these numbers are meaningfully lower. It&apos;s not cheap, but it&apos;s competitive for what you get — especially when you factor in the Stamp 1G stay-back after graduation (more on that below).
        </p>
        <p>
          One detail worth knowing: on top of tuition, universities charge a <strong>student contribution charge</strong> for registration, exams and services. This had crept up to around €3,000, but from January 2026 it&apos;s been reduced to <strong>€2,500</strong>. A small saving, but worth factoring in. Always check whether your university folds this into the tuition quote or lists it separately — they differ.
        </p>

        <h2>The accommodation situation: not what you&apos;ve heard</h2>
        <p>
          Before I came, nearly everyone told me finding a place in Dublin was a nightmare. And look — it&apos;s not simple. But I think the &quot;Dublin housing crisis&quot; narrative that gets shared online creates a distorted picture for incoming students specifically.
        </p>
        <p>
          Here&apos;s what actually happens: landlords in Ireland typically give one month&apos;s notice before a property becomes available. That means listings go up for <em>immediate</em> availability — not two or three months in advance. If you&apos;re sitting in Seoul or Sydney trying to book a room for September, you&apos;re searching in June, and nothing is showing up yet. So it looks like there&apos;s nothing available. There isn&apos;t nothing — the market just doesn&apos;t work the way you&apos;re used to.
        </p>
        <p>
          Once I arrived and started looking locally, it was far easier than I expected. The real difficulty is the timing mismatch: if you need a place in three months, you can&apos;t really plan it from abroad. That part is genuinely frustrating, and I won&apos;t pretend otherwise. But &quot;impossible to find accommodation&quot; is not accurate. &quot;Hard to plan ahead from overseas&quot; is.
        </p>

        <div className="not-prose bg-amber-50 border border-amber-200 rounded-2xl p-5 my-8">
          <p className="text-sm font-semibold text-amber-800 mb-1">💡 Practical tip</p>
          <p className="text-sm text-amber-700">Book short-term accommodation (Airbnb or a hostel) for your first two to three weeks. Then find your actual place once you&apos;re on the ground. It costs a bit more upfront but removes most of the stress.</p>
        </div>

        <h2>Dublin vs Limerick: the €300 question</h2>
        <p>
          I genuinely considered Limerick before committing to Dublin. The reason is simple: in Limerick city you can find a studio apartment for around <strong>€1,000 a month</strong>. In central Dublin, <strong>€1,300 gets you a room in a shared house</strong>. Not a studio. A room. In a house with other people.
        </p>
        <p>
          That comparison still kind of baffles me. You&apos;re paying more for less, in a busier and louder city. The honest answer is that Dublin makes sense if your career is in tech or finance — because that&apos;s where the jobs are, and the networking proximity matters. But if you&apos;re studying something where location matters less, or if you&apos;re doing a one-year master&apos;s and want to actually save money while you study, Limerick and Galway deserve serious consideration.
        </p>

        <div className="not-prose bg-slate-50 rounded-2xl p-6 my-8">
          <h3 className="text-base font-bold text-slate-900 mb-4">Monthly living costs by city (2026 estimates)</h3>
          <div className="space-y-3">
            {[
              { city: "Dublin",   cost: "€1,500 – €2,100/mo", note: "Shared rooms from ~€1,300. Studios rare under €1,800." },
              { city: "Cork",     cost: "€1,100 – €1,500/mo", note: "Strong pharma and tech presence. Good value." },
              { city: "Galway",   cost: "€1,050 – €1,450/mo", note: "Smaller, student-friendly, easier to find housing." },
              { city: "Limerick", cost: "€950 – €1,300/mo",   note: "Studios available around €1,000. Best value for money." },
            ].map((row) => (
              <div key={row.city} className="bg-white rounded-xl px-4 py-3 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-slate-800">{row.city}</p>
                  <span className="text-sm font-bold text-indigo-600">{row.cost}</span>
                </div>
                <p className="text-xs text-slate-400">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">All-in estimates (rent, food, transport, essentials). Rent is the dominant variable.</p>
        </div>

        <div className="not-prose bg-indigo-50 border border-indigo-100 rounded-2xl p-6 my-8">
          <p className="text-sm font-semibold text-indigo-700 mb-2">🔍 See real Ireland ROI by city &amp; field</p>
          <p className="text-sm text-slate-600 mb-4">
            CampCareer tracks live city-level rent across Irish cities — including Drogheda, Kilkenny and beyond — so you can compare net cost, not just tuition.
          </p>
          <Link
            href="/roi-explorer?country=ie"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Explore Ireland ROI <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <h2>What you need to prove for the visa</h2>
        <p>
          For the D-Study visa (Stamp 2), Irish immigration requires you to show:
        </p>
        <ul>
          <li>At least <strong>€10,000 available for living costs</strong> for year one (and the same for each additional year)</li>
          <li>Proof that at least <strong>€6,000 of first-year tuition</strong> has been paid to the institution</li>
          <li>Private medical insurance covering accident and illness</li>
        </ul>
        <p>
          So for a one-year master&apos;s with €15,000 tuition, you&apos;re typically showing around <strong>€25,000</strong> in accessible funds. The money needs to be genuinely liquid — credit card limits don&apos;t count, and last-minute deposits get flagged.
        </p>
        <p>
          After you arrive, you register for an Irish Residence Permit (IRP) within 90 days. That costs <strong>€300</strong>. Budget for it.
        </p>
        <p>
          I&apos;m currently in the process of applying for EU Treaty Rights (EUTR), which opens up a different immigration route for people with EU citizen partners or family members. If that applies to you, it&apos;s worth exploring — but brace yourself for the wait times. The processing is slow in a way that will test your patience. Ireland&apos;s immigration system is functional, but &quot;efficient&quot; is not the word I would use.
        </p>

        <h2>The payoff: Stamp 1G and why the numbers can work</h2>
        <p>
          Here&apos;s the part that justifies the cost for a lot of people. After graduating, non-EU students can apply for the <strong>Third Level Graduate Programme</strong> — a Stamp 1G permission that lets you stay and work in Ireland with no employer sponsorship and no salary threshold. Bachelor&apos;s graduates get <strong>12 months</strong>. Master&apos;s and PhD graduates get <strong>24 months</strong>.
        </p>
        <p>
          For a master&apos;s graduate, two years in Dublin&apos;s tech market — where Google, Meta, Apple, LinkedIn, Microsoft, Salesforce and Stripe all have major offices — is a meaningful window to land a role and transition to a longer-term permit. Most CS and data roles here clear the salary thresholds for a Critical Skills Employment Permit without difficulty.
        </p>
        <p>
          I haven&apos;t experienced the job market personally yet, but the structural case is strong. That&apos;s why I chose this over going back to Australia.
        </p>

        <h2>So — should you come to Ireland?</h2>
        <p>
          I&apos;ll be honest about the downsides first. The administration is slow. The housing market has a structural problem that a government serious about building would have fixed years ago — if Dublin built apartments at the rate it needs to, half the social problems people complain about would ease up. The EUTR processing time is, frankly, not good enough. And yes, it rains.
        </p>
        <p>
          But: the people here are genuinely warm in a way I didn&apos;t fully expect after Germany. The academic environment is less cutthroat than Korea or the US. The summers — and I say this as someone who was warned repeatedly — are actually lovely. And the combination of English-language education, competitive tuition relative to the UK or Australia, and a clear post-study work pathway makes Ireland a genuinely strong option for international students who do the math properly.
        </p>
        <p>
          I wish I&apos;d come here before Germany. That&apos;s probably the most honest endorsement I can give.
        </p>

        <div className="not-prose bg-indigo-50 border border-indigo-100 rounded-2xl p-6 my-8">
          <p className="text-sm font-semibold text-indigo-700 mb-2">🎯 Plan your Ireland application</p>
          <p className="text-sm text-slate-600 mb-4">
            Build a visa checklist, set your intake date, and track every deadline from offer letter to arrival day.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/checklist"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              Build my checklist <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              Set my timeline
            </Link>
          </div>
        </div>

        <div className="not-prose mt-10 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-500">About the author:</strong> Yaehun Lee is a Korean international student currently studying Computer Science at NCI Dublin. He previously lived in Australia (2 years, working holiday) and Germany before choosing Ireland. This article is based on his personal experience and research as of June 2026.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Cost figures are indicative ranges based on 2026 data. Tuition, visa requirements and contribution charges change year to year — always verify on official sources (irishimmigration.ie, your institution&apos;s fee schedule) before applying.
          </p>
        </div>

      </div>
    ),
  },
  "ireland-cs-graduate-salary-2025": {
    slug: "ireland-cs-graduate-salary-2025",
    title: "Ireland Computer Science Graduate Salary 2025: The Complete Guide",
    description: "Irish CS graduates earn €45,000 on average. We break down salaries by university, city, and career stage using HEA government data.",
    date: "May 31, 2025",
    readTime: "5 min",
    tag: "Ireland",
    tagColor: "bg-emerald-100 text-emerald-700",
    content: (
      <div className="prose prose-slate prose-headings:mt-10 prose-headings:mb-4 max-w-none">
        <p className="text-xl text-slate-600 leading-relaxed mb-8">
          Ireland has quietly become one of the best destinations for international students seeking strong career outcomes. With some of the lowest tuition fees in the English-speaking world and a booming tech sector, Irish CS graduates are in high demand — and their salaries reflect it.
        </p>

        <h2>Average CS Graduate Salary in Ireland (2025)</h2>
        <p>
          According to the <strong>HEA Graduate Outcomes Survey 2023</strong> — the most comprehensive official source for Irish graduate earnings — Computer Science graduates earn an average of <strong>€45,000</strong> in their first year after graduation. This places Ireland among the top destinations in Europe for tech graduates.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 my-8 not-prose">
          <h3 className="text-base font-bold text-slate-900 mb-4">Average Salary by Career Stage</h3>
          <div className="space-y-3">
            {[
              { stage: "Entry Level (0–2 years)", salary: "€38,000 – €48,000", color: "bg-emerald-100 text-emerald-700" },
              { stage: "Mid Level (3–6 years)",   salary: "€55,000 – €75,000", color: "bg-blue-100 text-blue-700" },
              { stage: "Senior (7+ years)",        salary: "€80,000 – €120,000", color: "bg-indigo-100 text-indigo-700" },
            ].map((row) => (
              <div key={row.stage} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200">
                <span className="text-sm font-medium text-slate-700">{row.stage}</span>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${row.color}`}>{row.salary}</span>
              </div>
            ))}
          </div>
        </div>

        <h2>Salary by City</h2>
        <p>
          Dublin dominates the Irish tech market, home to the European headquarters of Google, Meta, Apple, and LinkedIn. However, regional cities are catching up fast — and often offer better ROI due to lower living costs.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 my-8 not-prose">
          <h3 className="text-base font-bold text-slate-900 mb-4">Average CS Salary by City</h3>
          <div className="space-y-3">
            {[
              { city: "Dublin",   salary: "€50,000", rent: "€2,450/mo", roi: "★★★" },
              { city: "Cork",     salary: "€44,000", rent: "€1,800/mo", roi: "★★★★" },
              { city: "Galway",   salary: "€42,000", rent: "€1,650/mo", roi: "★★★★" },
              { city: "Limerick", salary: "€40,000", rent: "€1,450/mo", roi: "★★★★★" },
            ].map((row) => (
              <div key={row.city} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{row.city}</p>
                  <p className="text-xs text-slate-400">Rent: {row.rent}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">{row.salary}</p>
                  <p className="text-xs text-emerald-600">{row.roi}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">★ = ROI score (higher = better value after living costs)</p>
        </div>

        <h2>Tuition Fees: Why Ireland Wins on Cost</h2>
        <p>
          One of Ireland&apos;s biggest advantages is its tuition fees. EU/EEA students pay as little as <strong>€3,000–€5,000 per year</strong>, while non-EU international students typically pay <strong>€10,000–€25,000</strong> — significantly lower than the UK or US.
        </p>
        <p>
          This creates a powerful ROI equation: lower upfront cost, competitive graduate salaries, and a clear path to EU employment.
        </p>

        <h2>Visa Pathways After Graduation</h2>
        <p>
          Ireland offers two main post-study work options:
        </p>
        <ul>
          <li><strong>Third Level Graduate Scheme:</strong> 12–24 months stay-back permission for degree holders</li>
          <li><strong>Critical Skills Employment Permit:</strong> Fast-track work visa for roles earning €32,000+ (most CS roles qualify)</li>
          <li><strong>EU mobility:</strong> Irish graduates can work across all 27 EU member states</li>
        </ul>

        <h2>Is Ireland Right for You?</h2>
        <p>
          Ireland is ideal if you want to work in tech, keep costs manageable, and have access to EU opportunities. Regional universities like University of Limerick and Maynooth University offer excellent ROI compared to Trinity College Dublin — especially after accounting for rent.
        </p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 my-8 not-prose">
          <p className="text-sm font-semibold text-indigo-700 mb-2">🔍 Explore Ireland ROI on CampCareer</p>
          <p className="text-sm text-slate-600 mb-4">
            Compare all 2,860+ Irish courses by ROI score, salary, and tuition — filtered by province and field of study.
          </p>
          <Link
            href="/roi-explorer?country=ie"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Explore Ireland ROI <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    ),
  },

  "australia-vs-canada-study-abroad-roi": {
    slug: "australia-vs-canada-study-abroad-roi",
    title: "Australia vs Canada: Which Has Better ROI for International Students?",
    description: "We compare tuition costs, graduate salaries, visa pathways, and cost of living to find the winner for international students in 2025.",
    date: "May 31, 2025",
    readTime: "7 min",
    tag: "Comparison",
    tagColor: "bg-blue-100 text-blue-700",
    content: (
      <div className="prose prose-slate prose-headings:mt-10 prose-headings:mb-4 max-w-none">
        <p className="text-xl text-slate-600 leading-relaxed mb-8">
          Australia and Canada are the two most popular English-speaking study destinations outside the UK and US. Both offer post-study work visas, strong job markets, and pathways to permanent residency. But which gives international students a better return on investment?
        </p>

        <h2>Tuition Fees: Canada Wins on Cost</h2>
        <p>
          Canadian universities are generally cheaper than Australian ones for international students. However, the gap is narrowing — and varies significantly by province and program.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 my-8 not-prose">
          <h3 className="text-base font-bold text-slate-900 mb-4">Average Annual Tuition (International Students)</h3>
          <div className="space-y-3">
            {[
              { country: "🇨🇦 Canada",    undergrad: "CA$25,000–$35,000", postgrad: "CA$18,000–$28,000" },
              { country: "🇦🇺 Australia", undergrad: "A$30,000–$45,000",  postgrad: "A$22,000–$37,000" },
            ].map((row) => (
              <div key={row.country} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200">
                <span className="text-sm font-semibold text-slate-800">{row.country}</span>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Undergrad: {row.undergrad}</p>
                  <p className="text-xs text-slate-500">Postgrad: {row.postgrad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2>Graduate Salaries: Australia Edges Ahead</h2>
        <p>
          Australian graduates typically earn higher nominal salaries — but the cost of living, especially rent in Sydney and Melbourne, eats into take-home pay. Canada&apos;s lower cost of living in cities like Montreal and Ottawa can make net salary more competitive.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 my-8 not-prose">
          <h3 className="text-base font-bold text-slate-900 mb-4">CS Graduate Salary Comparison</h3>
          <div className="space-y-3">
            {[
              { label: "🇦🇺 Sydney",    gross: "A$75,000",  rent: "A$2,817/mo",  net: "A$28,000/yr" },
              { label: "🇦🇺 Melbourne", gross: "A$70,000",  rent: "A$2,383/mo",  net: "A$31,000/yr" },
              { label: "🇨🇦 Toronto",   gross: "CA$70,000", rent: "CA$2,690/mo", net: "CA$26,000/yr" },
              { label: "🇨🇦 Montreal",  gross: "CA$62,000", rent: "CA$1,930/mo", net: "CA$34,000/yr" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200">
                <span className="text-sm font-semibold text-slate-800">{row.label}</span>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Gross: {row.gross}</p>
                  <p className="text-xs font-bold text-emerald-600">Net after rent: {row.net}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Net = gross salary minus rent and living costs (estimated)</p>
        </div>

        <h2>Post-Study Work Visa</h2>
        <p>Australia&apos;s Temporary Graduate visa (subclass 485) offers <strong>2–4 years</strong> of work rights depending on your degree level and study location. Regional graduates get an extra year — making regional Australian universities particularly attractive.</p>
        <p>Canada&apos;s Post-Graduation Work Permit (PGWP) offers <strong>up to 3 years</strong> for programs of 2+ years. It&apos;s arguably the more straightforward path, with fewer location restrictions.</p>

        <h2>Pathway to Permanent Residency</h2>
        <ul>
          <li><strong>Australia:</strong> Points-based system (SkillSelect). Competitive for tech roles. Regional study adds points.</li>
          <li><strong>Canada:</strong> Express Entry — fastest PR pathway globally. CRS score determines eligibility. Tech workers in strong demand.</li>
        </ul>
        <p>Canada wins on PR speed and predictability. Australia wins on flexibility and lifestyle.</p>

        <h2>The Verdict</h2>
        <p>
          <strong>Choose Australia if:</strong> You want strong nominal salaries, outdoor lifestyle, and flexibility in PR pathways. Study in regional cities for better ROI and extra visa points.
        </p>
        <p>
          <strong>Choose Canada if:</strong> You want the fastest PR route, lower tuition, and prefer urban environments. Montreal and Ottawa offer exceptional value.
        </p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 my-8 not-prose">
          <p className="text-sm font-semibold text-indigo-700 mb-2">📊 Compare Australia vs Canada on CampCareer</p>
          <p className="text-sm text-slate-600 mb-4">
            Use our Country Compare tool to see a live side-by-side comparison with real salary and ROI data.
          </p>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Compare Countries <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    ),
  },

  "uk-graduate-route-visa-salary-2025": {
    slug: "uk-graduate-route-visa-salary-2025",
    title: "UK Graduate Route Visa 2025: Salaries You Can Expect",
    description: "The UK Graduate Route gives you 2 years to work after graduation. Here's what you can realistically earn by field and city.",
    date: "May 31, 2025",
    readTime: "6 min",
    tag: "United Kingdom",
    tagColor: "bg-violet-100 text-violet-700",
    content: (
      <div className="prose prose-slate prose-headings:mt-10 prose-headings:mb-4 max-w-none">
        <p className="text-xl text-slate-600 leading-relaxed mb-8">
          The UK Graduate Route visa allows international students to stay and work in the UK for 2 years after graduation (3 years for PhD holders). But with high tuition fees and London&apos;s sky-high rents, you need to understand what you&apos;ll actually take home — not just your gross salary.
        </p>

        <h2>What is the Graduate Route Visa?</h2>
        <p>
          Introduced in 2021, the Graduate Route (formerly called PSW — Post-Study Work) allows you to:
        </p>
        <ul>
          <li>Work in any job, at any skill level, for <strong>2 years</strong></li>
          <li>Switch to a Skilled Worker visa if you find a sponsored role paying £26,200+</li>
          <li>No minimum salary requirement on the Graduate Route itself</li>
        </ul>

        <h2>Graduate Salaries by Field (HESA 2024)</h2>
        <p>
          The UK&apos;s Higher Education Statistics Agency (HESA) publishes annual graduate outcome surveys. Here&apos;s what UK graduates earn 15 months after graduation:
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 my-8 not-prose">
          <h3 className="text-base font-bold text-slate-900 mb-4">Median Graduate Salary by Field</h3>
          <div className="space-y-3">
            {[
              { field: "Computer Science",      salary: "£35,000", demand: "Very High" },
              { field: "Engineering",           salary: "£32,000", demand: "High" },
              { field: "Business & Finance",    salary: "£28,000", demand: "High" },
              { field: "Medicine & Healthcare", salary: "£34,000", demand: "Very High" },
              { field: "Law",                   salary: "£27,000", demand: "Medium" },
              { field: "Arts & Humanities",     salary: "£22,000", demand: "Low" },
            ].map((row) => (
              <div key={row.field} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200">
                <span className="text-sm font-medium text-slate-700">{row.field}</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">{row.salary}</p>
                  <p className="text-xs text-slate-400">Demand: {row.demand}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Source: HESA Graduate Outcomes Survey 2024</p>
        </div>

        <h2>After Tax: What You Actually Take Home</h2>
        <p>
          UK income tax + National Insurance can take 28–35% of your gross salary. Here&apos;s what a CS graduate earning £35,000 actually keeps:
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 my-8 not-prose">
          <h3 className="text-base font-bold text-slate-900 mb-4">£35,000 CS Salary Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Gross Salary",          value: "£35,000",   color: "text-slate-700" },
              { label: "Income Tax",             value: "− £4,486",  color: "text-red-500" },
              { label: "National Insurance",     value: "− £1,828",  color: "text-red-500" },
              { label: "After-Tax Take Home",    value: "£28,686",   color: "text-emerald-600 font-bold" },
              { label: "London Rent (annual)",   value: "− £32,400", color: "text-orange-500" },
              { label: "Net after London rent",  value: "− £3,714",  color: "text-red-700 font-bold" },
              { label: "Net after Leeds rent",   value: "+ £15,060", color: "text-emerald-700 font-bold" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200">
                <span className="text-sm text-slate-600">{row.label}</span>
                <span className={`text-sm ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">London rent estimate: £2,700/mo average. Leeds: £1,050/mo average.</p>
        </div>

        <h2>London vs Regional Cities: The Real ROI Gap</h2>
        <p>
          London salaries are about 15–25% higher than regional cities — but London rent is <strong>2.5× more expensive</strong>. For most graduates, cities like Manchester, Edinburgh, and Leeds offer dramatically better net take-home pay.
        </p>

        <h2>From Graduate Route to Skilled Worker Visa</h2>
        <p>
          To switch to a Skilled Worker visa (and eventually apply for ILR — Indefinite Leave to Remain), you need:
        </p>
        <ul>
          <li>A job offer from a UK-licensed sponsor</li>
          <li>Salary of at least £26,200 (most CS roles far exceed this)</li>
          <li>5 years of continuous residence for ILR</li>
        </ul>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 my-8 not-prose">
          <p className="text-sm font-semibold text-indigo-700 mb-2">🇬🇧 Explore UK University ROI on CampCareer</p>
          <p className="text-sm text-slate-600 mb-4">
            Compare UK universities by ROI score, after-tax salary, and payback period — filtered by region and field.
          </p>
          <Link
            href="/roi-explorer?country=uk"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Explore UK ROI <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    ),
  },
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = POSTS[params.slug]
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug]
  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.tagColor}`}>
            {post.tag}
          </span>
          <span className="text-xs text-slate-400">{post.date}</span>
          <span className="text-xs text-slate-400">{post.readTime} read</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
          {post.title}
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed">{post.description}</p>
      </div>

      <hr className="border-slate-200 mb-8" />

      {post.content}

      <hr className="border-slate-200 mt-12 mb-8" />

      <div className="flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All articles
        </Link>
        <Link
          href="/roi-explorer"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Try ROI Explorer <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
