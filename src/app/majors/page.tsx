import { MajorsHub } from "@/components/discovery/discovery-hub"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({ title: "Explore Careers and Majors", description: "Explore 80 career paths and discover regional opportunities with reviewed evidence.", path: "/majors" })
export default function MajorsPage() { return <MajorsHub /> }
