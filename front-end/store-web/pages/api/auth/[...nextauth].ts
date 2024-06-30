import AuthService from '@/services/auth.service'
import NextAuth, { CallbacksOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { ExtendedToken, TokenError } from '@/types/authNext'

// import { signOut } from 'next-auth/react'

// const refreshAccessToken = async (tokenObject: any) => {
//   try {
//     // Get a new set of tokens with a refreshToken
//     const tokenResponse = await axios.post(
//       process.env.NEXTAUTH_URL + 'auth/refreshToken',
//       {
//         token: tokenObject.refreshToken,
//       }
//     )

//     return {
//       ...tokenObject,
//       accessToken: tokenResponse.data.accessToken,
//       accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
//       refreshToken: tokenResponse.data.refreshToken,
//     }
//   } catch (error) {
//     return {
//       ...tokenObject,
//       error: 'RefreshAccessTokenError',
//     }
//   }
// }

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

  // Subsequent requests to check auth sessions
  if (Date.now() < (token as ExtendedToken).accessTokenExpiresAt) {
    // console.log('ACCESS TOKEN STILL VALID, RETURNING EXTENDED TOKEN: ', token)
    return token
  }

  // Access token has expired
  // console.log('ACCESS TOKEN EXPIRED,')
  // token = await refreshAccessToken(token)

  // signOut()
  // doing something
  return { ...token, error: TokenError.TokenExpiredError }
  // return token
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
