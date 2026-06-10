import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Study Abroad Checklist — Visa, Documents & Application Steps",
  description: "Country-specific study abroad checklists covering visa applications, required documents, and key deadlines for the US, UK, Ireland, Canada, and Australia.",
  path: "/checklist",
})

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
