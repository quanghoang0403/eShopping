import APIService from './base'

export default class AuthService {
  static signUp(body: ISignUpRequest): Promise<{ token: string }> {
    return APIService.post('/authenticate/register', body)
  }

  static verifyEmail(body: { email: string }): Promise<{ token: string }> {
    return APIService.post('/authenticate/verify', body)
  }

  static signIn(body: ISignInRequest): Promise<ISignInResponse> {
    return APIService.post('/authenticate/authenticate', body)
  }

  static forgotPassword(body: IForgotPasswordRequest): Promise<{ token: string }> {
    return APIService.post('/authenticate/forgot-password', body)
  }
}
