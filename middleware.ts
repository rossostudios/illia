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

  // Apply locale handling for non-API routes
  if (pathnameIsMissingLocale && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
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
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  // Redirect authenticated users away from auth pages (with locale support)
  const authPattern = new RegExp(`^/(${routing.locales.join('|')})?/?(login|signup)$`)
  if (authPattern.test(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/', '/(en|es|pt)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
