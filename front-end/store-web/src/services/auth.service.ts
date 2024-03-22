import { AxiosResponse } from 'axios'
import APIService, { APIServiceUpload } from './base'

export interface ISignUpRequest {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export interface ISignInRequest {
  email: string
  password?: string
  token?: string
}

export interface IForgotPasswordRequest {
  email: string
  password: string
  passwordConfirm: string
}

export interface ISignInResponse {
  token: string
  customerId: string
  accountId: string
}

export default class AuthService {
  static signUp(body: ISignUpRequest): Promise<AxiosResponse<{ token: string }>> {
    return APIService.post('/authenticate/register', body)
  }

  static verifyEmail(body: { email: string }): Promise<AxiosResponse<{ token: string }>> {
    return APIService.post('/authenticate/verify', body)
  }

  static signIn(body: ISignInRequest): Promise<AxiosResponse<ISignInResponse>> {
    return APIService.post('authenticate/authenticate', body)
  }

  static forgotPassword(body: IForgotPasswordRequest): Promise<AxiosResponse<{ token: string }>> {
    return APIService.post('authenticate/forgot-password', body)
  }
}
