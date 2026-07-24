"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookmarkPlus } from "lucide-react"
import { localizePath, type LocaleOption } from "@/lib/i18n/config"
import { Button } from "@/components/ui/button"

export function LoginCta({ locale }: { locale: LocaleOption }) {
  const router = useRouter()
  const isKo = locale === "ko"

  return (
    <section className="relative overflow-hidden bg-blue-600 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,.12),transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-white/15 text-white">
            <BookmarkPlus className="size-6" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {isKo
              ? "내 전공 비교 플랜을 저장하세요"
              : "Save your major comparison plan"}
          </h2>
          <p className="mt-3 text-base text-blue-100">
            {isKo
              ? "로그인하면 추천 결과를 저장하고 나중에 이어서 할 수 있습니다."
              : "Log in to save your results and pick up where you left off."}
          </p>
          <Button
            size="lg"
            onClick={() => router.push(localizePath("/login", locale))}
            className="mt-8 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg shadow-black/10 hover:bg-blue-50"
          >
            {isKo ? "로그인하고 시작하기" : "Log in to get started"}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
