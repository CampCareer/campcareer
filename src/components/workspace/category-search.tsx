"use client"

import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

type CategorySearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
  autoFocus?: boolean
}

export function CategorySearch({
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
}: CategorySearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9c9a94]" />
      <input
        type="search"
        role="searchbox"
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-12 w-full appearance-none rounded-xl border border-[#e0dfdb] bg-white pr-12 pl-11 text-[15px] text-[#1b1b1b] outline-none transition placeholder:text-[#a3a19b] focus:border-[#1b1b1b] focus:ring-4 focus:ring-[#1b1b1b]/5 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-[#9c9a94] transition hover:bg-[#f0efec] hover:text-[#1b1b1b]"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
