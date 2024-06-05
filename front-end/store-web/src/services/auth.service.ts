import APIService from './base'

export default class AuthService {
  static signUp(body: ISignUpRequest): Promise<boolean> {
    return APIService.post('/authenticate/register', body)
  }

  static signIn(body: ISignInRequest): Promise<ISignInResponse> {
    return APIService.post('/authenticate/authenticate', body)
  }

  static forgotPassword(body: { email: string }): Promise<boolean> {
    return APIService.post('/authenticate/forgot-password', body)
  }
}
