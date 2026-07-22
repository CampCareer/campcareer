import "server-only"

// Keep the production entry point server-only. The pure pricing function lives
// separately so its upgrade rules can be tested without a Next.js runtime.
export { quoteReportOrder } from "@/lib/report-order-pricing"
