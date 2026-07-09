import type { PilotOccupation } from "@/lib/pilot-launch-gate"

// Public indexing starts only after a reviewed import supplies all required
// fields for at least 50 occupations per country. Keeping this empty prevents
// source-only placeholders from becoming thin SEO pages.
export const PILOT_OCCUPATIONS: PilotOccupation[] = []
