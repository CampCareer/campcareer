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

// 로그인 필요한 페이지 보호 (/timeline, /checklist는 비로그인 체험 허용 정책)
const PROTECTED_PATHS = ['/dashboard', '/saved', '/documents']

// GSC 정리(月0): 옛 워드프레스 잔재 + 사라진 직업 카드 URL을 명시적 410 Gone으로
// 응답. 기본 404보다 "영구 삭제됨" 신호가 강해 구글이 색인에서 더 빠르게 제거하고
// 크롤 예산 낭비를 줄인다. 살아있는 라우트는 어떤 패턴도 매칭하지 않는다.
const GONE_PATTERNS: RegExp[] = [
  /^\/\d{4}\/\d{2}(\/|$)/, // WP 날짜 퍼머링크: /2021/05/old-post
  /^\/category(\/|$)/, // WP 카테고리 아카이브
  /^\/tag(\/|$)/, // WP 태그 아카이브
  /^\/author(\/|$)/, // WP author 아카이브
  /^\/page\/\d+(\/|$)/, // WP 페이지네이션: /page/2
  /^\/feed(\/|$)/, // WP 피드
  /^\/comments\/feed(\/|$)/, // WP 댓글 피드
  /^\/sample-page(\/|$)/, // WP 기본 샘플 페이지
  /^\/jobs?(\/|$)/, // 사라진 직업 카드: /job, /jobs
]

const GONE_BODY =
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<title>410 Gone</title><meta name="robots" content="noindex"></head>' +
  '<body><h1>410 — Gone</h1><p>This page has been permanently removed.</p>' +
  '<p><a href="/">Go to CampCareer home</a></p></body></html>'

export async function middleware(request: NextRequest) {
  // 죽은 옛 URL은 locale/auth 처리 전에 즉시 410으로 끊는다.
  if (GONE_PATTERNS.some((re) => re.test(request.nextUrl.pathname))) {
    return new NextResponse(GONE_BODY, {
      status: 410,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }

  const locale = resolveLocale(request)
  // 현재 렌더가 쿠키를 즉시 읽을 수 있도록 request에도 세팅
  request.cookies.set(LOCALE_COOKIE, locale)

  const pathname = request.nextUrl.pathname
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))

  // 인증 판단이 필요 없는 경로(블로그·정적 페이지 등)에서는 Supabase Auth
  // 네트워크 왕복을 생략 — locale 쿠키만 처리하고 통과.
  if (!isProtected) {
    const response = NextResponse.next({ request })
    applyLocaleCookie(response, locale)
    return response
  }

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

  if (!user && isProtected) {
    const redirect = NextResponse.redirect(new URL('/login', request.url))
    applyLocaleCookie(redirect, locale)
    return redirect
  }

  applyLocaleCookie(supabaseResponse, locale)
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon\\.ico|sitemap.*\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|ttf|otf|mp4|webm|pdf)$).*)',
  ],
}
