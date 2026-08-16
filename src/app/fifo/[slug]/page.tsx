import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ALL_FIFO_PATHS, getAllFifoPath } from "@/lib/fifo/all-fifo-paths"
import { FifoJobDetail } from "./fifo-job-detail"
import { VerifiedEquipmentJobDetail } from "./verified-equipment-job-detail"
import { VerifiedFifoJobDetail } from "./verified-fifo-job-detail"
import { VerifiedRiggerJobDetail } from "./verified-rigger-job-detail"
import { VerifiedScaffolderJobDetail } from "./verified-scaffolder-job-detail"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return ALL_FIFO_PATHS.map((path) => ({ slug: path.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const path = getAllFifoPath(slug)

  if (!path) return {}
  const isVerified = path.status === "verified" && Boolean(path.published)

  return {
    title: `${path.name} FIFO Entry Path Australia | CampCareer`,
    description: isVerified
      ? `Evidence-backed CampCareer analysis of the ${path.name} FIFO entry path in Australia, including entry requirements, pay, demand and Entry Score.`
      : `CampCareer research on the ${path.name} FIFO entry path in Australia, including entry burden, tickets, pay and demand evidence as verification is completed.`,
    alternates: { canonical: `/fifo/${path.slug}` },
    robots: { index: isVerified, follow: true },
    openGraph: {
      title: `${path.name} FIFO Entry Path Australia | CampCareer`,
      description: isVerified
        ? `Evidence-backed entry score, pay and hiring requirements for ${path.name} FIFO work in Australia.`
        : `Evidence-first research for people considering ${path.name} as an Australian FIFO entry path.`,
    },
  }
}

export default async function FifoJobPage({ params }: PageProps) {
  const { slug } = await params
  const path = getAllFifoPath(slug)

  if (!path) notFound()

  if (path.status === "verified" && path.published) {
    if (path.slug === "dump-truck-operator") {
      return <VerifiedEquipmentJobDetail path={path} />
    }
    if (path.slug === "scaffolder") {
      return <VerifiedScaffolderJobDetail path={path} />
    }
    if (path.slug === "rigger") {
      return <VerifiedRiggerJobDetail path={path} />
    }
    return <VerifiedFifoJobDetail path={path} />
  }

  return <FifoJobDetail path={path} />
}
