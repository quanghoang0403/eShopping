import { MiddlewareFactory } from '@/types/system'
import { isAuthorized } from '@/utils/common.helper'
import { cookieKeys } from '@/utils/localStorage.helper'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'


async function verifyToken(request: NextRequest) {
  const token = request.cookies.get(cookieKeys.TOKEN)
  const nextToken = request.cookies.get(cookieKeys.NEXT_TOKEN)
  return await isAuthorized(token?.value, nextToken?.value)
}

export const withUser: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname
    const isAuthorized = await verifyToken(request)
    if (['/checkout', '/account', '/order']?.some((path) => pathname.startsWith(path))) {
      if (isAuthorized) {
        return next(request, _next)
      }
      const loginUrl = new URL(`/signin?from=${encodeURIComponent(pathname.replace('/', ''))}`, request.url)
      return NextResponse.redirect(loginUrl)
    }
    if (['/signin', '/register', '/forgot-pass']?.some((path) => pathname.startsWith(path))) {
      if (isAuthorized) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return next(request, _next)
    }
    return next(request, _next)
  }
}
