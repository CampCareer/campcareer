import { HomeFinder } from "@/components/home/home-finder"
import { pageMetadata } from "@/lib/seo"

export const revalidate = 86400
export const dynamic = "force-static"

export const metadata = pageMetadata({
  title: "CampCareer — Compare Countries by Degree, Salary, Cost & Immigration ROI",
  description:
    "Find the best country for your degree and career goals. Compare majors, graduate salaries, tax, rent, immigration policy, and the budget needed to study abroad.",
  path: "/",
})

export default function LandingPage() {
  return <HomeFinder />
}
