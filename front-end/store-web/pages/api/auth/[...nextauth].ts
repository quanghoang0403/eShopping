import AuthService from '@/services/auth.service'
import NextAuth, { CallbacksOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { ExtendedToken, ProfileGG, TokenError } from '@/types/authNext'

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
  let extendedToken: ExtendedToken
  // console.log('Fresh token', { token })

  // User logs in for the first time
  if (account && user && profile) {
    extendedToken = {
      ...token,
      account,
      user,
      profile: profile as ProfileGG,
      accessToken: account.id_token as string,
      refreshToken: account.refresh_token as string,
      accessTokenExpiresAt: (account.expires_at as number) * 1000, // converted to ms
    }

    console.log('FIRST TIME LOGIN, EXTENDED TOKEN: ', extendedToken)
    // case handle sign up cho user lần đầu login bằng gg login

    const body: ISignUpWithGoogleRequest = {
      email: extendedToken.email || '',
      firstName: extendedToken?.profile?.given_name,
      lastName: extendedToken?.profile?.family_name,
      name: extendedToken.name || '',
      thumbnail: extendedToken.picture || '',
    }

    try {
      await AuthService.signUpWithGoogle(body)
    } catch (e) {
      console.log('\n create user error', e)
    }

    return extendedToken
  }

  // Subsequent requests to check auth sessions
  if (Date.now() < (token as ExtendedToken).accessTokenExpiresAt) {
    // console.log('ACCESS TOKEN STILL VALID, RETURNING EXTENDED TOKEN: ', token)
    return token
  }

  // Access token has expired
  console.log('ACCESS TOKEN EXPIRED,')
  // token = await refreshAccessToken(token)

  // signOut()
  // doing something
  return { ...token, error: TokenError.TokenExpiredError }
  // return token
}

const sessionCallback: CallbacksOptions['session'] = async ({ session, token }) => {
  console.log('SOMETHING WENT WRONG', { token })
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
