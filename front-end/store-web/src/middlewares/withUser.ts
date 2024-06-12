import { MiddlewareFactory } from '@/types/system'
import { tokenExpired } from '@/utils/common.helper'
import { cookieKeys } from '@/utils/localStorage.helper'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

function getSearchParam(param: string, url: any) {
  return url.searchParams.get(param)
}

export const withUser: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname

    if (['/checkout', '/account', '/order']?.some((path) => pathname.startsWith(path))) {
      const token = request.cookies.get(cookieKeys.TOKEN)
      const loginUrl = new URL(`/login?from=${encodeURIComponent(pathname.replace('/', ''))}`, request.url)
      // if no token found, redirect to login page
      if (!token || token.value === '') {
        console.log('Token not found')
        return NextResponse.redirect(loginUrl)
      }
      // verify token
      if (tokenExpired(token.value)) {
        console.log('Token is expired')
        return NextResponse.redirect(loginUrl)
      }
    }
    if (['/login', '/register', '/forgot-pass']?.some((path) => pathname.startsWith(path))) {
      const token = request.cookies.get(cookieKeys.TOKEN)
      if (!token || token.value === '') {
        return next(request, _next)
      }
      if (tokenExpired(token.value)) {
        return next(request, _next)
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
    return next(request, _next)
  }
}
