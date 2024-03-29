interface ISignUpRequest {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

interface ISignInRequest {
  email: string
  password?: string
  token?: string
}

interface IForgotPasswordRequest {
  email: string
  password: string
  passwordConfirm: string
}

interface ISignInResponse {
  token: string
  customerId: string
  accountId: string
}
