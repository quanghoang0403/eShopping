import { MiddlewareFactory } from '@/types/system'
import { tokenExpired } from '@/utils/common.helper'
import { cookieKeys } from '@/utils/localStorage.helper'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { decode } from 'next-auth/jwt'
import { ExtendedToken } from '@/types/authNext'

function getSearchParam(param: string, url: any) {
  return url.searchParams.get(param)
}

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get(cookieKeys.TOKEN)
  const nextToken = request.cookies.get(cookieKeys.NEXT_TOKEN)
  if (nextToken) {
    const decoded = (await decode({
      token: nextToken.value,
      secret: process.env.NEXTAUTH_SECRET ?? '',
    })) as ExtendedToken
    if (decoded && decoded.accessTokenExpiresAt && decoded.accessTokenExpiresAt > Date.now()) {
      return true
    }
  }
  if (token && !tokenExpired(token.value)) {
    return true
  }
  return false
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
