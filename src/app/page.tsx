import { HomeFinder } from "@/components/home/home-finder"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "Compare Study Paths by Cost, Career Outcomes & Post-Study Options",
  description:
    "Search degrees, diplomas and trade qualifications, then compare total cost, career outcomes and post-study options across countries using verified sources.",
  path: "/",
})

export default function LandingPage() {
  return <HomeFinder locale="en" />
}
