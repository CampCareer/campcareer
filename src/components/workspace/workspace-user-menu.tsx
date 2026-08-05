"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { LogIn, UserIcon } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

type WorkspaceUserMenuProps = {
  className?: string
  minimal?: boolean
}

export function WorkspaceUserMenu({ className, minimal = false }: WorkspaceUserMenuProps) {
  const [user, setUser] = useState<User | null>(null)
  const [avatarFailed, setAvatarFailed] = useState(false)

  useEffect(() => {
    // Create the browser client only after hydration. Static generation and CI
    // therefore do not require public Supabase environment variables.
    const supabase = createClient()
    let active = true

    void supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  useEffect(() => {
    setAvatarFailed(false)
  }, [avatarUrl])

  if (user) {
    return (
      <Link
        href="/profile"
        className={cn(
          "rounded-full transition hover:ring-2 hover:ring-blue-200",
          className
        )}
        aria-label="Open profile"
      >
        {avatarUrl && !avatarFailed ? (
          <img
            src={avatarUrl}
            alt=""
            className="size-7 rounded-full object-cover"
            onError={() => setAvatarFailed(true)}
          />
        ) : (
          <div className="flex size-7 items-center justify-center rounded-full bg-blue-100">
            <UserIcon className="size-4 text-blue-600" />
          </div>
        )}
      </Link>
    )
  }

  return (
    <Link
      href="/login"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-[#d8d8d4] bg-white px-3 py-2 text-sm font-semibold text-[#1b1b1b] transition hover:bg-[#f6f6f4]",
        minimal && "border-0 bg-transparent px-2 py-1 hover:bg-slate-100",
        className
      )}
    >
      <LogIn className="size-4" />
      {!minimal && <span>Log in</span>}
    </Link>
  )
}
