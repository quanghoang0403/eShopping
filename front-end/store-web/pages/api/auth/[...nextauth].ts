import AuthService from '@/services/auth.service'
import NextAuth, { CallbacksOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { ExtendedToken, TokenError } from '@/types/authNext'

const jwtCallback: CallbacksOptions['jwt'] = async ({ token, account, user, profile }) => {
  if (account && user && profile) {
    const body: ISignInWithGoogleRequest = {
      email: token.email || '',
      fullName: token.name || '',
      thumbnail: token.picture || '',
    }

    try {
      const res = await AuthService.signInWithGoogle(body)
      let extendedToken: ExtendedToken = {
        ...token,
        customerId: res.customerId,
        accessToken: account.id_token as string,
        refreshToken: account.refresh_token as string,
        accessTokenExpiresAt: (account.expires_at as number) * 1000, // converted to ms
      }
      return extendedToken
    } catch (e) {
      console.log('\n create user error', e)
      return { ...token, error: TokenError.TokenExpiredError }
    }
  }

  if (Date.now() < (token as ExtendedToken).accessTokenExpiresAt) {
    return token
  }

  return { ...token, error: TokenError.TokenExpiredError }
}

const sessionCallback: CallbacksOptions['session'] = async ({ session, token }) => {
  Object.assign(session, {
    accessToken: (token as ExtendedToken).accessToken,
    error: (token as ExtendedToken).error,
  })
  return session
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
})
