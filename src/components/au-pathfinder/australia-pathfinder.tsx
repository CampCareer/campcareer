"use client"

import { PathfinderWizard } from "./pathfinder-wizard"
import type { AuPathfinderProfile } from "@/lib/au-pathfinder"

export function AustraliaPathfinder({ initialProfile }: { initialProfile: AuPathfinderProfile }) {
  return <PathfinderWizard />
}
