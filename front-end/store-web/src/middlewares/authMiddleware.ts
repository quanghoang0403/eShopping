import { getUserInfo } from '@/utils/common.helper'
import { getCookie, localStorageKeys } from '@/utils/localStorage.helper'
import { GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'

const authMiddleware =
  <T extends { [key: string]: any }>(handler: (context: GetServerSidePropsContext<ParsedUrlQuery> & { user: IUser }) => Promise<{ props: T }>) =>
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<{ props: T } | { redirect: { destination: string; permanent: boolean } }> => {
    //const a = context.req.headers.authorization || context.req.cookies.token
    const token = getCookie(localStorageKeys.TOKEN) || ''
    const user = getUserInfo(token)
    if (user) {
      return handler({ ...context, user })
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
