import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  // First handle i18n routing
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Exclude auth pages from i18n handling - they exist only at root level
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isAuthCallback = pathname === '/auth/callback'
  const isTestPage = pathname === '/test-tailwind'

  // Apply locale handling for non-API routes, excluding auth pages
  if (
    pathnameIsMissingLocale &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !isAuthPage &&
    !isAuthCallback &&
    !isTestPage
  ) {
    return intlMiddleware(request)
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Extract locale from pathname
  const locale =
    routing.locales.find((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) ||
    routing.defaultLocale

  // Protected routes (with locale support)
  const dashboardPattern = new RegExp(`^/(${routing.locales.join('|')})?/?dashboard`)
  if (dashboardPattern.test(pathname)) {
    if (!session) {
      // Redirect to non-localized login page
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from auth pages (auth pages don't have locale prefix)
  if (pathname === '/login' || pathname === '/signup') {
    if (session) {
      // Redirect to localized dashboard
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/', '/(en|es|pt)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
