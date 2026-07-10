import type { PilotOccupation } from "@/lib/pilot-launch-gate"
import { JAPAN_OCCUPATION_REVIEW_QUEUE } from "@/data/jp-official-data"

// Review-required imports are included for collection reporting, but every
// route and sitemap entry still requires isPilotOccupationIndexable().
export const PILOT_OCCUPATIONS: PilotOccupation[] = [...JAPAN_OCCUPATION_REVIEW_QUEUE]
