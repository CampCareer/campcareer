"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { localizePath, type LocaleOption } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export function FeaturedMajors({ locale }: { locale: LocaleOption }) {
  const isKo = locale === "ko"

  const categories = STUDY_CATEGORIES.map((cat) => {
    const visual = getStudyCategoryVisual(cat.id)
    const count = STUDY_CONCEPTS.filter((c) => c.category === cat.id).length
    return { ...cat, visual, count }
  })

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <Stat number="39" label={isKo ? "개 전공" : "majors"} />
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <Stat number="10" label={isKo ? "개 분야" : "fields"} />
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <Stat number="100%" label={isKo ? "데이터 기반" : "data-driven"} />
          </div>
        </motion.div>

        {/* Category grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 sm:gap-4"
        >
          {categories.map((cat) => {
            const { Icon, tone } = cat.visual
            return (
              <motion.div key={cat.id} variants={item}>
                <Link
                  href={localizePath(`/au/majors?category=${cat.id}`, locale)}
                  className={cn(
                    "group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 text-center transition-all duration-200",
                    "hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_8px_24px_rgba(0,0,0,.06)]",
                    "sm:p-6"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                      tone
                    )}
                  >
                    <Icon className="size-6" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {isKo ? cat.labelKo : cat.label}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {cat.count} {isKo ? "개 전공" : "majors"}
                    </p>
                  </div>
                  <ArrowRight
                    className="size-4 text-slate-300 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-600 group-hover:opacity-100"
                    strokeWidth={2.5}
                  />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href={localizePath("/au/majors", locale)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {isKo ? "전체 전공 보기" : "View all majors"}
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        {number}
      </p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}
