import type { Metadata } from "next"
import { FifoLaunchHub } from "./fifo-launch-hub"

export const metadata: Metadata = {
  title: "Australia FIFO Jobs & Entry Paths",
  description: "Compare evidence-backed Australian FIFO entry paths, training burden, current hiring requirements and pay before choosing where to spend time and money.",
  alternates: { canonical: "/fifo" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Australia FIFO Jobs & Entry Paths | CampCareer",
    description: "Compare practical FIFO entry paths before paying for tickets or training.",
  },
}

export default function FifoPage() {
  return <FifoLaunchHub />
}
