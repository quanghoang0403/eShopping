import { AxiosResponse } from 'axios'
import APIService from './base'

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
