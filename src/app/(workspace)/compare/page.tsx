import Link from "next/link"
import { ArrowUpRight, School, BriefcaseBusiness, Layers } from "lucide-react"

export const metadata = {
  title: "Compare",
  description: "Put universities, careers and majors side by side before you commit.",
  robots: { index: false, follow: false } as const,
}

const TOOLS = [
  {
    href: "/compare/schools",
    title: "Universities",
    description: "Compare universities across ranking, cost and location signals.",
    icon: School,
  },
  {
    href: "/compare/careers",
    title: "Careers",
    description: "Put occupations side by side by salary, outlook and pathway.",
    icon: BriefcaseBusiness,
  },
  {
    href: "/compare/majors",
    title: "Majors",
    description: "Compare study majors by earning power and job fit.",
    icon: Layers,
  },
]

export default function ComparePage() {
  return (
    <div>
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a3a19b]">
          Decide
        </p>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-[#1b1b1b] sm:text-[40px]">
          Compare before you commit.
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-[#6f6d68]">
          Put your shortlisted options next to each other — universities, careers
          and majors — using the same verified data as the rest of CampCareer.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-2xl border border-[#e7e6e3] bg-white p-5 transition hover:border-[#d8d8d4] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-[#f6f6f4] transition group-hover:bg-[#efeeeb]">
                  <Icon className="size-5 text-[#1b1b1b]" strokeWidth={2} />
                </span>
                <ArrowUpRight className="size-4 text-[#c4c2bc] transition group-hover:text-[#1b1b1b]" />
              </div>
              <h2 className="mt-4 text-[16px] font-semibold tracking-[-0.01em] text-[#1b1b1b]">
                {tool.title}
              </h2>
              <p className="mt-1 text-[13px] leading-5.5 text-[#6f6d68]">{tool.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
