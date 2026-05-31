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
  "ireland-cs-graduate-salary-2025": {
    slug: "ireland-cs-graduate-salary-2025",
    title: "Ireland Computer Science Graduate Salary 2025: The Complete Guide",
    description: "Irish CS graduates earn €45,000 on average. We break down salaries by university, city, and career stage using HEA government data.",
    date: "May 31, 2025",
    readTime: "5 min",
    tag: "Ireland",
    tagColor: "bg-emerald-100 text-emerald-700",
    content: (
      <div className="prose prose-slate max-w-none">
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
      <div className="prose prose-slate max-w-none">
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
      <div className="prose prose-slate max-w-none">
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
