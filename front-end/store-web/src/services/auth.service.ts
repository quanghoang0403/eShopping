import APIService from './base'

export default class AuthService {
  static signUp(body: ISignUpRequest): Promise<boolean> {
    return APIService.post('/auth/sign-up', body)
  }

  static signInWithGoogle(body: ISignInWithGoogleRequest): Promise<ISignInResponse> {
    return APIService.post('/auth/sign-in-with-google', body)
  }

  static signIn(body: ISignInRequest): Promise<ISignInResponse> {
    return APIService.post('/auth/sign-in', body)
  }

  static forgotPassword(body: { email: string }): Promise<boolean> {
    return APIService.post('/auth/renew-password', body)
  }
}
