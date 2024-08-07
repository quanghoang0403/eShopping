/* eslint-disable no-unused-vars */
import { Session, User, Account, Profile } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export enum TokenError {
  TokenExpiredError = 'TokenExpiredError',
}

export interface ExtendedToken extends JWT {
  customerId: string
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: number
  error?: TokenError
}

export interface ExtendedSession extends Session {
  accessToken: ExtendedToken['accessToken']
  error: ExtendedToken['error']
}

export enum EntityRequireLogin {
  POST = 'POST',
  COMMENT = 'COMMENT',
}

export const requiredLogins = [EntityRequireLogin.POST, EntityRequireLogin.COMMENT]
