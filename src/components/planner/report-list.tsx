"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Clock, FileCheck2, Loader2, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

type ReportOrder = {
  id: string
  product_id: string
  status: string
  report_language: string
  price_aud_cents: number
  purchased_at: string | null
  fulfilled_at: string | null
  created_at: string
}

const PRODUCT_LABELS: Record<string, { en: string; ko: string }> = {
  "my-australia-roi-decision-report": { en: "Personalised ROI Decision Report", ko: "개인화 ROI 의사결정 리포트" },
  "australia-study-roi-index-2026": { en: "Australia Study ROI Index 2026", ko: "호주 유학 ROI 인덱스 2026" },
  "australia-topic-deep-dive": { en: "Australia Topic Deep Dive", ko: "호주 주제 심층 분석" },
  "australia-expert-review": { en: "Expert Review", ko: "전문가 리뷰" },
}

const STATUS_CONFIG: Record<string, { en: string; ko: string; icon: typeof Check; color: string }> = {
  ready: { en: "Ready", ko: "완료", icon: Check, color: "text-emerald-600 bg-emerald-50" },
  paid: { en: "Processing", ko: "처리 중", icon: Loader2, color: "text-blue-600 bg-blue-50" },
  generating: { en: "Generating", ko: "생성 중", icon: Loader2, color: "text-violet-600 bg-violet-50" },
  awaiting_payment: { en: "Awaiting payment", ko: "결제 대기", icon: Clock, color: "text-amber-600 bg-amber-50" },
  draft: { en: "Draft", ko: "초안", icon: FileCheck2, color: "text-slate-500 bg-slate-50" },
  failed: { en: "Failed", ko: "실패", icon: FileCheck2, color: "text-rose-600 bg-rose-50" },
  refunded: { en: "Refunded", ko: "환불됨", icon: FileCheck2, color: "text-slate-500 bg-slate-50" },
  cancelled: { en: "Cancelled", ko: "취소됨", icon: FileCheck2, color: "text-slate-500 bg-slate-50" },
}

export function ReportList() {
  const supabase = useMemo(() => createClient(), [])
  const { isKo } = useReportLocale()
  const [orders, setOrders] = useState<ReportOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !active) { setLoading(false); return }
      const { data } = await supabase
        .from("report_orders")
        .select("id, product_id, status, report_language, price_aud_cents, purchased_at, fulfilled_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
      if (!active) return
      setOrders((data as ReportOrder[] | null) ?? [])
      setLoading(false)
    }
    void load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => void load())
    return () => { active = false; subscription.unsubscribe() }
  }, [supabase])

  if (loading) {
    return (
      <section className="mt-10 border-t border-slate-200 pt-8">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-20 rounded-xl bg-slate-100" />
        </div>
      </section>
    )
  }

  const activeOrders = orders.filter((o) => !["cancelled", "refunded", "draft"].includes(o.status))
  const pastOrders = orders.filter((o) => ["cancelled", "refunded"].includes(o.status))

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">
          {isKo ? "내 리포트" : "MY REPORTS"}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
          {isKo ? "저장된 리포트와 주문 내역" : "Saved reports and order history"}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {isKo
            ? "구매한 리포트와 준비 중인 리포트를 여기에서 확인할 수 있습니다."
            : "View purchased reports and those being prepared here."}
        </p>
      </div>

      {/* Active orders */}
      {activeOrders.length > 0 ? (
        <div className="mt-6 space-y-3">
          {activeOrders.map((order) => {
            const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.draft
            const product = PRODUCT_LABELS[order.product_id] ?? { en: order.product_id, ko: order.product_id }
            const StatusIcon = status.icon
            return (
              <div
                key={order.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", status.color)}>
                  <StatusIcon className={cn("size-5", order.status === "generating" || order.status === "paid" ? "animate-spin" : "")} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-950">
                    {isKo ? product.ko : product.en}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isKo ? status.ko : status.en}
                    {order.purchased_at && ` · ${formatDate(order.purchased_at, isKo)}`}
                    {order.fulfilled_at && ` → ${formatDate(order.fulfilled_at, isKo)}`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-950">
                    {formatPrice(order.price_aud_cents)}
                  </p>
                  {order.status === "ready" && (
                    <p className="mt-0.5 text-xs font-semibold text-emerald-600">
                      {isKo ? "다운로드 가능" : "Download available"}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <FileCheck2 className="mx-auto size-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            {isKo
              ? "아직 리포트가 없습니다. 위 브리프를 저장하면 리포트 제작과 구매가 가능합니다."
              : "No reports yet. Save a brief above to prepare for report purchase and production."}
          </p>
        </div>
      )}

      {/* Past orders */}
      {pastOrders.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[.12em] text-slate-400 hover:text-slate-600">
            {isKo ? "이전 주문 내역" : "Past orders"} ({pastOrders.length})
          </summary>
          <div className="mt-3 space-y-2">
            {pastOrders.map((order) => {
              const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.draft
              const product = PRODUCT_LABELS[order.product_id] ?? { en: order.product_id, ko: order.product_id }
              return (
                <div key={order.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                  <span className="text-slate-400">
                    <FileCheck2 className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-600">
                      {isKo ? product.ko : product.en}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {isKo ? status.ko : status.en} · {formatDate(order.created_at, isKo)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </details>
      )}
    </section>
  )
}

function useReportLocale() {
  const locale = useRouteLocale()
  return { locale, isKo: locale === "ko" }
}

function formatDate(value: string, isKo: boolean) {
  return new Intl.DateTimeFormat(isKo ? "ko-KR" : "en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

function formatPrice(cents: number) {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(cents / 100)
  } catch {
    return `A$${Math.round(cents / 100)}`
  }
}
