"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChoiceCardProps {
  label: string
  selected: boolean
  onSelect: () => void
  /** Optional left slot — emoji, flag, or icon node. */
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

/**
 * Full-width tactile option card (Duolingo-style). Reused across the
 * degree-risk flow and anywhere a big, pressable single choice is needed.
 *
 * Depth/press/hover come from the .btn-3d utility (CSS, reduced-motion aware).
 * Framer Motion only animates the selection checkmark, so it never fights the
 * CSS press transform.
 */
export function ChoiceCard({
  label,
  selected,
  onSelect,
  icon,
  disabled = false,
  className,
}: ChoiceCardProps) {
  const reduce = useReducedMotion()

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "btn-3d group flex w-full items-center gap-4 rounded-2xl border-2 px-5 text-left",
        "min-h-[72px] md:min-h-[88px]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40",
        "disabled:opacity-60 disabled:pointer-events-none",
        selected
          ? "btn-3d-brand border-brand bg-brand-tint"
          : "border-slate-200 bg-white hover:border-slate-300",
        className
      )}
    >
      {icon != null && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl leading-none">
          {icon}
        </span>
      )}

      <span
        className={cn(
          "text-option flex-1 leading-snug",
          selected ? "text-brand" : "text-slate-700"
        )}
      >
        {label}
      </span>

      <span className="flex h-7 w-7 shrink-0 items-center justify-center">
        {selected && (
          <motion.span
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 22 }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-brand-foreground"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </motion.span>
        )}
      </span>
    </button>
  )
}
