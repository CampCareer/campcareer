import type { ReactNode } from "react"

type WorkspacePageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function WorkspacePageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: WorkspacePageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className ?? ""}`}>
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2563eb]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1b1b1b] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-[14.5px] leading-6 text-[#6f6d68]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}
