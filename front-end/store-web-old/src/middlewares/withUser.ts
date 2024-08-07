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
    console.log('Middleware withUser processing')
    if (['/gio-hang', '/tai-khoan-cua-toi', '/don-hang']?.some((path) => pathname.startsWith(path))) {
      const token = request.cookies.get(cookieKeys.TOKEN)
      const loginUrl = new URL(`/dang-nhap?from=${encodeURIComponent(pathname.replace('/', ''))}`, request.url)
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
    return next(request, _next)
  }
}
