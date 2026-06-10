import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Saved Courses — Your Shortlist",
  description: "Your saved universities and courses across the US, UK, Ireland, Canada, and Australia.",
  path: "/saved",
})

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
