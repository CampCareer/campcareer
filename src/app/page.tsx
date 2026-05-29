import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, GraduationCap, BarChart3 } from "lucide-react"

const stats = [
  { value: "5",    label: "Countries",       icon: Globe },
  { value: "50+",  label: "Degrees",         icon: GraduationCap },
  { value: "Real", label: "Salary Data",     icon: BarChart3 },
]

const countries = ["🇦🇺 Australia", "🇬🇧 UK", "🇨🇦 Canada", "🇮🇪 Ireland", "🇺🇸 USA"]

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-24">
      <div className="max-w-2xl w-full mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full mb-8 border border-indigo-100">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Data-driven career decisions
        </div>

        {/* Hero heading */}
        <h1 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight">
          Find Your Best Country.
          <br />
          <span className="text-indigo-500">With Data, Not Emotions.</span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg text-slate-500 leading-relaxed">
          Compare graduate salaries, tax, and cost of living across{" "}
          <span className="text-slate-700 font-medium">
            Australia, UK, Canada, Ireland & USA
          </span>
        </p>

        {/* CTA */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 rounded-xl gap-2"
          >
            <Link href="/roi-explorer">
              Explore ROI
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="text-slate-600 rounded-xl">
            <Link href="/compare">Compare Countries</Link>
          </Button>
        </div>

        {/* Country pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {countries.map((c) => (
            <span
              key={c}
              className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-slate-200" />

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 bg-white border border-slate-200 rounded-2xl px-6 py-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{value}</span>
              <span className="text-sm text-slate-500">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
