import { pageMetadata } from "@/lib/seo"
import { getTranslations } from "@/lib/i18n/server"
import Link from "next/link"
import { GraduationCap, Building2, Briefcase } from "lucide-react"

export async function generateMetadata() {
  const t = getTranslations()
  return pageMetadata({
    title: t.compare.hub.title,
    description: t.compare.hub.subtitle,
    path: "/compare",
  })
}

export default function ComparePage() {
  const t = getTranslations().compare.hub

  const compareTypes = [
    { href: "/compare/schools", icon: Building2, title: t.schools, desc: t.schoolsDesc },
    { href: "/compare/majors", icon: GraduationCap, title: t.majors, desc: t.majorsDesc },
    { href: "/compare/careers", icon: Briefcase, title: t.careers, desc: t.careersDesc },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <header className="mb-10">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          {t.title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
          {t.subtitle}
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-3">
        {compareTypes.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-slate-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
