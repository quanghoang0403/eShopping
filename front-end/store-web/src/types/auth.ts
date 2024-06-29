interface ISignUpRequest {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

interface ISignUpWithGoogleRequest {
  email: string
  firstName: string
  lastName: string
  name: string
  thumbnail?: string
}

interface ISignInRequest {
  email: string
  password?: string
  token?: string
}

interface ISignInResponse {
  token: string
  refreshToken: string
  customerId: string
  accountId: string
  permissions: IPermission[]
}
