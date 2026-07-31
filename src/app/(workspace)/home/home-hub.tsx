"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import {
  Globe2,
  BriefcaseBusiness,
  FileBadge2,
  GraduationCap,
  ArrowUpRight,
  Map,
  Scale,
} from "lucide-react"
import { CategorySearch } from "@/components/workspace/category-search"
import { useSelectedCountry } from "@/components/workspace/country-context"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"

const KOREA_IMAGE =
  "https://images.unsplash.com/photo-1570191913384-7b4ff11716e7?w=400&h=250&fit=crop&auto=format"

const heroImage = (url: string) =>
  url.replace(/\?.*$/, "?w=1600&h=700&fit=crop&auto=format")

const HUB_TILES = [
  {
    id: "countries",
    href: "/countries",
    title: "Countries",
    blurb: "20 destinations. Choose a country, then drill down to region and city.",
    placeholder: "Search countries…",
    icon: Globe2,
    iconBg: "bg-[#eef4ff] text-[#2563eb]",
  },
  {
    id: "occupation",
    href: "/occupation",
    title: "Occupation",
    blurb: "Search in-demand careers across fields and countries.",
    placeholder: "Try “Nurse” or “Electrician”…",
    icon: BriefcaseBusiness,
    iconBg: "bg-[#fbf0e7] text-[#c2691e]",
  },
  {
    id: "visas",
    href: "/visas",
    title: "Visas",
    blurb: "Match a visa to your study, work or working-holiday plan.",
    placeholder: "Try “Working Holiday”…",
    icon: FileBadge2,
    iconBg: "bg-[#f3f0fa] text-[#6d4fc4]",
  },
  {
    id: "courses",
    href: "/courses",
    title: "Programs",
    blurb: "Discover degrees and trade qualifications that lead to work.",
    placeholder: "Try “Nursing” or “Carpentry”…",
    icon: GraduationCap,
    iconBg: "bg-[#edf5ea] text-[#3e7a2e]",
  },
]

export function HomeHub() {
  const router = useRouter()
  const { selectedCountry } = useSelectedCountry()
  const [query, setQuery] = useState<Record<string, string>>({})

  const bgCountry = selectedCountry
    ? LAUNCH_COUNTRIES.find((c) => c.code === selectedCountry.code) ?? null
    : null
  const bgImage = heroImage(bgCountry?.image ?? KOREA_IMAGE)
  const bgLabel = bgCountry?.name ?? "South Korea"

  const submit = (event: FormEvent, href: string, id: string) => {
    event.preventDefault()
    const q = query[id]?.trim()
    router.push(q ? `${href}?q=${encodeURIComponent(q)}` : href)
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15"
        />
        <div className="relative max-w-2xl px-6 py-16 sm:px-10 sm:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            CampCareer workspace
          </p>
          <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-white sm:text-[40px]">
            Explore, Compare, Decide Your Future
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-white/85">
            Compare countries, universities and careers to find the best path for you.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm">
            <Globe2 className="size-3.5" /> {bgLabel}
          </span>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HUB_TILES.map((tile) => {
          const Icon = tile.icon
          return (
            <form
              key={tile.id}
              onSubmit={(event) => submit(event, tile.href, tile.id)}
              className="group flex flex-col rounded-2xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#cfd8ee] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(37,99,235,0.18)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid size-10 place-items-center rounded-xl transition ${tile.iconBg}`}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <Link
                  href={tile.href}
                  aria-label={`Open ${tile.title}`}
                  className="grid size-8 place-items-center rounded-lg text-[#c4c2bc] transition hover:bg-[#f6f6f4] hover:text-[#1b1b1b]"
                >
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>

              <h2 className="mt-4 text-[16px] font-semibold tracking-[-0.01em] text-[#1b1b1b]">
                {tile.title}
              </h2>
              <p className="mt-1 text-[13px] leading-5.5 text-[#6f6d68]">{tile.blurb}</p>

              <div className="mt-auto pt-5">
                <CategorySearch
                  value={query[tile.id] ?? ""}
                  onChange={(value) => setQuery((prev) => ({ ...prev, [tile.id]: value }))}
                  placeholder={tile.placeholder}
                />
                <input type="submit" hidden aria-label={`Search ${tile.title}`} />
              </div>
            </form>
          )
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#e7e6e3] pt-6">
        <p className="text-[13px] font-medium text-[#6f6d68]">Or explore the full tools:</p>
        <Link
          href="/maps"
          className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#1b1b1b] transition hover:text-[#6f6d68]"
        >
          <Map className="size-4" /> Interactive map
        </Link>
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#1b1b1b] transition hover:text-[#6f6d68]"
        >
          <Scale className="size-4" /> Compare
        </Link>
      </div>
      </div>
    </div>
  )
}
