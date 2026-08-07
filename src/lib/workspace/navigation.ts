import {
  LayoutDashboard,
  Map,
  Scale,
  Globe2,
  FileBadge2,
  BriefcaseBusiness,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  id: string
  label: string
  href: string
  icon: LucideIcon
  /** Short description used on the Home hub tiles. */
  blurb: string
  /** Strong accent color used for the active state and icons. */
  accent: string
  /** Soft pastel tint of the accent used for hover states. */
  tint: string
}

export const WORKSPACE_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: LayoutDashboard, blurb: "Overview of every tool in one place.", accent: "#2563eb", tint: "#eef4ff" },
  { id: "map", label: "Map", href: "/maps", icon: Map, blurb: "Explore countries and regions on an interactive map.", accent: "#3e7a2e", tint: "#edf5ea" },
  { id: "compare", label: "Compare", href: "/compare", icon: Scale, blurb: "Side-by-side country and career comparison.", accent: "#6d4fc4", tint: "#f3f0fa" },
  { id: "countries", label: "Countries", href: "/countries", icon: Globe2, blurb: "Find your destination, from country to city.", accent: "#2563eb", tint: "#eef4ff" },
  { id: "visas", label: "Visas", href: "/visas", icon: FileBadge2, blurb: "Understand the visa that fits your plan.", accent: "#6d4fc4", tint: "#f3f0fa" },
  { id: "occupation", label: "Occupation", href: "/occupation", icon: BriefcaseBusiness, blurb: "Search in-demand careers by field and country.", accent: "#c2691e", tint: "#fbf0e7" },
  { id: "programs", label: "Programs", href: "/programs", icon: GraduationCap, blurb: "Discover degrees and trade qualifications.", accent: "#3e7a2e", tint: "#edf5ea" },
]

/** Routes that render inside the workspace shell (sidebar + topbar). */
export const WORKSPACE_ROUTES = [
  "/",
  "/compare",
  "/countries",
  "/visas",
  "/occupation",
  "/programs",
  "/courses",
] as const

export function isWorkspaceRoute(pathname: string): boolean {
  return WORKSPACE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
}

export function getWorkspaceNavItem(id: string | undefined) {
  if (!id) return undefined
  return WORKSPACE_NAV_ITEMS.find((item) => item.id === id)
}
