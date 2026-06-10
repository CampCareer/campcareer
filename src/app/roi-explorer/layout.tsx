import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "ROI Explorer — Compare University ROI by Country",
  description: "Compare return on investment across universities in USA, Ireland, UK, Canada and Australia. Real salary data from government sources.",
  path: "/roi-explorer",
})

export default function ROIExplorerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
