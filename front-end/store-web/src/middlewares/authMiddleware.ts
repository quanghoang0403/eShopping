import { tokenExpired } from '@/utils/common.helper'
import { getCookie, localStorageKeys } from '@/utils/localStorage.helper'
import { GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'

const authMiddleware =
  <T extends { [key: string]: any }>(handler: (context: GetServerSidePropsContext<ParsedUrlQuery>) => Promise<{ props: T }>) =>
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<{ props: T } | { redirect: { destination: string; permanent: boolean } }> => {
    //const a = context.req.headers.authorization || context.req.cookies.token
    const token = getCookie(localStorageKeys.TOKEN) || ''
    const isExpired = tokenExpired(token)
    if (!isExpired) {
      return handler({ ...context })
    } else {
      return {
        redirect: {
          destination: '/dang-nhap',
          permanent: false,
        },
      }
    }
  }

export default authMiddleware
