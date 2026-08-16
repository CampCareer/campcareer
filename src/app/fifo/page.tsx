import type { Metadata } from "next"
import { FifoHub } from "./fifo-hub"

export const metadata: Metadata = {
  title: "Australia FIFO Jobs & Entry Paths | CampCareer",
  description: "Compare CampCareer research on Australian FIFO entry paths, tickets, training burden and pay evidence before choosing where to spend time and money.",
  alternates: { canonical: "/fifo" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Australia FIFO Jobs & Entry Paths | CampCareer",
    description: "Compare practical FIFO entry paths before paying for tickets or training.",
  },
}

export default function FifoPage() {
  return <FifoHub />
}
