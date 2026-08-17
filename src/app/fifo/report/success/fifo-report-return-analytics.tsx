"use client"

import { useEffect } from "react"
import { recordFifoCommerceEvent, type FifoCommerceAnalyticsEvent } from "@/lib/analytics"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import type { FifoReportReturnStatus } from "./fifo-report-success-page"

function eventForStatus(status: FifoReportReturnStatus): FifoCommerceAnalyticsEvent {
  if (status === "delivered" || status === "paid") return "fifo_checkout_completed"
  if (status === "processing") return "fifo_checkout_processing"
  if (status === "problem") return "fifo_checkout_failed"
  return "fifo_checkout_unverified"
}

export function FifoReportReturnAnalytics({ status }: { status: FifoReportReturnStatus }) {
  const locale = useRouteLocale()

  useEffect(() => {
    recordFifoCommerceEvent(eventForStatus(status), {
      surface: "fifo_report_success",
      locale,
      status,
      ...(status === "problem" ? { reason: "return_state" as const } : {}),
    })
  }, [locale, status])

  return null
}
