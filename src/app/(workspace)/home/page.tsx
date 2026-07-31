import { HomeHub } from "./home-hub"

export const metadata = {
  title: "Home",
  description: "Plan your study-abroad career end to end: countries, occupations, visas and courses.",
  robots: { index: false, follow: false } as const,
}

export default function HomePage() {
  return <HomeHub />
}
