import { createServerClient } from '@supabase/ssr'
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
  const _isAdminPage =
    pathname.startsWith('/admin') ||
    routing.locales.some((locale) => pathname.startsWith(`/${locale}/admin`))

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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options })
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
  const adminPattern = new RegExp(`^/(${routing.locales.join('|')})?/?admin`)

  if ((dashboardPattern.test(pathname) || adminPattern.test(pathname)) && !session) {
    // Redirect to non-localized login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages (auth pages don't have locale prefix)
  if ((pathname === '/login' || pathname === '/signup') && session) {
    // Redirect to localized dashboard
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/(en|es|pt)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
