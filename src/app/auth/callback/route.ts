import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCareerSaveIntentFromNext } from '@/lib/auth/career-save-intent'
import { getPostLoginDestination } from '@/lib/auth/post-login-destination'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const requestedNext = searchParams.get('next')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }

  const saveIntent = getCareerSaveIntentFromNext(requestedNext)
  const destination = saveIntent?.returnPath ?? getPostLoginDestination(requestedNext)
  const cookieStore = await cookies()
  const response = NextResponse.redirect(`${origin}${destination}`)
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

  if (saveIntent) {
    const { error: saveError } = await supabase
      .from('saved_career_results')
      .upsert(
        {
          user_id: data.user.id,
          country_code: saveIntent.countryCode,
          career_id: saveIntent.careerId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,country_code,career_id', ignoreDuplicates: false },
      )

    if (saveError) {
      console.error('Unable to complete career save after authentication', saveError)
    }
  }

  return response
}
