import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { LOCALE_COOKIE, DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, type Locale } from '@/lib/i18n/config'

function detectFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase().split('-')[0], q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  for (const { tag } of ranked) {
    if ((SUPPORTED_LOCALES as readonly string[]).includes(tag)) return tag as Locale
  }
  return DEFAULT_LOCALE
}

function resolveLocale(request: NextRequest): Locale {
  const param = request.nextUrl.searchParams.get('lang')
  if (isLocale(param)) return param
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(cookie)) return cookie
  return detectFromAcceptLanguage(request.headers.get('accept-language'))
}

function applyLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}

export async function middleware(request: NextRequest) {
  const locale = resolveLocale(request)
  // 현재 렌더가 쿠키를 즉시 읽을 수 있도록 request에도 세팅
  request.cookies.set(LOCALE_COOKIE, locale)

  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 로그인 필요한 페이지 보호
  const protectedPaths = ['/dashboard', '/saved', '/onboarding']
  if (!user && protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))) {
    const redirect = NextResponse.redirect(new URL('/login', request.url))
    applyLocaleCookie(redirect, locale)
    return redirect
  }

  applyLocaleCookie(supabaseResponse, locale)
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
