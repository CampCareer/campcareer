import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPostLoginDestination } from '@/lib/auth/post-login-destination'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const requestedNext = searchParams.get('next')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(`${origin}/home`)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { error, data } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.user) return NextResponse.redirect(`${origin}/login?error=auth`)

  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('career_personalisation_completed_at')
    .eq('id', data.user.id)
    .maybeSingle()

  const destination = getPostLoginDestination(
    requestedNext,
    Boolean(preferences?.career_personalisation_completed_at),
  )
  response.headers.set('location', `${origin}${destination}`)
  return response
}
