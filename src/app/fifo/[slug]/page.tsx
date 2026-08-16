import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FIFO_PATHS, getFifoPath } from "@/lib/fifo/fifo-paths"
import { FifoJobDetail } from "./fifo-job-detail"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return FIFO_PATHS.map((path) => ({ slug: path.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const path = getFifoPath(slug)

  if (!path) return {}

  return {
    title: `${path.name} FIFO Entry Path Australia | CampCareer`,
    description: `CampCareer research on the ${path.name} FIFO entry path in Australia, including entry burden, tickets, pay and demand evidence as verification is completed.`,
    alternates: { canonical: `/fifo/${path.slug}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: `${path.name} FIFO Entry Path Australia | CampCareer`,
      description: `Evidence-first research for people considering ${path.name} as an Australian FIFO entry path.`,
    },
  }
}

export default async function FifoJobPage({ params }: PageProps) {
  const { slug } = await params
  const path = getFifoPath(slug)

  if (!path) notFound()

  return <FifoJobDetail path={path} />
}
