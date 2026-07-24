"use client"

import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Sparkles } from "lucide-react"

import { type LocaleOption } from "@/lib/i18n/config"

const steps = [
  {
    num: 1,
    icon: Search,
    ko: { title: "전공 선택", desc: "관심 있는 분야를ilih하세요" },
    en: { title: "Pick a major", desc: "Choose the field that fits your interest" },
  },
  {
    num: 2,
    icon: SlidersHorizontal,
    ko: { title: "조건 설정", desc: "학비, 기간, 목표를 입력하세요" },
    en: { title: "Set your conditions", desc: "Enter budget, duration and goals" },
  },
  {
    num: 3,
    icon: Sparkles,
    ko: { title: "플랜 생성", desc: "나만의 유학 로드맵을 확인하세요" },
    en: { title: "Get your plan", desc: "See your personalised study roadmap" },
  },
]

export function HowItWorks({ locale }: { locale: LocaleOption }) {
  const isKo = locale === "ko"

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {isKo ? "어떻게 사용하나요?" : "How does it work?"}
          </h2>
          <p className="mt-3 text-base text-slate-500">
            {isKo
              ? "3단계만 거치면 나만의 유학 플랜이 완성됩니다."
              : "In just 3 steps, your personalised study plan is ready."}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            const content = isKo ? step.ko : step.en
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center"
              >
                {/* Connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+32px)] top-6 hidden h-px w-[calc(100%-64px)] bg-slate-200 sm:block" />
                )}

                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="size-6" strokeWidth={2} />
                </div>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-blue-600">
                  {isKo ? `단계 ${step.num}` : `Step ${step.num}`}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">
                  {content.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {content.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
