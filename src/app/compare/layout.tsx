import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Country Compare — USA vs Ireland vs UK vs Canada vs Australia",
  description: "Side-by-side salary and ROI comparison across 5 countries. Find the best country for your career with real graduate earnings data.",
  alternates: { canonical: "/compare" },
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
