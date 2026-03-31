import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_PATHS = ['/admin']
const ACCOUNT_PATHS = ['/account', '/checkout']
const AUTH_PATHS = ['/login', '/register']

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/?error=forbidden', req.url))
    }
  }

  if (ACCOUNT_PATHS.some(p => pathname.startsWith(p))) {
    if (!session) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url))
    }
    if (session.user.active === false) {
      return NextResponse.redirect(new URL('/login?error=account-disabled', req.url))
    }
  }

  if (session && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|_next/webpack-hmr).*)'],
}
