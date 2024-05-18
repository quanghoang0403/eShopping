import { tokenExpired } from '@/utils/common.helper'
import { cookieKeys } from '@/utils/localStorage.helper'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('Middleware processing')
  const pathname = req.nextUrl.pathname
  if (!pathname.startsWith('/gio-hang') || !pathname.startsWith('/don-hang') || !pathname.startsWith('/don-hang-cua-toi')) return NextResponse.next()

  const cookie = req.headers.get(cookieKeys.TOKEN)

  if (!cookie) {
    return NextResponse.rewrite(new URL('/dang-nhap', req.url))
  }

  // get token from cookie
  const token = cookie.split('=')[1]

  // if no token found, redirect to login page
  if (!token || token === '') {
    return NextResponse.rewrite(new URL('/dang-nhap', req.url))
  }

  // verify token
  const isExpired = tokenExpired(token)
  if (isExpired) {
    console.log('Token is expired')
    return NextResponse.rewrite(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}
