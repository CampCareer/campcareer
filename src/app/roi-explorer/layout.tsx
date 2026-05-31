import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ROI Explorer — Compare University ROI by Country",
  description: "Compare return on investment across universities in USA, Ireland, UK, Canada and Australia. Real salary data from government sources.",
  alternates: { canonical: "/roi-explorer" },
}

export default function ROIExplorerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
