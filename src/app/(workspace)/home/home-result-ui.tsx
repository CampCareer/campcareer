import { type ReactNode } from "react"
import { HomePathSaveButton } from "./home-path-save"

type HomeResultHeaderProps = {
  eyebrow: string
  title: string
  description: string
  status: string
  verification?: string
}

export function HomeResultHeader({ eyebrow, title, description, status, verification }: HomeResultHeaderProps) {
  return (
    <header className="border-b border-[#e7e6e3] pb-6 sm:pb-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-700">{eyebrow}</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-[#1b1b1b] sm:text-[40px] sm:leading-[1.1]">{title}</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#5f5d57]">{description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <span className="inline-flex min-h-8 items-center rounded-full border border-blue-100 bg-blue-50 px-3 text-xs font-semibold text-blue-700">{status}</span>
          {verification && <span className="inline-flex min-h-8 items-center rounded-full border border-[#e7e6e3] bg-white px-3 text-xs font-medium text-[#5f5d57]">{verification}</span>}
          <HomePathSaveButton compact />
        </div>
      </div>
    </header>
  )
}

export function HomeResultMetrics({ items, label = "Result overview" }: { items: ReadonlyArray<readonly [string, string]>; label?: string }) {
  return (
    <section className="py-6 sm:py-7" aria-label={label}>
      <dl className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {items.map(([term, definition]) => (
          <div key={term} className="flex min-h-20 flex-col justify-center rounded-xl border border-[#e7e6e3] bg-white px-3.5 py-3 sm:px-4">
            <dt className="text-xs font-medium text-[#8a8882]">{term}</dt>
            <dd className="mt-1 text-sm font-semibold leading-5 text-[#292824]">{definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function ResultVerificationNotice({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-5 rounded-xl border border-[#dce6f7] bg-[#f7faff] px-4 py-3 text-sm leading-6 text-[#4a4842]" aria-label="Verification notice">
      {children}
    </aside>
  )
}
