import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { match } from '@formatjs/intl-localematcher'
// import Negotiator from '@formatjs/intl-localematcher'
// import { locales, defaultLocale } from '@/config/i18n'

// function getLocale(request: NextRequest): string {
//   const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
//   if (cookieLocale && locales.includes(cookieLocale as any)) {
//     return cookieLocale
//   }

//   const negotiatorHeaders: Record<string, string> = {}
//   request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

//   const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
//   return match(languages, locales, defaultLocale)
// }

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth')
  const isLoginPage = request.nextUrl.pathname === '/login'

  // Handle authentication
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // const locale = getLocale(request)
  const response = NextResponse.next()

  // Set locale cookie if it doesn't exist
  // if (!request.cookies.has('NEXT_LOCALE')) {
  //   response.cookies.set('NEXT_LOCALE', locale)
  // }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}