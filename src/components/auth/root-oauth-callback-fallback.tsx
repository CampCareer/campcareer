"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

/**
 * Recovers an OAuth response that Supabase sends to the Site URL when its
 * redirect allow-list is temporarily missing the callback path. The normal
 * route remains /auth/callback; this only forwards an already-issued code.
 */
export function RootOAuthCallbackFallback() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  useEffect(() => {
    if (!code) return

    const callbackParams = new URLSearchParams({ code })
    const next = searchParams.get("next")
    if (next) callbackParams.set("next", next)

    window.location.replace(`/auth/callback?${callbackParams.toString()}`)
  }, [code, searchParams])

  return null
}
