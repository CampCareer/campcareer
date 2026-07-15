export type RegionalDiscoveryCard = {
  code: string
  city: string
  region: string
  image: string
  accent: string
}

/** Curated city-first entry points for the regional Maps experience. */
export const REGIONAL_DISCOVERY: Partial<Record<string, readonly RegionalDiscoveryCard[]>> = {
  AU: [
    { code: "NSW", city: "Sydney", region: "New South Wales", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=900&h=620&fit=crop&auto=format", accent: "from-blue-950/65" },
    { code: "VIC", city: "Melbourne", region: "Victoria", image: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "QLD", city: "Brisbane", region: "Queensland", image: "https://images.unsplash.com/photo-1623027588467-24b2124f70b1?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
    { code: "WA", city: "Perth", region: "Western Australia", image: "https://images.unsplash.com/photo-1562161092-01d53ec54edd?w=900&h=620&fit=crop&auto=format", accent: "from-cyan-950/65" },
    { code: "SA", city: "Adelaide", region: "South Australia", image: "https://images.unsplash.com/photo-1596017497096-90ee17fb4e82?w=900&h=620&fit=crop&auto=format", accent: "from-rose-950/65" },
    { code: "QLD", city: "Gold Coast", region: "Queensland", image: "https://images.unsplash.com/photo-1691028355763-0c4144bf441b?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
  ],
  US: [
    { code: "NY", city: "New York", region: "New York", image: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/70" },
    { code: "CA", city: "California", region: "California", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&h=620&fit=crop&auto=format", accent: "from-orange-950/65" },
    { code: "IL", city: "Chicago", region: "Illinois", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&h=620&fit=crop&auto=format", accent: "from-sky-950/65" },
    { code: "MA", city: "Boston", region: "Massachusetts", image: "https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=900&h=620&fit=crop&auto=format", accent: "from-red-950/65" },
    { code: "WA", city: "Seattle", region: "Washington", image: "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "TX", city: "Texas", region: "Texas", image: "https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=900&h=620&fit=crop&auto=format", accent: "from-yellow-950/65" },
  ],
  CA: [
    { code: "ON", city: "Toronto", region: "Ontario", image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=900&h=620&fit=crop&auto=format", accent: "from-indigo-950/65" },
    { code: "BC", city: "Vancouver", region: "British Columbia", image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=900&h=620&fit=crop&auto=format", accent: "from-teal-950/65" },
    { code: "AB", city: "Calgary", region: "Alberta", image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=900&h=620&fit=crop&auto=format", accent: "from-emerald-950/65" },
    { code: "QC", city: "Montréal", region: "Quebec", image: "https://images.unsplash.com/photo-1519178614-68673b201f36?w=900&h=620&fit=crop&auto=format", accent: "from-fuchsia-950/65" },
  ],
  UK: [
    { code: "TLI", city: "London", region: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&h=620&fit=crop&auto=format", accent: "from-slate-950/70" },
    { code: "TLD", city: "Manchester", region: "North West", image: "https://images.unsplash.com/photo-1465447142348-e9952c393450?w=900&h=620&fit=crop&auto=format", accent: "from-red-950/65" },
    { code: "TLM", city: "Edinburgh", region: "Scotland", image: "https://images.unsplash.com/photo-1506377585622-bedcbb027afc?w=900&h=620&fit=crop&auto=format", accent: "from-violet-950/65" },
    { code: "TLG", city: "Birmingham", region: "West Midlands", image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=900&h=620&fit=crop&auto=format", accent: "from-amber-950/65" },
  ],
} as const

export function regionalDiscoveryFor(countryCode: string) {
  return REGIONAL_DISCOVERY[countryCode.toUpperCase()] ?? []
}
