export const COMPARE_MODE_NAV_ITEMS = [
  {
    type: "program",
    label: "Programs",
    href: "/compare?type=program&country=AU&field=nursing",
  },
  {
    type: "country",
    label: "Countries",
    href: "/compare?type=country&goal=registered-nurse&profile=starting-from-scratch",
  },
  {
    type: "career",
    label: "Careers",
    href: "/compare?type=career&country=AU&profile=starting-from-scratch",
  },
] as const

export type CompareModeType = (typeof COMPARE_MODE_NAV_ITEMS)[number]["type"]
